import type { EmailThread } from "@/lib/google";

export default function EmailList({ emails }: { emails: EmailThread[] }) {
  if (!emails.length) return <p className="text-sm text-gray-400">Inbox zero. 🎉</p>;

  return (
    <ul className="space-y-3">
      {emails.map((m) => (
        <li key={m.id} className="border-b border-border last:border-0 pb-2 last:pb-0">
          <div className="flex justify-between text-sm">
            <span className="font-medium truncate">{m.from}</span>
            <span className="text-xs text-gray-400 shrink-0 ml-2">
              {new Date(m.date).toLocaleDateString([], { day: "2-digit", month: "short" })}
            </span>
          </div>
          <div className="text-sm truncate">{m.subject}</div>
          <div className="text-xs text-gray-400 truncate">{m.snippet}</div>
        </li>
      ))}
    </ul>
  );
}
