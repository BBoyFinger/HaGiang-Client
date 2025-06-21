import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FiGlobe, FiChevronDown } from "react-icons/fi";

interface LanguageSwitcherProps {
  isDark: boolean;
}

const LanguageSwitcher = ({ isDark }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        }`}
        aria-label="Change language"
      >
        <FiGlobe size={16} />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <span className="text-sm hidden sm:block">{currentLanguage.name}</span>
        <FiChevronDown 
          size={14} 
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  i18n.language === language.code
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {i18n.language === language.code && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher; 