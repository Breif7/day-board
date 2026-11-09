import { signOut } from "@/auth";

const links = [
  { href: "/dashboard", label: "Inicio", icon: "🏠" },
  { href: "/tasks", label: "Pendientes", icon: "✅" },
];

export default function Sidebar({ userName, userImage }: { userName: string; userImage: string }) {
  return (
    <aside className="w-56 shrink-0 border-r border-border p-4 hidden sm:flex sm:flex-col">
      <div className="font-semibold text-lg mb-6 px-2">📅 Day Board</div>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-bg hover:text-ink transition"
          >
            <span>{l.icon}</span>
            {l.label}
          </a>
        ))}
      </nav>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
        className="flex items-center gap-2 px-2 pt-4 border-t border-border"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {userImage && <img src={userImage} alt="" className="w-7 h-7 rounded-full" />}
        <span className="text-xs text-gray-500 truncate flex-1">{userName}</span>
        <button className="text-xs text-gray-400 hover:text-accent">Salir</button>
      </form>
    </aside>
  );
}
