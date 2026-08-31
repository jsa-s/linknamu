import Link from "next/link";
import ProfileHeader from "@/components/ProfileHeader";
import LinkList from "@/components/LinkList";
import { getLinks, getProfile } from "@/lib/data";

// 클릭 수가 항상 최신으로 보이도록 매 요청마다 렌더링합니다.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, links] = await Promise.all([getProfile(), getLinks()]);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* 유리 카드가 은은하게 반사할 따뜻한 배경 얼룩 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#ffcf9e]/45 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-[#ffbfa0]/35 blur-3xl sm:h-[26rem] sm:w-[26rem]"
      />

      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-14 sm:px-8 sm:py-20">
        <ProfileHeader profile={profile} />
        <LinkList links={links} />

        <footer className="mt-12 text-xs text-[#8a7057] sm:mt-16">
          <Link href="/admin" className="transition-colors hover:text-[#5f4a37]">
            관리자
          </Link>
        </footer>
      </main>
    </div>
  );
}
