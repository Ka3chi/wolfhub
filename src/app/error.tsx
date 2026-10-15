"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-24 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-zinc-400">
        AniList didn&apos;t respond. It may be rate limiting us. Try again in a
        moment.
      </p>
      <button
        onClick={() => retry()}
        className="mt-6 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-sm font-bold hover:brightness-110"
      >
        Try again
      </button>
    </div>
  );
}
