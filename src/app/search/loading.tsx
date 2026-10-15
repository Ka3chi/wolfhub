import { AnimeGridSkeleton } from "@/components/AnimeGrid";

export default function Loading() {
  return (
    <>
      <div className="mb-8 h-14 w-full animate-pulse rounded-2xl bg-white/10" />
      <AnimeGridSkeleton count={12} />
    </>
  );
}
