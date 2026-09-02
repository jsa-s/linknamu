import ProfileHeader from "@/components/ProfileHeader";
import LinkList from "@/components/LinkList";
import { getLinks, getProfile } from "@/lib/data";

// 프로필·링크 목록을 항상 최신 DB 상태로 렌더링합니다.
// (클릭 수는 클라이언트에서 /api/clicks 로 따로 조회합니다.)
export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, links] = await Promise.all([getProfile(), getLinks()]);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* 유리 카드가 은은하게 반사할 차가운 배경 얼룩 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#a9d3f2]/45 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-[#9ec6ec]/40 blur-3xl sm:h-[26rem] sm:w-[26rem]"
      />

      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-14 sm:px-8 sm:py-20">
        <ProfileHeader profile={profile} />
        <LinkList links={links} />
      </main>
    </div>
  );
}
