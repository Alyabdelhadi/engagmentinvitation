import { useCallback, useEffect, useState } from "react";
import { ui, type Language } from "./invitation";

const KEY = "invitation-lang";
const isLanguage = (v: unknown): v is Language => v === "en" || v === "ar";

/* ?lang=ar in the link wins on first view; after that the visitor's choice
   is kept for the session, so a reload does not flip the page back. */
function initial(): Language {
  const fromQuery = new URLSearchParams(window.location.search).get("lang");
  if (isLanguage(fromQuery)) return fromQuery;
  try {
    const saved = sessionStorage.getItem(KEY);
    if (isLanguage(saved)) return saved;
  } catch { /* storage unavailable */ }
  return "en";
}

export function useLanguage(): [Language, () => void] {
  const [lang, setLang] = useState<Language>(initial);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = ui[lang].dir;
    document.title = `${ui[lang].siteTitle} — Alaa & Ali`;
    try { sessionStorage.setItem(KEY, lang); } catch { /* ignore */ }
  }, [lang]);

  const toggle = useCallback(() => setLang((l) => (l === "en" ? "ar" : "en")), []);
  return [lang, toggle];
}
