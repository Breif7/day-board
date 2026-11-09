import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patch = await req.json(); // { done?: boolean, starred?: boolean }
  const update: Record<string, any> = {};
  if (typeof patch.done === "boolean") update.done_at = patch.done ? new Date().toISOString() : null;
  if (typeof patch.starred === "boolean") update.starred = patch.starred;

  const { error } = await db
    .from("tasks")
    .update(update)
    .eq("id", id)
    .eq("user_id", (session.user as any).id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await db.from("tasks").delete().eq("id", id).eq("user_id", (session.user as any).id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
