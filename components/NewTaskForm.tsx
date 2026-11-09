"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTaskForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, due_date: new Date().toISOString().slice(0, 10) }),
      });
      setTitle("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task…"
        className="input flex-1"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-32">
        <option>Personal</option>
        <option>Trabajo</option>
        <option>Finanzas</option>
        <option>Redes</option>
      </select>
      <button disabled={saving} className="bg-accent text-white rounded-lg px-4 text-sm font-medium">
        +
      </button>
    </form>
  );
}
