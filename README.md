# Wolf Hub

An anime streaming hub built with Next.js 16 (App Router, Cache Components) and Tailwind CSS. All data comes from [AniList](https://anilist.co), and **no API keys are needed**.

All playback is legal:

- **Watch Free** (`/free`) lists anime whose licensors (for example Muse Asia and Ani-One) post full seasons as official YouTube playlists. They play in-app, and each card with a free stream shows a **▶ FREE** badge.
- Every title also links to its official streaming services (Crunchyroll, Netflix, Bilibili, and others) and to its official episode pages.
- Wolf Hub hosts no video.

## Setup

```bash
npm install
npm run dev
```

## Pages

| Route | Description |
| --- | --- |
| `/` | Auto-playing hero slider and sliding rows (free, trending, airing, genres, …) |
| `/free?sort=popular\|trending\|top` | Anime that can be watched free in-app |
| `/browse?list=…&genre=…&page=…` | Lists: `trending`, `airing`, `popular`, `top`, `upcoming`, `movies`, with a genre filter |
| `/anime/{id}` | Free player, where to watch, trailer, episodes, characters, recommendations |
| `/search?q=…&page=…` | Search |

## JSON API

| Endpoint | Returns |
| --- | --- |
| `GET /api/anime?list={list}&genre={genre}&page={n}` | `{ page, hasNextPage, results: Anime[] }` |
| `GET /api/anime/{id}` | `AnimeDetails` |
| `GET /api/anime/free?sort={popular\|trending\|top}` | `Anime[]`, each with a `freePlaylistId` |
| `GET /api/search?q={query}&page={n}` | `{ page, hasNextPage, results: Anime[] }` |

The types are in `src/lib/types.ts`. Errors are returned as `{ error }` with these statuses:

- `400`: bad parameters
- `404`: not found
- `502`: AniList failed

## How free anime are found

AniList records each title's official streaming links but can't filter by them. `getFreeAnime` in `src/lib/anilist.ts` scans the top 200 titles for a sort and keeps those with a YouTube playlist link. That usually finds 50 to 80 series.

The results are cached for a day. List and search results are cached for hours, and title details for a day. Caching keeps the app within AniList's rate limit of about 30 to 90 requests per minute.

Some official playlists are region-locked or age-restricted. YouTube won't play those embedded, so the player page also links to the playlist on YouTube.

## Project layout

```
src/lib/anilist.ts      AniList client, lists, genres, free-anime finder
src/app/api/            JSON route handlers
src/app/                Home, /free, /browse, /anime/[id], /search
src/components/         Hero slider, carousel, cards, grid, tabs, pagination
```
