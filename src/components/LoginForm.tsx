"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(loginAction, null);

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-3">
      <input
        type="password"
        name="password"
        placeholder="관리자 비밀번호"
        required
        autoFocus
        className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:bg-white/5 dark:focus:border-white/50"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity disabled:opacity-50"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </form>
  );
}
