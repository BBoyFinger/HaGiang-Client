import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <>
      <Helmet>
        <title>{t('contact.title')}</title>
        <meta name="description" content={t('contact.description')} />
        <meta property="og:title" content={t('contact.title')} />
        <meta property="og:description" content={t('contact.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homieTravel.vn/contact" />
        <meta property="og:image" content="https://homieTravel.vn/og-image.jpg" />
        <meta name="tiktok:card" content="summary_large_image" />
        <meta name="tiktok:title" content={t('contact.title')} />
        <meta name="tiktok:description" content={t('contact.description')} />
        <meta name="tiktok:image" content="https://homieTravel.vn/og-image.jpg" />
      </Helmet>
      <div className="max-w-lg mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('contact.title')}</h2>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium">{t('contact.name')}</label>
            <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('contact.namePlaceholder')} />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('contact.email')}</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="border rounded px-3 py-2 w-full" placeholder={t('contact.emailPlaceholder')} />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('contact.message')}</label>
            <textarea name="message" value={form.message} onChange={handleChange} required className="border rounded px-3 py-2 w-full" rows={4} placeholder={t('contact.messagePlaceholder')} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">{t('contact.submit')}</button>
          {success && <div className="mt-4 text-green-600 font-semibold text-center">{t('contact.success')}</div>}
        </form>
      </div>
    </>
  );
} 