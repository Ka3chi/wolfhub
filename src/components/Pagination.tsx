import Link from "next/link";

export function Pagination({
  page,
  hasNextPage,
  hrefFor,
}: {
  page: number;
  hasNextPage: boolean;
  hrefFor: (page: number) => string;
}) {
  if (page === 1 && !hasNextPage) return null;

  const button = "glass rounded-full px-5 py-2 text-sm font-semibold hover:bg-white/15";
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={button}>
          ← Previous
        </Link>
      ) : null}
      <span className="text-sm text-zinc-400">Page {page}</span>
      {hasNextPage ? (
        <Link href={hrefFor(page + 1)} className={button}>
          Next →
        </Link>
      ) : null}
    </nav>
  );
}
