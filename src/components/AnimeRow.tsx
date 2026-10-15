import Link from "next/link";
import type { Anime } from "@/lib/types";
import { AnimeCard, AnimeCardSkeleton } from "./AnimeCard";
import { Carousel, Slide } from "./Carousel";

type Tone = "violet" | "emerald";

const BAR: Record<Tone, string> = { violet: "bg-violet-500", emerald: "bg-emerald-500" };
const LINK: Record<Tone, string> = { violet: "text-violet-300", emerald: "text-emerald-400" };

/** A titled carousel of anime cards. Loads its data from `load`. */
export async function AnimeRow({
  title,
  href,
  tone = "violet",
  load,
}: {
  title: string;
  href?: string;
  tone?: Tone;
  load: () => Promise<Anime[]>;
}) {
  const items = await load();
  if (items.length === 0) return null;
  return <AnimeCarousel title={title} href={href} tone={tone} items={items} />;
}

export function AnimeCarousel({
  title,
  href,
  tone = "violet",
  items,
}: {
  title: string;
  href?: string;
  tone?: Tone;
  items: Anime[];
}) {
  return (
    <section>
      <RowHeader title={title} href={href} tone={tone} />
      <Carousel label={title}>
        {items.slice(0, 20).map((anime) => (
          <Slide key={anime.id}>
            <AnimeCard anime={anime} />
          </Slide>
        ))}
      </Carousel>
    </section>
  );
}

export function AnimeRowSkeleton({ title, tone = "violet" }: { title: string; tone?: Tone }) {
  return (
    <section>
      <RowHeader title={title} tone={tone} />
      <div className="flex gap-4 overflow-hidden py-2">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="w-36 shrink-0 sm:w-44">
            <AnimeCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

function RowHeader({ title, href, tone }: { title: string; href?: string; tone: Tone }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="flex items-center gap-3 text-xl font-bold">
        <span className={"h-6 w-1.5 rounded-full " + BAR[tone]} />
        {title}
      </h2>
      {href ? (
        <Link href={href} className={"text-sm font-medium hover:underline " + LINK[tone]}>
          See all →
        </Link>
      ) : null}
    </div>
  );
}
