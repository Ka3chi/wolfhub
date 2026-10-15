import { Suspense } from "react";
import { AnimeRow, AnimeRowSkeleton } from "@/components/AnimeRow";
import { HeroSlider } from "@/components/HeroSlider";
import { getFreeAnime, getList, type ListName } from "@/lib/anilist";
import type { Anime } from "@/lib/types";

type Row = {
  title: string;
  href: string;
  tone?: "violet" | "emerald";
  load: () => Promise<Anime[]>;
};

const fromList = (list: ListName, genre?: string) => async () =>
  (await getList(list, 1, genre)).results;

const ROWS: Row[] = [
  {
    title: "Watch Free Now",
    href: "/free?sort=trending",
    tone: "emerald",
    load: () => getFreeAnime("trending"),
  },
  { title: "Trending", href: "/browse?list=trending", load: fromList("trending") },
  { title: "Airing Now", href: "/browse?list=airing", load: fromList("airing") },
  {
    title: "Free Fan Favorites",
    href: "/free?sort=popular",
    tone: "emerald",
    load: () => getFreeAnime("popular"),
  },
  { title: "Top Rated", href: "/browse?list=top", load: fromList("top") },
  { title: "Action", href: "/browse?list=popular&genre=Action", load: fromList("popular", "Action") },
  { title: "Anime Movies", href: "/browse?list=movies", load: fromList("movies") },
  { title: "Romance", href: "/browse?list=popular&genre=Romance", load: fromList("popular", "Romance") },
  { title: "Coming Soon", href: "/browse?list=upcoming", load: fromList("upcoming") },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <Suspense fallback={<div className="aspect-4/5 animate-pulse rounded-2xl bg-white/10 sm:aspect-21/9" />}>
        <Hero />
      </Suspense>
      {ROWS.map((row) => (
        <Suspense key={row.title} fallback={<AnimeRowSkeleton title={row.title} tone={row.tone} />}>
          <AnimeRow {...row} />
        </Suspense>
      ))}
    </div>
  );
}

async function Hero() {
  const { results } = await getList("trending");
  const slides = results
    .filter((anime) => anime.bannerUrl)
    .slice(0, 7)
    .map((anime, i) => ({
      key: String(anime.id),
      href: `/anime/${anime.id}`,
      title: anime.title,
      overview: anime.overview,
      imageUrl: anime.bannerUrl!,
      badge: `#${i + 1} Trending`,
      badgeClass: "text-fuchsia-300",
      year: anime.year,
      rating: anime.rating,
      free: Boolean(anime.freePlaylistId),
    }));
  return <HeroSlider slides={slides} />;
}
