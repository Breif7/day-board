import type { CalendarEvent } from "@/lib/google";

export default function AgendaTimeline({ events }: { events: CalendarEvent[] }) {
  if (!events.length) return <p className="text-sm text-gray-400">No events today. Enjoy the quiet.</p>;

  return (
    <ul className="space-y-3">
      {events.map((e) => (
        <li key={e.id} className="flex items-start gap-3">
          <span className="w-14 shrink-0 text-xs text-gray-500 pt-0.5">
            {e.allDay
              ? "All day"
              : new Date(e.start!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
          <span className="text-sm">{e.title}</span>
        </li>
      ))}
    </ul>
  );
}
