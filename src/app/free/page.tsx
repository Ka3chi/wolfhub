import { AnimeGrid } from "@/components/AnimeGrid";
import { Tabs } from "@/components/Tabs";
import { FREE_SORTS, getFreeAnime, isFreeSort } from "@/lib/anilist";

export const metadata = { title: "Watch Free" };

// /free?sort=trending
export default async function FreePage({ searchParams }: PageProps<"/free">) {
  const query = await searchParams;
  const sort = typeof query.sort === "string" && isFreeSort(query.sort) ? query.sort : "popular";
  const items = await getFreeAnime(sort);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-black">
          Watch{" "}
          <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Free
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-300">
          Full anime series streamed free and legally, from official uploads by licensors like
          Muse Asia and Ani-One. Open any title and press play.
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Some playlists are only available in certain regions.
        </p>
      </div>
      <Tabs
        active={sort}
        tabs={Object.entries(FREE_SORTS).map(([key, { label }]) => ({
          key,
          label,
          href: `/free?sort=${key}`,
        }))}
      />
      <AnimeGrid items={items} />
    </>
  );
}
