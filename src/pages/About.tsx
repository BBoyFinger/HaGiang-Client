import { useTranslation } from "react-i18next";
import { Helmet } from 'react-helmet-async';
import { FaUsers, FaHeart, FaAward, FaMapMarkedAlt, FaHandshake, FaLightbulb, FaShieldAlt, FaGlobe } from 'react-icons/fa';

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('about.title')}</title>
        <meta name="description" content={t('about.description')} />
        <meta property="og:title" content={t('about.title')} />
        <meta property="og:description" content={t('about.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homietravel.com/about" />
        <meta property="og:image" content="https://homietravel.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('about.title')} />
        <meta name="twitter:description" content={t('about.description')} />
        <meta name="twitter:image" content="https://homietravel.vn/og-image.jpg" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-light">
            <h1 className="text-5xl font-bold mb-4">{t('about.title')}</h1>
            <p className="text-xl max-w-2xl mx-auto px-4">
              {t('about.slogan')}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-light to-transparent"></div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-light">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">{t('about.missionTitle')}</h2>
              <p className="text-lg text-[#555] leading-relaxed mb-6">
                {t('about.mission')}
              </p>

            </div>
            <div className="relative">
              <img
                src="/src/assets/1.jpg"
                alt="Hà Giang Landscape"
                className="rounded-lg shadow-2xl w-full h-80 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10+</div>
                  <div className="text-sm text-gray-600">{t('about.yearsExperience')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('about.valuesTitle')}</h2>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">
              {t('about.values')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-light p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{t('about.values.commitment')}</h3>
              <p className="text-[#555]">{t('about.values.commitmentDesc')}</p>
            </div>

            <div className="bg-light p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{t('about.values.safety')}</h3>
              <p className="text-[#555]">{t('about.values.safetyDesc')}</p>
            </div>

            <div className="bg-light p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLightbulb className="text-2xl text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{t('about.values.creativity')}</h3>
              <p className="text-[#555]">{t('about.values.creativityDesc')}</p>
            </div>

            <div className="bg-light p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{t('about.values.responsibility')}</h3>
              <p className="text-[#555]">{t('about.values.responsibilityDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-light">
              <div className="text-4xl font-bold mb-2">{t('about.stats.satisfiedCustomers')}</div>
              <div className="text-[#333]">{t('about.stats.satisfiedCustomersDesc')}</div>
            </div>
            <div className="text-light">
              <div className="text-4xl font-bold mb-2">{t('about.stats.successfulTours')}</div>
              <div className="text-[#333]">{t('about.stats.successfulToursDesc')}</div>
            </div>
            <div className="text-light">
              <div className="text-4xl font-bold mb-2">{t('about.stats.destinations')}</div>
              <div className="text-[#333]">{t('about.stats.destinationsDesc')}</div>
            </div>
            <div className="text-light">
              <div className="text-4xl font-bold mb-2">{t('about.stats.support')}</div>
              <div className="text-[#333]">{t('about.stats.supportDesc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-light">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('about.teamTitle')}</h2>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">
              {t('about.team')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaUsers className="text-4xl text-light" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{t('about.team.guides')}</h3>
              <p className="text-[#555]">{t('about.team.guidesDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-secondary to-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaMapMarkedAlt className="text-4xl text-light" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{t('about.team.travelExperts')}</h3>
              <p className="text-[#555]">{t('about.team.travelExpertsDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-accent to-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaHandshake className="text-4xl text-light" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{t('about.team.customerService')}</h3>
              <p className="text-[#555]">{t('about.team.customerServiceDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('about.whyChooseUsTitle')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaAward className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{t('about.whyChooseUs.quality')}</h3>
                  <p className="text-[#555]">{t('about.whyChooseUs.qualityDesc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{t('about.whyChooseUs.absoluteSafety')}</h3>
                  <p className="text-[#555]">{t('about.whyChooseUs.absoluteSafetyDesc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaUsers className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{t('about.whyChooseUs.professionalTeam')}</h3>
                  <p className="text-[#555]">{t('about.whyChooseUs.professionalTeamDesc')}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/src/assets/2.png"
                alt="Hà Giang Experience"
                className="rounded-lg shadow-2xl w-full h-80 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-light p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{t('about.whyChooseUs.satisfiedCustomersPercentage')}</div>
                  <div className="text-sm text-[#555]">{t('about.whyChooseUs.satisfiedCustomersDesc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">{t('about.ctaTitle')}</h2>
          <p className="text-xl text-[#555] mb-8">
            {t('about.ctaDesc')}
          </p>
          <div className="space-x-4">
            <button className="bg-light text-primary px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors">
              {t('about.seeToursNow')}
            </button>
            <button className="border-2 border-light text-[#1a1a1a] px-8 py-3 rounded-lg font-semibold hover:bg-light hover:text-primary transition-colors">
              {t('about.contactConsult')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
