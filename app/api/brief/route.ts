import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateBrief } from "@/lib/brief";

export async function POST() {
  const session = await auth();
  if (!session?.user || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  try {
    const brief = await generateBrief((session.user as any).id, (session as any).accessToken, today);
    return NextResponse.json({ brief });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
