import { AnimeGridSkeleton } from "@/components/AnimeGrid";

export default function Loading() {
  return (
    <>
      <div className="mb-6 h-10 w-56 animate-pulse rounded bg-white/10" />
      <div className="mb-8 flex gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-white/10" />
        ))}
      </div>
      <AnimeGridSkeleton />
    </>
  );
}
