import type { LinkItem } from "@/lib/types";

export default function LinkCard({ link }: { link: LinkItem }) {
  return (
    <a
      href={`/r/${link.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-6 py-5 text-base font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/15 dark:bg-white/5"
    >
      <span className="truncate">{link.title}</span>
      <span className="shrink-0 text-sm tabular-nums text-black/40 dark:text-white/40">
        {link.clicks.toLocaleString("ko-KR")} 클릭
      </span>
    </a>
  );
}
