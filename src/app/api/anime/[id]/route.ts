import type { NextRequest } from "next/server";
import { apiError, respond } from "@/lib/api-response";
import { getAnimeDetails, parseId } from "@/lib/anilist";

// GET /api/anime/{id}
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/anime/[id]">) {
  const id = parseId((await ctx.params).id);
  if (id === null) return apiError(404, "Not found");
  return respond(() => getAnimeDetails(id));
}
