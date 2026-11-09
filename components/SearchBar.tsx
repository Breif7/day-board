"use client";

import { useMemo, useState } from "react";
import type { CalendarEvent, EmailThread } from "@/lib/google";
import type { Task } from "@/components/TaskList";

export default function SearchBar({
  events,
  emails,
  tasks,
}: {
  events: CalendarEvent[];
  emails: EmailThread[];
  tasks: Task[];
}) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (!q.trim()) return null;
    const needle = q.toLowerCase();
    return {
      events: events.filter((e) => e.title.toLowerCase().includes(needle)),
      emails: emails.filter(
        (e) => e.subject.toLowerCase().includes(needle) || e.from.toLowerCase().includes(needle)
      ),
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(needle)),
    };
  }, [q, events, emails, tasks]);

  const total = results ? results.events.length + results.emails.length + results.tasks.length : 0;

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="🔍 Search today's events, emails and tasks…"
        className="input"
      />
      {results && (
        <div className="absolute z-10 mt-1 w-full card max-h-80 overflow-auto">
          {total === 0 && <p className="text-sm text-gray-400">No matches.</p>}
          {results.events.length > 0 && (
            <Section title="Events" items={results.events.map((e) => e.title)} />
          )}
          {results.tasks.length > 0 && <Section title="Tasks" items={results.tasks.map((t) => t.title)} />}
          {results.emails.length > 0 && (
            <Section title="Emails" items={results.emails.map((e) => `${e.from} — ${e.subject}`)} />
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="text-xs text-gray-400 mb-1">{title}</div>
      <ul className="text-sm space-y-1">
        {items.map((it, i) => (
          <li key={i} className="truncate">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
