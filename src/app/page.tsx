"use client";

import Link from "next/link";
import { characters } from "@/config/characters";
import CardImage from "@/components/CardImage";
import LanguageToggle from "@/components/LanguageToggle";
import { useLang } from "@/context/LanguageContext";
import { t } from "@/i18n/translations";
import CreatorLinks from "@/components/CreatorLinks";

export default function HomePage() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="pt-14 pb-8 px-6 text-center relative">
        {/* Top right controls */}
        <div className="absolute top-5 right-6 flex items-center gap-3">
          <Link
            href="/news"
            className="text-xs text-white/35 hover:text-white/65 transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-full"
          >
            {lang === "zh" ? "每日简报" : "Daily Brief"}
          </Link>
          <LanguageToggle />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
          {tr.siteTitle}
        </h1>
        <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
          {tr.siteSubtitle}
        </p>
      </header>

      {/* Character Grid */}
      <section className="flex-1 max-w-5xl mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/chat/${character.id}`}
              className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer block"
            >
              {/* Avatar */}
              <div className="relative h-52 w-full overflow-hidden bg-white/5">
                <CardImage character={character} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-white mb-1">
                  {character.name}
                </h2>
                <p className="text-xs text-white/40 mb-3">
                  {character.title[lang]}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {character.tags[lang].map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded-full border"
                      style={{
                        borderColor: `${character.accentColor}40`,
                        color: character.accentColor,
                        background: `${character.accentColor}15`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-white/55 leading-relaxed line-clamp-3">
                  {character.description[lang]}
                </p>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <div
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-center transition-all duration-200 border opacity-0 group-hover:opacity-100"
                  style={{
                    borderColor: `${character.accentColor}60`,
                    color: character.accentColor,
                    background: `${character.accentColor}15`,
                  }}
                >
                  {tr.startChat}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-3 py-6">
        <CreatorLinks />
        <p className="text-white/20 text-xs">{tr.footer}</p>
        <p className="text-white/15 text-xs">Built by Yaqi, Cr. Nuwa.Skill</p>
      </footer>
    </main>
  );
}
