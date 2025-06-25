import { useTranslation } from "react-i18next";
import { Helmet } from 'react-helmet-async'

export default function About() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('about.title')}</title>
        <meta name="description" content={t('about.description')} />
        <meta property="=og:title" content={t('about.description')} />
        <meta property="pg:description" content={t('about.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homietravel.com/about" />
        <meta property="og:image" content="https:homietravel.com/og-image.jpg" />
        <meta name="tiktok:card" content="summary_large_image" />
        <meta name="tiktok:title" content={t('about.title')} />
        <meta name="tiktok:description" content={t('about.description')} />
        <meta name="tiktok:image" content="https://homietravel.vn/og-image.jpg" />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">{t('about.title')}</h2>
        <div className="mb-6 text-lg text-gray-700 text-center">{t('about.mission')}</div>
        <div className="mb-6 text-base text-gray-600">{t('about.values')}</div>
        <div className="text-base text-gray-600">{t('about.team')}</div>
      </div>
    </>
  );
}
