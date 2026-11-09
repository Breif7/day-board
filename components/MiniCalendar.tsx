export default function MiniCalendar({ daysWithEvents }: { daysWithEvents: Set<number> }) {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const startWeekday = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const cells = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
        <div key={d} className="text-gray-400 font-medium py-1">
          {d}
        </div>
      ))}
      {cells.map((day, i) => (
        <div
          key={i}
          className={`py-1 rounded-full ${
            day === now.getDate()
              ? "bg-accent text-white font-medium"
              : day && daysWithEvents.has(day)
              ? "text-accent font-medium"
              : "text-gray-600"
          }`}
        >
          {day ?? ""}
        </div>
      ))}
    </div>
  );
}
