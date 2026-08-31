import Image from "next/image";
import type { Profile } from "@/lib/types";

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="mb-6 flex flex-col items-center text-center sm:mb-14">
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-black/5 ring-1 ring-black/10 sm:h-40 sm:w-40 dark:bg-white/10 dark:ring-white/15">
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            fill
            sizes="(min-width: 640px) 160px, 96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-black/30 sm:text-5xl dark:text-white/40">
            {profile.name.slice(0, 1) || "?"}
          </div>
        )}
      </div>

      <h1 className="mt-3 text-xl font-bold tracking-tight sm:mt-5 sm:text-2xl">
        {profile.name}
      </h1>
      {profile.bio && (
        <p className="mt-1 max-w-md text-sm leading-relaxed text-black/60 sm:mt-2 sm:text-base dark:text-white/60">
          {profile.bio}
        </p>
      )}
    </header>
  );
}
