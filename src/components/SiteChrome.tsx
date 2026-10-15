import Link from "next/link";

const NAV = [
  { href: "/browse?list=airing", label: "Airing" },
  { href: "/browse?list=popular", label: "Popular" },
  { href: "/browse?list=top", label: "Top Rated" },
  { href: "/browse?list=movies", label: "Movies" },
  { href: "/browse", label: "Browse" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d0b1f]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="text-2xl font-black tracking-tight">
          <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
            Wolf
          </span>
          Hub
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-zinc-300">
          <Link
            href="/free"
            className="rounded-full bg-emerald-500 px-3 py-1 font-bold text-black transition hover:bg-emerald-400"
          >
            ▶ Watch Free
          </Link>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action="/search" className="w-full md:ml-auto md:w-72">
          <input
            type="search"
            name="q"
            placeholder="Search anime…"
            aria-label="Search anime"
            className="glass w-full rounded-full px-4 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </form>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/20 px-4 py-8 text-center text-xs leading-relaxed text-zinc-400 sm:px-6">
      Anime data from{" "}
      <a href="https://anilist.co" className="underline hover:text-white">
        AniList
      </a>
      . Free episodes are official uploads by their licensors on YouTube and may be limited to
      some regions. Wolf Hub hosts no video.
    </footer>
  );
}
