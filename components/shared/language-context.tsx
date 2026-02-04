"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "es" | "fr" | "de" | "zh" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  autoTranslate: boolean;
  setAutoTranslate: (enabled: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [autoTranslate, setAutoTranslateState] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem("aeko-language") as Language;
    const storedAutoTranslate = localStorage.getItem("aeko-auto-translate");

    if (storedLang) {
      setLanguageState(storedLang);
    }

    if (storedAutoTranslate !== null) {
      setAutoTranslateState(storedAutoTranslate === "true");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("aeko-language", lang);
    // In a real app with i18n, you might trigger a reload or change the locale here
    document.documentElement.lang = lang;
  };

  const setAutoTranslate = (enabled: boolean) => {
    setAutoTranslateState(enabled);
    localStorage.setItem("aeko-auto-translate", String(enabled));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, autoTranslate, setAutoTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
