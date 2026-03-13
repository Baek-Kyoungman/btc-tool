"use client";

import { adminLogout } from "../actions";

export function LogoutButton() {
  return (
    <form action={adminLogout}>
      <button
        type="submit"
        className="rounded-md border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
      >
        로그아웃
      </button>
    </form>
  );
}
