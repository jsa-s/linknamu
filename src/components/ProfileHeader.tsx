import Image from "next/image";
import type { Profile } from "@/lib/types";

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="mb-14 flex flex-col items-center text-center">
      <div className="relative h-40 w-40 overflow-hidden rounded-full bg-black/5 ring-1 ring-black/10 dark:bg-white/10 dark:ring-white/15">
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            fill
            sizes="160px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl font-semibold text-black/30 dark:text-white/40">
            {profile.name.slice(0, 1) || "?"}
          </div>
        )}
      </div>

      <h1 className="mt-5 text-2xl font-bold tracking-tight">{profile.name}</h1>
      {profile.bio && (
        <p className="mt-2 max-w-md text-base leading-relaxed text-black/60 dark:text-white/60">
          {profile.bio}
        </p>
      )}
    </header>
  );
}
