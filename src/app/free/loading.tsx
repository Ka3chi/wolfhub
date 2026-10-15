import { AnimeGridSkeleton } from "@/components/AnimeGrid";

export default function Loading() {
  return (
    <>
      <div className="mb-3 h-10 w-56 animate-pulse rounded bg-white/10" />
      <div className="mb-8 h-5 w-full max-w-xl animate-pulse rounded bg-white/10" />
      <AnimeGridSkeleton />
    </>
  );
}
