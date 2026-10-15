export default function Loading() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <div className="aspect-2/3 w-40 shrink-0 animate-pulse rounded-2xl bg-white/10 sm:w-60" />
      <div className="flex-1 space-y-3 sm:pt-8">
        <div className="h-10 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="mt-6 h-24 w-full max-w-3xl animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
