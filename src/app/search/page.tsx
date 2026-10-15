import { AnimeGrid } from "@/components/AnimeGrid";
import { Pagination } from "@/components/Pagination";
import { parsePage, searchAnime } from "@/lib/anilist";

export const metadata = { title: "Search" };

// /search?q=naruto&page=2
export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  return (
    <>
      <form action="/search" className="mb-8">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search anime…"
          aria-label="Search anime"
          autoFocus={!query}
          className="glass w-full rounded-2xl px-5 py-3 text-lg placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </form>
      {query ? (
        <Results query={query} page={parsePage(params.page)} />
      ) : (
        <p className="py-12 text-center text-zinc-400">Type a title to search.</p>
      )}
    </>
  );
}

async function Results({ query, page }: { query: string; page: number }) {
  const data = await searchAnime(query, page);
  const free = data.results.filter((anime) => anime.freePlaylistId).length;
  const encoded = encodeURIComponent(query);

  return (
    <>
      <p className="mb-6 text-sm text-zinc-400">
        Results for <span className="font-semibold text-white">“{query}”</span>
        {free > 0 ? (
          <span className="text-emerald-400"> · {free} free to watch on this page</span>
        ) : null}
      </p>
      <AnimeGrid items={data.results} />
      <Pagination
        page={data.page}
        hasNextPage={data.hasNextPage}
        hrefFor={(p) => `/search?q=${encoded}&page=${p}`}
      />
    </>
  );
}
