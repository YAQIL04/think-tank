"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import CharacterAvatar from "@/components/CharacterAvatar";
import LanguageToggle from "@/components/LanguageToggle";
import { useLang } from "@/context/LanguageContext";
import { characters } from "@/config/characters";
import type { DailyNews, NewsArticle } from "@/lib/types";

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDate(lang: "zh" | "en") {
  const now = new Date();
  if (lang === "zh") {
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${days[now.getDay()]}`;
  }
  return now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatLastUpdated(iso: string, lang: "zh" | "en") {
  const d = new Date(iso);
  const time = d.toLocaleTimeString(lang === "zh" ? "zh-CN" : "en-US", { hour: "2-digit", minute: "2-digit" });
  return lang === "zh" ? `上次更新：${time}` : `Last updated: ${time}`;
}

// ── components ────────────────────────────────────────────────────────────────

function NewsCard({
  article,
  lang,
  t,
}: {
  article: NewsArticle;
  lang: "zh" | "en";
  t: (s: string) => string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/8 overflow-hidden">
      {article.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-44 object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <div className="p-5 pb-4">
        <h3 className="text-base font-semibold text-white leading-snug mb-2">
          {t(article.title)}
        </h3>
        <p className="text-sm text-white/55 leading-relaxed mb-3">{t(article.summary)}</p>
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {article.source_name} · {new Date(article.published_at).toLocaleDateString()}
        </a>
      </div>

      <div className="border-t border-white/6 mx-5" />

      <div className="p-5 pt-4 space-y-3">
        <p className="text-[11px] uppercase tracking-wider text-white/25 mb-3">
          {lang === "zh" ? "专家点评" : "Expert Views"}
        </p>
        {article.expert_comments.map((ec) => {
          const character = characters.find((c) => c.id === ec.expert_id);
          const isExpanded = expanded === ec.expert_id;
          const commentText = t(ec.comment);
          return (
            <div key={ec.expert_id} className="flex gap-3">
              {character && <CharacterAvatar character={character} size={28} className="shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-white/70">{ec.expert_name}</span>
                </div>
                <p
                  className={`text-sm text-white/50 leading-relaxed cursor-pointer ${!isExpanded ? "line-clamp-2" : ""}`}
                  onClick={() => setExpanded(isExpanded ? null : ec.expert_id)}
                >
                  {commentText}
                </p>
                {commentText.length > 120 && (
                  <button
                    onClick={() => setExpanded(isExpanded ? null : ec.expert_id)}
                    className="text-[11px] text-white/30 hover:text-white/50 mt-0.5 transition-colors"
                  >
                    {isExpanded
                      ? (lang === "zh" ? "收起" : "Show less")
                      : (lang === "zh" ? "展开" : "Read more")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function NewsPage() {
  const { lang } = useLang();
  const [data, setData] = useState<DailyNews | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [zhCache, setZhCache] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d: DailyNews) => {
        if (d.articles?.length) setData(d);
      })
      .finally(() => setInitialLoading(false));
  }, []);

  useEffect(() => {
    setZhCache({});
    setTranslateError(null);
  }, [data]);

  useEffect(() => {
    if (lang !== "zh" || !data?.articles?.length || translating) return;
    if (typeof data.articles[0].title === "string" && zhCache[data.articles[0].title]) return;

    const texts = data.articles.flatMap((a) => [
      a.title,
      a.summary,
      ...a.expert_comments.map((ec) => ec.comment),
    ]);

    setTranslating(true);
    setTranslateError(null);
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts }),
    })
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.detail ?? json.error ?? `status ${r.status}`);
        const translations: string[] = json.translations;
        if (!Array.isArray(translations)) throw new Error("unexpected response shape");
        const map: Record<string, string> = {};
        texts.forEach((text, i) => { if (translations[i]) map[text] = translations[i]; });
        setZhCache(map);
      })
      .catch((e) => setTranslateError(e instanceof Error ? e.message : String(e)))
      .finally(() => setTranslating(false));
  }, [lang, data]); // eslint-disable-line react-hooks/exhaustive-deps

  const t = useCallback(
    (text: string) => (lang === "zh" ? (zhCache[text] ?? text) : text),
    [lang, zhCache]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0d0d14]">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {lang === "zh" ? "智囊团" : "Think Tank"}
        </Link>
        <LanguageToggle />
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-2">
            {lang === "zh"
              ? (() => {
                  const now = new Date();
                  const days = ["日", "一", "二", "三", "四", "五", "六"];
                  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${days[now.getDay()]}`;
                })()
              : new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl font-bold text-white mb-1">
            {lang === "zh" ? "每日智囊简报" : "Daily Briefing"}
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            {lang === "zh"
              ? "AI 从全球新闻中精选 5 条重大事件，邀请专家团独立点评"
              : "5 major global stories, each analyzed independently by the think tank"}
          </p>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-white/[0.03] border border-white/8 text-sm">
          <div>
            {data?.last_updated
              ? <span className="text-white/40">{formatLastUpdated(data.last_updated, lang)}</span>
              : <span className="text-white/25">{lang === "zh" ? "今日简报加载中…" : "Loading today's briefing…"}</span>
            }
            {translating && (
              <p className="text-white/25 text-xs mt-0.5">翻译中…</p>
            )}
            {translateError && (
              <p className="text-red-400/70 text-xs mt-0.5 break-all">翻译失败：{translateError}</p>
            )}
          </div>
          <span className="text-xs text-white/20">
            {lang === "zh" ? "每天北京时间 8:00 自动更新" : "Auto-refreshes daily at 8 AM Beijing time"}
          </span>
        </div>

        {/* Loading skeleton */}
        {initialLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/8 p-5 animate-pulse">
                <div className="h-4 bg-white/8 rounded w-3/4 mb-3" />
                <div className="h-3 bg-white/5 rounded w-full mb-2" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* News cards */}
        {!initialLoading && (data?.articles?.length ?? 0) > 0 && (
          <div className="space-y-4">
            {data!.articles.map((article, i) => (
              <NewsCard key={i} article={article} lang={lang} t={t} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!initialLoading && !data?.articles?.length && (
          <div className="text-center py-20 text-white/25 text-sm">
            {lang === "zh" ? "今日简报尚未生成，请稍后再来" : "Today's briefing hasn't been generated yet — check back later"}
          </div>
        )}
      </main>
    </div>
  );
}
