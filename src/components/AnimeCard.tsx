import Image from "next/image";
import Link from "next/link";
import type { Anime } from "@/lib/types";

export function AnimeCard({ anime }: { anime: Anime }) {
  const free = Boolean(anime.freePlaylistId);
  return (
    <Link href={`/anime/${anime.id}`} className="group block">
      <div className="relative">
        <div
          className={
            "absolute -inset-1 rounded-2xl bg-linear-to-br opacity-0 blur-lg transition duration-300 group-hover:opacity-100 " +
            (free ? "from-emerald-500/60 to-teal-300/60" : "from-violet-500/60 to-fuchsia-400/60")
          }
        />
        <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
          {anime.posterUrl ? (
            <Image
              src={anime.posterUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-3 text-center text-sm text-zinc-400">
              {anime.title}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 pl-1 text-lg text-black shadow-xl">
              ▶
            </span>
          </div>
          <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1">
            {anime.rating ? (
              <span className="rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-bold text-amber-400 backdrop-blur">
                ★ {anime.rating.toFixed(1)}
              </span>
            ) : (
              <span />
            )}
            {free ? (
              <span className="rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-black shadow">
                ▶ Free
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <h3 className="mt-2.5 line-clamp-1 text-sm font-semibold">{anime.title}</h3>
      <p className="flex gap-2 text-xs text-violet-300">
        {[anime.format, anime.year, anime.episodes ? `${anime.episodes} eps` : null]
          .filter(Boolean)
          .join(" · ") || "—"}
      </p>
    </Link>
  );
}

export function AnimeCardSkeleton() {
  return (
    <div>
      <div className="aspect-2/3 animate-pulse rounded-xl bg-white/10" />
      <div className="mt-2.5 h-4 w-3/4 animate-pulse rounded bg-white/10" />
      <div className="mt-1 h-3 w-1/2 animate-pulse rounded bg-white/10" />
    </div>
  );
}
