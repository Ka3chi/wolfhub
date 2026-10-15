import { NextResponse } from "next/server";

export function apiError(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...extra }, { status });
}

/**
 * Runs a loader and returns its result as JSON: 404 when it resolves to null,
 * 502 when AniList fails.
 */
export async function respond<T>(load: () => Promise<T | null>) {
  try {
    const data = await load();
    return data === null ? apiError(404, "Not found") : NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return apiError(502, err instanceof Error ? err.message : "Upstream request failed");
  }
}
