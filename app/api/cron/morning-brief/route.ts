import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { generateBrief } from "@/lib/brief";

// Vercel Cron hits this hourly (see vercel.json); each user's refresh token is exchanged
// for a fresh access token so the brief can run without the user being signed in live.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // NextAuth's account table isn't modeled here (no DB adapter — JWT sessions only), so the
  // cron can't look up stored refresh tokens yet. Per-user automatic briefs need an
  // accounts table (NextAuth DB adapter) to persist refresh tokens server-side.
  return NextResponse.json({
    skipped: true,
    reason: "No persisted refresh tokens yet — see comment in this route. Use the on-demand 'Generate brief' button for now.",
  });
}
