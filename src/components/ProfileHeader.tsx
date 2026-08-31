import Image from "next/image";
import type { Profile } from "@/lib/types";

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="mb-10 flex flex-col items-center text-center sm:mb-14">
      {/* 둥근 프로필: 바깥 하이라이트 링 + 부드러운 드롭섀도로 살짝 입체감 */}
      <div className="rounded-full bg-gradient-to-b from-white/80 to-white/20 p-1 shadow-[0_18px_40px_-16px_rgba(120,72,40,0.45)] ring-1 ring-white/60">
        <div className="relative h-28 w-28 overflow-hidden rounded-full bg-[#f3e2d1] ring-1 ring-black/5 sm:h-32 sm:w-32">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-[#b8916f] sm:text-5xl">
              {profile.name.slice(0, 1) || "?"}
            </div>
          )}
          {/* 상단 유광 하이라이트 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/35 to-transparent"
          />
        </div>
      </div>

      <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#3a2c23]">
        {profile.name}
      </h1>
      {profile.bio && (
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#7c6350] sm:text-[15px]">
          {profile.bio}
        </p>
      )}
    </header>
  );
}
