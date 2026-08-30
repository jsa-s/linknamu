"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin, signIn, signOut } from "@/lib/auth";
import { isDbConfigured } from "@/lib/mongodb";
import { addLink, editLink, moveLink, removeLink, saveProfile } from "@/lib/data";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin");
}

async function ensureAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  if (!isDbConfigured()) throw new Error("MongoDB가 연결되지 않아 저장할 수 없습니다.");
}

/* ------------------------------ 인증 ------------------------------ */

export async function loginAction(
  _prev: string | null,
  formData: FormData,
): Promise<string | null> {
  const ok = await signIn(String(formData.get("password") ?? ""));
  if (!ok) return "비밀번호가 올바르지 않습니다.";
  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/admin");
}

/* ------------------------------ 프로필 ------------------------------ */

export async function saveProfileAction(formData: FormData) {
  await ensureAdmin();
  await saveProfile({
    name: String(formData.get("name") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    avatarUrl: String(formData.get("avatarUrl") ?? "").trim(),
  });
  revalidate();
}

/* ------------------------------ 링크 ------------------------------ */

export async function addLinkAction(formData: FormData) {
  await ensureAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (title && url) await addLink({ title, url });
  revalidate();
}

export async function editLinkAction(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (id && title && url) await editLink(id, { title, url });
  revalidate();
}

export async function deleteLinkAction(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await removeLink(id);
  revalidate();
}

export async function moveLinkAction(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (id) await moveLink(id, direction);
  revalidate();
}
