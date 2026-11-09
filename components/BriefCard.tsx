"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BriefCard({ brief }: { brief: { content_md: string } | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/brief", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not generate brief");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">☀️ Morning brief</h2>
        {!brief && (
          <button onClick={generate} disabled={busy} className="text-xs bg-accent text-white rounded-lg px-3 py-1.5">
            {busy ? "Thinking…" : "Generate"}
          </button>
        )}
      </div>
      {brief ? (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{brief.content_md}</p>
      ) : (
        <p className="text-sm text-gray-400">Generate today's brief: meetings, important tasks, emails to reply to.</p>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
