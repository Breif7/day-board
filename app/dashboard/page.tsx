import { auth } from "@/auth";
import { db } from "@/lib/supabase";
import { getEvents, getRecentEmails } from "@/lib/google";
import StatCard from "@/components/StatCard";
import MiniCalendar from "@/components/MiniCalendar";
import AgendaTimeline from "@/components/AgendaTimeline";
import EmailList from "@/components/EmailList";
import TaskList from "@/components/TaskList";
import NewTaskForm from "@/components/NewTaskForm";
import BriefCard from "@/components/BriefCard";
import SearchBar from "@/components/SearchBar";

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session!.user as any).id;
  const accessToken = (session as any).accessToken as string | undefined;
  const googleError = (session as any).error as string | undefined;

  const today = new Date();
  const dayStart = new Date(today);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(today);
  dayEnd.setHours(23, 59, 59, 999);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
  const todayIso = today.toISOString().slice(0, 10);

  let todayEvents: Awaited<ReturnType<typeof getEvents>> = [];
  let monthEvents: Awaited<ReturnType<typeof getEvents>> = [];
  let emails: Awaited<ReturnType<typeof getRecentEmails>> = [];

  if (accessToken && !googleError) {
    [todayEvents, monthEvents, emails] = await Promise.all([
      getEvents(accessToken, dayStart, dayEnd).catch(() => []),
      getEvents(accessToken, monthStart, monthEnd).catch(() => []),
      getRecentEmails(accessToken, 6).catch(() => []),
    ]);
  }

  const [{ data: tasks }, { data: brief }] = await Promise.all([
    db
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("due_date", todayIso)
      .order("starred", { ascending: false }),
    db.from("briefs").select("content_md").eq("user_id", userId).eq("date", todayIso).maybeSingle(),
  ]);

  const pendingTasks = (tasks ?? []).filter((t) => !t.done_at);
  const daysWithEvents = new Set(
    monthEvents.filter((e) => e.start).map((e) => new Date(e.start!).getDate())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Hola, {session!.user?.name?.split(" ")[0]} 👋
      </h1>

      {googleError && (
        <div className="card text-sm text-red-600">
          Google session expired — sign out and back in to refresh calendar/email access.
        </div>
      )}

      <SearchBar events={todayEvents} emails={emails} tasks={(tasks ?? []) as any} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Events today" icon="📅" value={todayEvents.length} />
        <StatCard label="New emails" icon="📧" value={emails.length} />
        <StatCard label="Pending tasks" icon="✅" value={pendingTasks.length} />
        <StatCard label="Important" icon="⭐" value={pendingTasks.filter((t) => t.starred).length} />
      </div>

      <BriefCard brief={brief ?? null} />

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-3">{today.toLocaleDateString([], { month: "long", year: "numeric" })}</h2>
          <MiniCalendar daysWithEvents={daysWithEvents} />
        </div>

        <div className="card sm:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Today's agenda</h2>
            <a
              href="https://calendar.google.com/calendar/u/0/r/eventedit"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-accent text-white rounded-lg px-3 py-1.5"
            >
              + New event
            </a>
          </div>
          <AgendaTimeline events={todayEvents} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-3">Recent emails</h2>
          <EmailList emails={emails} />
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Today's to-dos</h2>
          <div className="space-y-4">
            <NewTaskForm />
            <TaskList tasks={pendingTasks as any} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
