import type { LinkItem } from "@/lib/types";

export default function LinkCard({
  link,
  clicks,
  onCountClick,
}: {
  link: LinkItem;
  clicks: number;
  onCountClick: (id: string) => void;
}) {
  // http(s) 링크는 새 탭에서 열고, mailto: 등 그 외 스킴은 현재 탭에서 그대로 엽니다.
  const isWeb = /^https?:\/\//i.test(link.url);

  return (
    <a
      href={link.url}
      onClick={() => onCountClick(link.id)}
      {...(isWeb && { target: "_blank", rel: "noopener noreferrer" })}
      className="group relative flex items-center justify-center rounded-2xl border border-white/60 bg-white/45 px-10 py-4 text-center text-[15px] font-medium text-[#2f3a44] shadow-[0_10px_30px_-14px_rgba(40,72,120,0.35)] backdrop-blur-md transition duration-200 ease-out hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/65 sm:px-12 sm:py-[18px] sm:text-base"
    >
      <span className="truncate">{link.title}</span>
      <span className="absolute right-4 shrink-0 text-[11px] tabular-nums text-[#8598a7] sm:right-5 sm:text-xs">
        {clicks.toLocaleString("ko-KR")}회
      </span>
    </a>
  );
}
