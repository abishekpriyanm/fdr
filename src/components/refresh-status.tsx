"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RefreshStatus() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="button"
      type="button"
      disabled={pending}
      aria-busy={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {pending ? "Checking status…" : "Refresh status"}
      <span aria-hidden="true">↻</span>
    </button>
  );
}
