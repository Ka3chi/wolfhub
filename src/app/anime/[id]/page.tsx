import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AnimeCarousel } from "@/components/AnimeRow";
import { Carousel, Slide } from "@/components/Carousel";
import { getAnimeDetails, parseId } from "@/lib/anilist";
import type { AnimeDetails, WatchOption } from "@/lib/types";

async function load(params: PageProps<"/anime/[id]">["params"]) {
  const id = parseId((await params).id);
  if (id === null) notFound();
  const anime = await getAnimeDetails(id);
  if (!anime) notFound();
  return anime;
}

export async function generateMetadata({ params }: PageProps<"/anime/[id]">): Promise<Metadata> {
  const anime = await load(params);
  return {
    title: anime.title,
    description: anime.overview.slice(0, 160),
    openGraph: anime.bannerUrl ? { images: [anime.bannerUrl] } : undefined,
  };
}

// /anime/{id}
export default async function AnimePage({ params }: PageProps<"/anime/[id]">) {
  const anime = await load(params);

  return (
    <article className="space-y-12">
      <header>
        {anime.bannerUrl ? (
          <div className="relative -mx-4 -mt-8 aspect-21/9 max-h-115 w-[calc(100%+2rem)] overflow-hidden sm:-mx-6 sm:w-[calc(100%+3rem)]">
            <Image src={anime.bannerUrl} alt="" fill preload sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0d0b1f] via-[#0d0b1f]/50 to-transparent" />
          </div>
        ) : null}

        <div
          className={
            "relative flex flex-col gap-6 sm:flex-row sm:gap-8 " +
            (anime.bannerUrl ? "-mt-24 sm:-mt-36" : "")
          }
        >
          <div className="relative aspect-2/3 w-40 shrink-0 self-start overflow-hidden rounded-2xl bg-white/5 shadow-2xl ring-1 ring-white/15 sm:w-60">
            {anime.posterUrl ? (
              <Image
                src={anime.posterUrl}
                alt={`${anime.title} poster`}
                fill
                sizes="240px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1 sm:pt-28">
            {anime.freePlaylistId ? (
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-400">
                ▶ Free to watch
              </p>
            ) : (
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-violet-300">
                {anime.format ?? "Anime"}
              </p>
            )}
            <h1 className="mt-1 text-3xl font-black sm:text-5xl">{anime.title}</h1>
            <Facts anime={anime} />

            {anime.genres.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <li key={genre}>
                    <Link
                      href={`/browse?list=popular&genre=${encodeURIComponent(genre)}`}
                      className="glass block rounded-full px-3 py-1 text-xs text-zinc-200 hover:bg-white/15"
                    >
                      {genre}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {anime.freePlaylistId ? (
                <a
                  href="#watch"
                  className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition hover:scale-105 hover:bg-emerald-400"
                >
                  ▶ Watch free now
                </a>
              ) : null}
              {anime.trailerYoutubeId ? (
                <a
                  href="#trailer"
                  className={
                    "rounded-full px-6 py-2.5 text-sm font-bold transition hover:scale-105 " +
                    (anime.freePlaylistId
                      ? "glass hover:bg-white/15"
                      : "bg-white text-black hover:bg-zinc-200")
                  }
                >
                  ▶ Play trailer
                </a>
              ) : null}
              {anime.watchOptions.length > 0 ? (
                <a
                  href="#where"
                  className="glass rounded-full px-6 py-2.5 text-sm font-bold transition hover:bg-white/15"
                >
                  Where to watch
                </a>
              ) : null}
            </div>

            {anime.overview ? (
              <p className="mt-6 max-w-3xl whitespace-pre-line leading-relaxed text-zinc-300">
                {anime.overview}
              </p>
            ) : null}

            {anime.studios.length > 0 ? (
              <p className="mt-4 text-sm text-zinc-400">
                <span className="text-zinc-300">Studio:</span> {anime.studios.slice(0, 3).join(", ")}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {anime.freePlaylistId ? (
        <Block id="watch" title="Watch free" note="Official stream on YouTube · use the playlist icon to pick an episode">
          <Player
            src={`https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(anime.freePlaylistId)}`}
            title={`${anime.title} episodes`}
          />
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400">
            <a
              href={`https://www.youtube.com/playlist?list=${encodeURIComponent(anime.freePlaylistId)}`}
              target="_blank"
              rel="noreferrer"
              className="glass rounded-full px-4 py-1.5 font-semibold text-white hover:bg-white/15"
            >
              Open on YouTube ↗
            </a>
            <span>Age-restricted or region-locked videos only play on YouTube itself.</span>
          </div>
        </Block>
      ) : null}

      {anime.watchOptions.length > 0 ? (
        <Block id="where" title="Where to watch" note="Official streaming services">
          <WatchOptions options={anime.watchOptions} />
        </Block>
      ) : null}

      {anime.trailerYoutubeId ? (
        <Block id="trailer" title="Trailer">
          <Player
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(anime.trailerYoutubeId)}`}
            title={`${anime.title} trailer`}
          />
        </Block>
      ) : null}

      {anime.episodeLinks.length > 0 ? (
        <Block title="Episodes" note={`Official streams on ${anime.episodeLinks[0].site}`}>
          <Carousel label="Episodes">
            {anime.episodeLinks.map((episode) => (
              <Slide key={episode.url} wide>
                <a href={episode.url} target="_blank" rel="noreferrer" className="group block">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
                    {episode.thumbnailUrl ? (
                      // Episode thumbnails come from many CDNs, so skip next/image here.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={episode.thumbnailUrl}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : null}
                    <span className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 pl-0.5 text-sm text-black">
                      ▶
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-medium">{episode.title}</p>
                </a>
              </Slide>
            ))}
          </Carousel>
        </Block>
      ) : null}

      {anime.cast.length > 0 ? (
        <Block title="Characters">
          <Carousel label="Characters">
            {anime.cast.map((person, i) => (
              <Slide key={`${person.name}-${i}`}>
                <div className="relative mx-auto aspect-square w-28 overflow-hidden rounded-full bg-white/5 ring-2 ring-white/10 sm:w-32">
                  {person.imageUrl ? (
                    <Image src={person.imageUrl} alt="" fill sizes="128px" className="object-cover" />
                  ) : null}
                </div>
                <p className="mt-2 line-clamp-1 text-center text-sm font-semibold">{person.name}</p>
                {person.role ? (
                  <p className="line-clamp-1 text-center text-xs text-violet-300">{person.role}</p>
                ) : null}
              </Slide>
            ))}
          </Carousel>
        </Block>
      ) : null}

      {anime.related.length > 0 ? (
        <AnimeCarousel title="More like this" items={anime.related} />
      ) : null}
    </article>
  );
}

function Block({
  id,
  title,
  note,
  children,
}: {
  id?: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-xl font-bold">{title}</h2>
        {note ? <p className="text-sm text-zinc-400">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Player({ src, title }: { src: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        className="aspect-video w-full"
      />
    </div>
  );
}

function WatchOptions({ options }: { options: WatchOption[] }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {options.map((option) => (
        <li key={option.url}>
          <a
            href={option.url}
            target="_blank"
            rel="noreferrer"
            className="glass flex items-center gap-3 rounded-xl py-2 pl-2 pr-4 transition hover:bg-white/15"
            style={option.color ? { boxShadow: `inset 3px 0 0 ${option.color}` } : undefined}
          >
            {option.logoUrl ? (
              <Image
                src={option.logoUrl}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg object-contain"
              />
            ) : (
              <span className="h-9 w-9 rounded-lg bg-white/10" />
            )}
            <span>
              <span className="block text-sm font-semibold">{option.name}</span>
              <span
                className={
                  "block text-xs " + (option.type === "free" ? "text-emerald-400" : "text-zinc-400")
                }
              >
                {option.type === "free" ? "Free" : "Stream"}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function Facts({ anime }: { anime: AnimeDetails }) {
  const facts = [
    anime.format,
    anime.season ?? anime.year,
    anime.episodes ? `${anime.episodes} episodes` : null,
    anime.runtime ? `${anime.runtime} min${anime.format === "Movie" ? "" : "/ep"}` : null,
    anime.status,
  ].filter(Boolean);

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-300">
      {anime.rating ? (
        <span className="font-bold text-amber-400">★ {anime.rating.toFixed(1)}</span>
      ) : null}
      {facts.map((fact) => (
        <span key={String(fact)} className="capitalize">
          {fact}
        </span>
      ))}
    </div>
  );
}
