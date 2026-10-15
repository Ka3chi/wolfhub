import Link from "next/link";

export function Tabs({
  tabs,
  active,
}: {
  tabs: { key: string; label: string; href: string }[];
  active: string;
}) {
  return (
    <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === active ? "page" : undefined}
          className={
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition " +
            (tab.key === active
              ? "bg-linear-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30"
              : "glass text-zinc-300 hover:bg-white/15")
          }
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
