export default function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="card flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-xl font-semibold">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}
