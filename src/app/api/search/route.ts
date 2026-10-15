import type { NextRequest } from "next/server";
import { apiError, respond } from "@/lib/api-response";
import { parsePage, searchAnime } from "@/lib/anilist";

// GET /api/search?q=naruto&page=1
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("q")?.trim();
  if (!query) return apiError(400, 'Missing "q" query parameter');
  return respond(() => searchAnime(query, parsePage(params.get("page"))));
}
