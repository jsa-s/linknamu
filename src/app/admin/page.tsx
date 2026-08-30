import type { ReactNode } from "react";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import { isAdmin, isAdminConfigured } from "@/lib/auth";
import { isDbConfigured } from "@/lib/mongodb";
import { getLinks, getProfile } from "@/lib/data";
import {
  addLinkAction,
  deleteLinkAction,
  editLinkAction,
  logoutAction,
  moveLinkAction,
  saveProfileAction,
} from "./actions";

export const dynamic = "force-dynamic";

const field =
  "w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:bg-white/5 dark:focus:border-white/50";
const primaryBtn =
  "rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90";
const ghostBtn =
  "rounded-lg border border-black/15 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-black/5 disabled:opacity-30 dark:border-white/20 dark:hover:bg-white/10";

function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-12 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-lg font-bold tracking-tight">링크나무 · 관리자</h1>
        <Link href="/" className="text-xs text-black/50 hover:underline dark:text-white/50">
          내 페이지 보기
        </Link>
      </div>
      {children}
    </main>
  );
}

export default async function AdminPage() {
  if (!isAdminConfigured()) {
    return (
      <Shell>
        <p className="text-sm leading-relaxed text-black/60 dark:text-white/60">
          <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">ADMIN_PASSWORD</code>{" "}
          환경 변수를 <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">.env.local</code>{" "}
          에 설정하면 관리자 기능을 사용할 수 있습니다.
        </p>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <h2 className="mb-4 text-sm font-semibold text-black/70 dark:text-white/70">로그인</h2>
        <LoginForm />
      </Shell>
    );
  }

  const [profile, links] = await Promise.all([getProfile(), getLinks()]);
  const dbReady = isDbConfigured();

  return (
    <Shell>
      {!dbReady && (
        <p className="mb-6 rounded-lg border border-amber-400/40 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          MongoDB가 연결되지 않았습니다. 아래는 샘플 데이터이며 저장이 되지 않습니다.
        </p>
      )}

      {/* 프로필 */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold text-black/70 dark:text-white/70">프로필</h2>
        <form action={saveProfileAction} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs text-black/50 dark:text-white/50">
            이름
            <input name="name" defaultValue={profile.name} required className={field} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-black/50 dark:text-white/50">
            한 줄 소개
            <input name="bio" defaultValue={profile.bio} className={field} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-black/50 dark:text-white/50">
            프로필 사진 URL
            <input
              name="avatarUrl"
              type="url"
              defaultValue={profile.avatarUrl}
              placeholder="https://…"
              className={field}
            />
          </label>
          <button type="submit" disabled={!dbReady} className={`${primaryBtn} self-start disabled:opacity-40`}>
            프로필 저장
          </button>
        </form>
      </section>

      {/* 링크 */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold text-black/70 dark:text-white/70">링크</h2>

        <ul className="flex flex-col gap-3">
          {links.map((link, i) => (
            <li
              key={link.id}
              className="rounded-xl border border-black/10 p-3 dark:border-white/15"
            >
              <form action={editLinkAction} className="flex flex-col gap-2">
                <input type="hidden" name="id" value={link.id} />
                <input name="title" defaultValue={link.title} required className={field} />
                <input name="url" type="url" defaultValue={link.url} required className={field} />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black/40 dark:text-white/40">
                    {link.clicks.toLocaleString("ko-KR")} 클릭
                  </span>
                  <button type="submit" disabled={!dbReady} className={ghostBtn}>
                    수정
                  </button>
                </div>
              </form>

              <div className="mt-2 flex gap-2 border-t border-black/5 pt-2 dark:border-white/10">
                <form action={moveLinkAction}>
                  <input type="hidden" name="id" value={link.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button type="submit" disabled={!dbReady || i === 0} className={ghostBtn}>
                    ↑ 위로
                  </button>
                </form>
                <form action={moveLinkAction}>
                  <input type="hidden" name="id" value={link.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={!dbReady || i === links.length - 1}
                    className={ghostBtn}
                  >
                    ↓ 아래로
                  </button>
                </form>
                <form action={deleteLinkAction} className="ml-auto">
                  <input type="hidden" name="id" value={link.id} />
                  <button
                    type="submit"
                    disabled={!dbReady}
                    className={`${ghostBtn} text-red-600 dark:text-red-400`}
                  >
                    삭제
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>

        {/* 새 링크 추가 */}
        <form
          action={addLinkAction}
          className="mt-4 flex flex-col gap-2 rounded-xl border border-dashed border-black/20 p-3 dark:border-white/25"
        >
          <p className="text-xs font-medium text-black/50 dark:text-white/50">새 링크 추가</p>
          <input name="title" placeholder="제목 (예: GitHub)" required className={field} />
          <input name="url" type="url" placeholder="https://…" required className={field} />
          <button type="submit" disabled={!dbReady} className={`${primaryBtn} self-start disabled:opacity-40`}>
            추가
          </button>
        </form>
      </section>

      <form action={logoutAction}>
        <button type="submit" className="text-xs text-black/50 hover:underline dark:text-white/50">
          로그아웃
        </button>
      </form>
    </Shell>
  );
}
