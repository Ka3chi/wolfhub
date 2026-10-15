import { cacheLife } from "next/cache";
import type { Anime, AnimeDetails, Paged, WatchOption } from "./types";

// AniList (https://anilist.co) — public GraphQL API, no key needed.
// Rate limit is ~30–90 requests/minute, so every call is cached.

const API_URL = "https://graphql.anilist.co";

/** Named lists, mapped to AniList query variables. */
export const LISTS = {
  trending: { label: "Trending", vars: { sort: ["TRENDING_DESC"] } },
  airing: { label: "Airing Now", vars: { sort: ["POPULARITY_DESC"], status: "RELEASING" } },
  popular: { label: "All-Time Popular", vars: { sort: ["POPULARITY_DESC"] } },
  top: { label: "Top Rated", vars: { sort: ["SCORE_DESC"] } },
  upcoming: { label: "Upcoming", vars: { sort: ["POPULARITY_DESC"], status: "NOT_YET_RELEASED" } },
  movies: { label: "Movies", vars: { sort: ["POPULARITY_DESC"], format: "MOVIE" } },
} as const;

export type ListName = keyof typeof LISTS;

/** AniList's genre names (Hentai is excluded). */
export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
] as const;

export function isListName(value: string): value is ListName {
  return Object.hasOwn(LISTS, value);
}

export function isGenre(value: string): value is (typeof GENRES)[number] {
  return (GENRES as readonly string[]).includes(value);
}

/** Parses a `?page=` value; AniList serves at most 500 pages. */
export function parsePage(value: string | string[] | null | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page >= 1 && page <= 500 ? page : 1;
}

/** Parses a numeric route id, or returns null if it isn't one. */
export function parseId(value: string) {
  return /^\d{1,10}$/.test(value) ? Number(value) : null;
}

type ExternalLink = {
  site: string;
  url: string;
  type: string;
  icon: string | null;
  color: string | null;
};

type AniListMedia = {
  id: number;
  title: { english: string | null; romaji: string | null };
  coverImage: { extraLarge: string | null; large: string | null };
  bannerImage: string | null;
  startDate: { year: number | null };
  averageScore: number | null;
  format: string | null;
  episodes: number | null;
  description: string | null;
  externalLinks: ExternalLink[];
};

type AniListDetails = AniListMedia & {
  genres: string[];
  status: string | null;
  duration: number | null;
  season: string | null;
  seasonYear: number | null;
  studios: { nodes: { name: string }[] };
  trailer: { id: string; site: string } | null;
  streamingEpisodes: { title: string; thumbnail: string | null; url: string; site: string }[];
  characters: {
    edges: {
      role: string;
      node: { name: { full: string }; image: { medium: string | null } };
    }[];
  };
  recommendations: { nodes: { mediaRecommendation: AniListMedia | null }[] };
};

const MEDIA_FIELDS = `
  id
  title { english romaji }
  coverImage { extraLarge large }
  bannerImage
  startDate { year }
  averageScore
  format
  episodes
  description(asHtml: false)
  externalLinks { site url type icon color }
`;

const PAGE_QUERY = `
  query (
    $page: Int, $perPage: Int, $sort: [MediaSort], $search: String,
    $status: MediaStatus, $format: MediaFormat, $genre: String
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage }
      media(
        type: ANIME, isAdult: false, sort: $sort, search: $search,
        status: $status, format: $format, genre: $genre
      ) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const DETAILS_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      ${MEDIA_FIELDS}
      genres
      status
      duration
      season
      seasonYear
      studios(isMain: true) { nodes { name } }
      trailer { id site }
      streamingEpisodes { title thumbnail url site }
      characters(sort: [ROLE, RELEVANCE], perPage: 16) {
        edges { role node { name { full } image { medium } } }
      }
      recommendations(sort: RATING_DESC, perPage: 12) {
        nodes { mediaRecommendation { ${MEDIA_FIELDS} } }
      }
    }
  }
`;

async function anilist<T>(query: string, variables: Record<string, unknown>) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "user-agent": "WolfHub/1.0",
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = (await res.json()) as {
    data: T | null;
    errors?: { message: string; status?: number }[];
  };
  if (body.errors?.some((e) => e.status === 404)) return null;
  if (!res.ok || body.errors) {
    throw new Error(
      `AniList request failed with ${res.status}: ${body.errors?.[0]?.message ?? "unknown error"}`,
    );
  }
  return body.data;
}

function cleanDescription(text: string | null) {
  if (!text) return "";
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Official channels (e.g. Muse Asia) post full seasons as YouTube playlists. */
function youtubePlaylistId(url: string) {
  try {
    const parsed = new URL(url);
    if (!/(^|\.)youtube\.com$/.test(parsed.hostname)) return null;
    return parsed.searchParams.get("list");
  } catch {
    return null;
  }
}

function freePlaylist(links: ExternalLink[]) {
  for (const link of links) {
    if (link.type !== "STREAMING") continue;
    const id = youtubePlaylistId(link.url);
    if (id) return id;
  }
  return null;
}

const FORMAT_LABELS: Record<string, string> = {
  TV: "TV",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
};

function toAnime(raw: AniListMedia): Anime {
  return {
    id: raw.id,
    title: raw.title.english ?? raw.title.romaji ?? "Untitled",
    posterUrl: raw.coverImage.extraLarge ?? raw.coverImage.large,
    bannerUrl: raw.bannerImage,
    year: raw.startDate.year,
    rating: raw.averageScore ? raw.averageScore / 10 : null,
    format: raw.format ? (FORMAT_LABELS[raw.format] ?? raw.format) : null,
    episodes: raw.episodes,
    overview: cleanDescription(raw.description),
    freePlaylistId: freePlaylist(raw.externalLinks),
  };
}

type PageData = {
  Page: { pageInfo: { hasNextPage: boolean }; media: AniListMedia[] };
};

async function fetchPage(variables: Record<string, unknown>, page: number, perPage = 24) {
  const data = await anilist<PageData>(PAGE_QUERY, { ...variables, page, perPage });
  return {
    page,
    hasNextPage: data?.Page.pageInfo.hasNextPage ?? false,
    results: data?.Page.media.map(toAnime) ?? [],
  } satisfies Paged<Anime>;
}

export async function getList(
  list: ListName,
  page = 1,
  genre?: string,
): Promise<Paged<Anime>> {
  "use cache";
  cacheLife("hours");

  return fetchPage({ ...LISTS[list].vars, genre }, page);
}

export async function searchAnime(query: string, page = 1): Promise<Paged<Anime>> {
  "use cache";
  cacheLife("hours");

  return fetchPage({ search: query, sort: ["SEARCH_MATCH"] }, page);
}

export const FREE_SORTS = {
  popular: { label: "Most Popular", sort: "POPULARITY_DESC" },
  trending: { label: "Trending", sort: "TRENDING_DESC" },
  top: { label: "Top Rated", sort: "SCORE_DESC" },
} as const;

export type FreeSort = keyof typeof FREE_SORTS;

export function isFreeSort(value: string): value is FreeSort {
  return Object.hasOwn(FREE_SORTS, value);
}

/**
 * Anime with an official free YouTube playlist. AniList can't filter by
 * streaming link, so this scans the top 200 titles and keeps the free ones
 * (typically 50–80).
 */
export async function getFreeAnime(sort: FreeSort): Promise<Anime[]> {
  "use cache";
  cacheLife("days");

  const vars = { sort: [FREE_SORTS[sort].sort] };
  const pages = await Promise.all([1, 2, 3, 4].map((page) => fetchPage(vars, page, 50)));
  return pages.flatMap((p) => p.results).filter((anime) => anime.freePlaylistId);
}

export async function getAnimeDetails(id: number): Promise<AnimeDetails | null> {
  "use cache";
  cacheLife("days");

  const data = await anilist<{ Media: AniListDetails | null }>(DETAILS_QUERY, { id });
  const raw = data?.Media;
  if (!raw) return null;

  const streaming = raw.externalLinks.filter((l) => l.type === "STREAMING");
  return {
    ...toAnime(raw),
    genres: raw.genres,
    status: raw.status ? raw.status.replaceAll("_", " ").toLowerCase() : null,
    runtime: raw.duration,
    studios: raw.studios.nodes.map((s) => s.name),
    season:
      raw.season && raw.seasonYear ? `${raw.season.toLowerCase()} ${raw.seasonYear}` : null,
    trailerYoutubeId: raw.trailer?.site === "youtube" ? raw.trailer.id : null,
    watchOptions: streaming.map(
      (l): WatchOption => ({
        name: l.site,
        url: l.url,
        logoUrl: l.icon,
        color: l.color,
        type: youtubePlaylistId(l.url) || /tubi|pluto/i.test(l.site) ? "free" : "stream",
      }),
    ),
    // AniList lists newest episodes last; show the latest first.
    episodeLinks: raw.streamingEpisodes
      .slice(-24)
      .reverse()
      .map((e) => ({ title: e.title, thumbnailUrl: e.thumbnail, url: e.url, site: e.site })),
    cast: raw.characters.edges.map((e) => ({
      name: e.node.name.full,
      role: e.role.charAt(0) + e.role.slice(1).toLowerCase(),
      imageUrl: e.node.image.medium,
    })),
    related: raw.recommendations.nodes
      .map((n) => n.mediaRecommendation)
      .filter((m): m is AniListMedia => m !== null)
      .map(toAnime),
  };
}
