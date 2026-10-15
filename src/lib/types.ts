export type Anime = {
  id: number;
  title: string;
  posterUrl: string | null;
  bannerUrl: string | null;
  year: number | null;
  /** Normalized to a 0–10 scale. */
  rating: number | null;
  /** TV, MOVIE, OVA, … in display form. */
  format: string | null;
  episodes: number | null;
  overview: string;
  /** An official free YouTube playlist that can be played in-app. */
  freePlaylistId: string | null;
};

export type CastMember = {
  name: string;
  role: string | null;
  imageUrl: string | null;
};

/** An official, legal place to watch a title. */
export type WatchOption = {
  name: string;
  url: string;
  logoUrl: string | null;
  /** Brand color when AniList provides one. */
  color: string | null;
  type: "free" | "stream";
};

export type EpisodeLink = {
  title: string;
  thumbnailUrl: string | null;
  url: string;
  site: string;
};

export type AnimeDetails = Anime & {
  genres: string[];
  status: string | null;
  /** Minutes per episode. */
  runtime: number | null;
  studios: string[];
  season: string | null;
  trailerYoutubeId: string | null;
  watchOptions: WatchOption[];
  episodeLinks: EpisodeLink[];
  cast: CastMember[];
  related: Anime[];
};

export type Paged<T> = {
  page: number;
  hasNextPage: boolean;
  results: T[];
};
