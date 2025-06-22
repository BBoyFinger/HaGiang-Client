import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">{t('about.title')}</h2>
      <div className="mb-6 text-lg text-gray-700 text-center">{t('about.mission')}</div>
      <div className="mb-6 text-base text-gray-600">{t('about.values')}</div>
      <div className="text-base text-gray-600">{t('about.team')}</div>
    </div>
  );
}
