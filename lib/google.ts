export type CalendarEvent = {
  id: string;
  title: string;
  start: string | null; // ISO datetime, or null for all-day
  end: string | null;
  allDay: boolean;
};

export type EmailThread = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
};

async function google(accessToken: string, url: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Google API ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function getEvents(
  accessToken: string,
  timeMin: Date,
  timeMax: Date
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "50",
  });
  const data = await google(
    accessToken,
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`
  );
  return (data.items ?? []).map((e: any) => ({
    id: e.id,
    title: e.summary ?? "(no title)",
    start: e.start?.dateTime ?? e.start?.date ?? null,
    end: e.end?.dateTime ?? e.end?.date ?? null,
    allDay: !e.start?.dateTime,
  }));
}

export async function getRecentEmails(accessToken: string, max = 6): Promise<EmailThread[]> {
  const list = await google(
    accessToken,
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${max}&q=in:inbox`
  );
  const ids: string[] = (list.messages ?? []).map((m: any) => m.id);

  const messages = await Promise.all(
    ids.map((id) =>
      google(
        accessToken,
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`
      )
    )
  );

  return messages.map((m) => {
    const headers: any[] = m.payload?.headers ?? [];
    const get = (name: string) => headers.find((h) => h.name === name)?.value ?? "";
    return {
      id: m.id,
      from: get("From").replace(/<.*>/, "").trim(),
      subject: get("Subject") || "(no subject)",
      snippet: m.snippet ?? "",
      date: new Date(Number(m.internalDate)).toISOString(),
    };
  });
}
