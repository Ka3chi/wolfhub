import type { NextRequest } from "next/server";
import { apiError, respond } from "@/lib/api-response";
import { FREE_SORTS, getFreeAnime, isFreeSort } from "@/lib/anilist";

// GET /api/anime/free?sort=popular — anime with an official free YouTube playlist
export async function GET(request: NextRequest) {
  const sort = request.nextUrl.searchParams.get("sort") ?? "popular";
  if (!isFreeSort(sort)) {
    return apiError(400, `Unknown sort "${sort}"`, { sorts: Object.keys(FREE_SORTS) });
  }
  return respond(() => getFreeAnime(sort));
}
