import { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext.js";
import { translations } from "../utils/translations.js";

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") === "ar" ? "ar" : "en");

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (key, params = {}) => {
    let text = language === "ar" ? translations[key] || key : key;
    Object.keys(params).forEach((name) => {
      text = text.replaceAll(`{${name}}`, () => String(params[name]));
    });
    return text;
  };

  const tError = (message) => {
    if (!message) return "";
    if (language === "en") return message;
    return translations[message] || translations["Something went wrong. Please try again."];
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t, tError }}>{children}</LanguageContext.Provider>;
};

export { LanguageProvider };
