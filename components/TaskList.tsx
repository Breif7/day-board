"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type Task = {
  id: string;
  title: string;
  category: string;
  starred: boolean;
  done_at: string | null;
};

export default function TaskList({ tasks, compact = false }: { tasks: Task[]; compact?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function toggle(id: string, field: "done" | "starred", value: boolean) {
    setPending(id);
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    router.refresh();
    setPending(null);
  }

  if (!tasks.length) return <p className="text-sm text-gray-400">No pending tasks.</p>;

  return (
    <ul className="space-y-2">
      {tasks.map((t) => (
        <li key={t.id} className="flex items-center gap-2 text-sm py-1">
          <button
            onClick={() => toggle(t.id, "done", !t.done_at)}
            disabled={pending === t.id}
            className={`w-4 h-4 rounded-full border-2 shrink-0 ${
              t.done_at ? "bg-accent border-accent" : "border-gray-300"
            }`}
          />
          <span className={`flex-1 truncate ${t.done_at ? "line-through text-gray-400" : ""}`}>{t.title}</span>
          {!compact && <span className="text-xs text-gray-400">{t.category}</span>}
          <button
            onClick={() => toggle(t.id, "starred", !t.starred)}
            disabled={pending === t.id}
            className={t.starred ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </button>
        </li>
      ))}
    </ul>
  );
}
