import { auth } from "@/auth";
import { db } from "@/lib/supabase";
import TaskList from "@/components/TaskList";
import NewTaskForm from "@/components/NewTaskForm";

export default async function TasksPage() {
  const session = await auth();
  const userId = (session!.user as any).id;

  const { data: tasks } = await db
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pendientes</h1>
      <div className="card space-y-4">
        <NewTaskForm />
        <TaskList tasks={tasks ?? []} />
      </div>
    </div>
  );
}
