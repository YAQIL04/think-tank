import { runRefresh } from "@/lib/refreshNews";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const dailyNews = await runRefresh();
    return Response.json({ ok: true, last_updated: dailyNews.last_updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron/refresh-news] FAILED:", message);
    return Response.json({ error: "refresh_failed", detail: message }, { status: 500 });
  }
}
