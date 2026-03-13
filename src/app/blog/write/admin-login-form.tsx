"use client";

import { useActionState } from "react";
import { adminLogin } from "../actions";

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLogin, null);

  return (
    <form
      action={formAction}
      className="flex max-w-md flex-col gap-4 rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]"
    >
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[#37352f] dark:text-[#ebebeb]"
        >
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-md border border-[rgba(55,53,47,0.2)] bg-transparent px-3 py-2 text-[#37352f] placeholder:text-[#37352f66] focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:placeholder:text-[#ebebeb66]"
          placeholder="관리자 비밀번호"
        />
      </div>
      {state && "error" in state && state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <button
        type="submit"
        className="rounded-md bg-amber-500 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-600"
      >
        로그인
      </button>
    </form>
  );
}
