"use client";

import { useLang } from "@/context/LanguageContext";
import { t } from "@/i18n/translations";

export default function LanguageToggle() {
  const { lang, toggle } = useLang();

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 rounded-full border border-white/15 text-white/50 hover:text-white/80 hover:border-white/30 transition-all duration-200 text-xs font-medium tracking-wide"
    >
      {t[lang].langToggle}
    </button>
  );
}
