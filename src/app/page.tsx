import Link from "next/link";
import ProfileHeader from "@/components/ProfileHeader";
import LinkList from "@/components/LinkList";
import { getLinks, getProfile } from "@/lib/data";

// 클릭 수가 항상 최신으로 보이도록 매 요청마다 렌더링합니다.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, links] = await Promise.all([getProfile(), getLinks()]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 pt-8 pb-24 sm:pt-10 sm:pb-32">
      <ProfileHeader profile={profile} />
      <LinkList links={links} />

      <footer className="mt-12 text-xs text-black/40 dark:text-white/40">
        <Link href="/admin" className="hover:underline">
          관리자
        </Link>
      </footer>
    </main>
  );
}
