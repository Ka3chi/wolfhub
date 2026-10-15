import type { Anime } from "@/lib/types";
import { AnimeCard, AnimeCardSkeleton } from "./AnimeCard";

const GRID =
  "grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

export function AnimeGrid({ items }: { items: Anime[] }) {
  if (items.length === 0) {
    return <p className="py-12 text-center text-zinc-400">Nothing found.</p>;
  }
  return (
    <div className={GRID}>
      {items.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}

export function AnimeGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className={GRID}>
      {Array.from({ length: count }, (_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}
