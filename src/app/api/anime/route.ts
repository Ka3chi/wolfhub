import type { NextRequest } from "next/server";
import { apiError, respond } from "@/lib/api-response";
import { GENRES, getList, isGenre, isListName, LISTS, parsePage } from "@/lib/anilist";

// GET /api/anime?list=trending&genre=Action&page=1
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const list = params.get("list") ?? "trending";
  if (!isListName(list)) {
    return apiError(400, `Unknown list "${list}"`, { lists: Object.keys(LISTS) });
  }
  const genre = params.get("genre") ?? undefined;
  if (genre !== undefined && !isGenre(genre)) {
    return apiError(400, `Unknown genre "${genre}"`, { genres: GENRES });
  }
  return respond(() => getList(list, parsePage(params.get("page")), genre));
}
