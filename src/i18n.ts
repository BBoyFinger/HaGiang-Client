import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import trực tiếp file translation
import translationEN from "./locales/en/translation.json";
import translationVI from "./locales/vi/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18n
  .use(LanguageDetector) // tự phát hiện ngôn ngữ trình duyệt
  .use(initReactI18next) // kết nối với react-i18next
  .init({
    resources,
    fallbackLng: "vi", // fallback khi không tìm thấy ngôn ngữ
    debug: true, // bật debug để xem log
    interpolation: {
      escapeValue: false, // react đã xử lý XSS
    },
    react: {
      useSuspense: false, // nếu bạn không dùng React.Suspense
    },
  });

export default i18n;
