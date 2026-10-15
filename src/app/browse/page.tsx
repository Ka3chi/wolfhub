import Link from "next/link";
import { AnimeGrid } from "@/components/AnimeGrid";
import { Pagination } from "@/components/Pagination";
import { Tabs } from "@/components/Tabs";
import { GENRES, getList, isGenre, isListName, LISTS, parsePage } from "@/lib/anilist";

export const metadata = { title: "Browse" };

function browseHref(list: string, genre?: string, page?: number) {
  const params = new URLSearchParams({ list });
  if (genre) params.set("genre", genre);
  if (page && page > 1) params.set("page", String(page));
  return `/browse?${params}`;
}

// /browse?list=airing&genre=Action&page=2
export default async function BrowsePage({ searchParams }: PageProps<"/browse">) {
  const query = await searchParams;
  const list = typeof query.list === "string" && isListName(query.list) ? query.list : "trending";
  const genre = typeof query.genre === "string" && isGenre(query.genre) ? query.genre : undefined;
  const page = parsePage(query.page);
  const data = await getList(list, page, genre);

  return (
    <>
      <h1 className="mb-6 flex items-center gap-3 text-4xl font-black">
        <span className="h-9 w-2 rounded-full bg-violet-500" />
        {genre ? `${genre} · ` : ""}
        {LISTS[list].label}
      </h1>
      <Tabs
        active={list}
        tabs={Object.entries(LISTS).map(([key, { label }]) => ({
          key,
          label,
          href: browseHref(key, genre),
        }))}
      />
      <div className="no-scrollbar -mt-4 mb-8 flex gap-2 overflow-x-auto pb-1">
        <GenreChip href={browseHref(list)} active={!genre} label="All genres" />
        {GENRES.map((g) => (
          <GenreChip key={g} href={browseHref(list, g)} active={g === genre} label={g} />
        ))}
      </div>
      <AnimeGrid items={data.results} />
      <Pagination
        page={data.page}
        hasNextPage={data.hasNextPage}
        hrefFor={(p) => browseHref(list, genre, p)}
      />
    </>
  );
}

function GenreChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        "shrink-0 rounded-lg border px-3 py-1 text-xs font-medium transition " +
        (active
          ? "border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200"
          : "border-white/10 text-zinc-300 hover:border-white/30 hover:text-white")
      }
    >
      {label}
    </Link>
  );
}
