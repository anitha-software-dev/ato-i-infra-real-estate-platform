"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "@/data/translations/en.json";
import hi from "@/data/translations/hi.json";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language;
    if (storedLang === "en" || storedLang === "hi") {
      setLanguageState(storedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const translations: Record<string, any> = language === "en" ? en : hi;
    const keys = key.split(".");
    let result = translations;
    
    for (const k of keys) {
      if (result[k] === undefined) {
        return key; // Fallback to key if not found
      }
      result = result[k];
    }
    
    return typeof result === "string" ? result : key;
  };

  // Prevent hydration mismatch by rendering default English until mounted
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "en", setLanguage, t: (k) => k }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
