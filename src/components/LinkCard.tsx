import type { LinkItem } from "@/lib/types";

export default function LinkCard({ link }: { link: LinkItem }) {
  // http(s) 링크는 클릭 집계용 리다이렉트를 거치고,
  // mailto: 등 그 외 스킴은 대상 주소로 바로 연결합니다.
  const isWeb = /^https?:\/\//i.test(link.url);

  return (
    <a
      href={isWeb ? `/r/${link.id}` : link.url}
      {...(isWeb && { target: "_blank", rel: "noopener noreferrer" })}
      className="group relative flex items-center justify-center rounded-2xl border border-white/60 bg-white/45 px-10 py-4 text-center text-[15px] font-medium text-[#43352c] shadow-[0_10px_30px_-14px_rgba(120,72,40,0.4)] backdrop-blur-md transition duration-200 ease-out hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/65 sm:px-12 sm:py-[18px] sm:text-base"
    >
      <span className="truncate">{link.title}</span>
      <span className="absolute right-4 shrink-0 text-[11px] tabular-nums text-[#a1856b] sm:right-5 sm:text-xs">
        {link.clicks.toLocaleString("ko-KR")} 클릭
      </span>
    </a>
  );
}
