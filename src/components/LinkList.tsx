import LinkCard from "./LinkCard";
import type { LinkItem } from "@/lib/types";

export default function LinkList({ links }: { links: LinkItem[] }) {
  if (links.length === 0) {
    return (
      <p className="text-sm text-black/50 dark:text-white/50">
        아직 등록된 링크가 없습니다.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:gap-5">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}
