"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "@/i18n/translations";

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "zh",
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("parthenon-lang") as Lang | null;
    if (saved === "zh" || saved === "en") setLang(saved);
  }, []);

  const toggle = () => {
    setLang((prev) => {
      const next = prev === "zh" ? "en" : "zh";
      localStorage.setItem("parthenon-lang", next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
