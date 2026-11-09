import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/supabase";
import { getEvents, getRecentEmails } from "@/lib/google";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/** Builds (or returns the existing) morning brief for this user and date, using live Google data. */
export async function generateBrief(userId: string, accessToken: string, date: string) {
  const { data: existing } = await db
    .from("briefs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();
  if (existing) return existing;

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  const [events, emails, { data: tasks }] = await Promise.all([
    getEvents(accessToken, dayStart, dayEnd),
    getRecentEmails(accessToken, 8),
    db.from("tasks").select("title, starred").eq("user_id", userId).eq("due_date", date).is("done_at", null),
  ]);

  const message = await anthropic.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Write a short, friendly morning brief (under 120 words, plain text, no markdown headers) for today, ${date}.
Events: ${JSON.stringify(events.map((e) => ({ title: e.title, start: e.start })))}
Pending tasks: ${JSON.stringify(tasks ?? [])}
Recent emails (subjects only): ${JSON.stringify(emails.map((e) => e.subject))}
Mention: how many meetings, any starred/important tasks, and whether any emails look like they need a reply. End with one encouraging line.`,
      },
    ],
  });

  const content_md = message.content.find((b) => b.type === "text")?.text ?? "";

  const { data: brief, error } = await db
    .from("briefs")
    .insert({ user_id: userId, date, content_md })
    .select()
    .single();
  if (error) throw error;
  return brief;
}
