import { createHash } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "linknamu_admin";

function sessionToken(): string {
  const pw = process.env.ADMIN_PASSWORD ?? "";
  return createHash("sha256").update(`linknamu:${pw}`).digest("hex");
}

/** ADMIN_PASSWORD가 설정되어 있는지 여부. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** 현재 요청이 관리자로 인증되었는지 확인합니다. */
export async function isAdmin(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === sessionToken();
}

/** 비밀번호가 맞으면 세션 쿠키를 설정하고 true를 반환합니다. */
export async function signIn(password: string): Promise<boolean> {
  if (!isAdminConfigured() || password !== process.env.ADMIN_PASSWORD) return false;

  const store = await cookies();
  store.set(COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
