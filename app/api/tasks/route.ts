import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, category, due_date, starred } = await req.json();
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const { error } = await db.from("tasks").insert({
    user_id: (session.user as any).id,
    title,
    category: category || "Personal",
    due_date: due_date || new Date().toISOString().slice(0, 10),
    starred: !!starred,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
