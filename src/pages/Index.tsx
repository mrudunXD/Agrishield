import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Sprout, Shield, TrendingUp, ArrowRight, Sparkles, PlayCircle, LineChart, Leaf } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import heroBackground from '@/assets/agri-hero-bg.jpg';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  const { t } = useTranslation();

  return <div className="min-h-screen bg-background">
      <nav className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">{t('app.name')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.about')}
            </Link>
            <ThemeToggle />
            <Link to="/login">
              <Button className="bg-primary hover:bg-primary/90" size="sm">{t('nav.login')}</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBackground} alt="Lush agricultural fields" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/40" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-32">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_400px] items-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-7 text-white"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                <Sparkles className="h-4 w-4" /> {t('landing.hero.badge')}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-xl">
                {t('landing.hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                {t('landing.hero.subtitle')}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/login">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-xl">
                    {t('landing.hero.cta')} <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link to="/learning" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition">
                  <PlayCircle className="h-4 w-4" /> {t('landing.hero.secondaryCta')}
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 pt-8 text-sm text-white/70">
                <div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-emerald-200" /> {t('landing.hero.stats.fields')}</div>
                <div className="flex items-center gap-2"><LineChart className="h-4 w-4 text-emerald-200" /> {t('landing.hero.stats.uplift')}</div>
                <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-200" /> {t('landing.hero.stats.coverage')}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-8 text-white shadow-2xl"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{t('landing.hero.panel.title')}</h2>
                <p className="text-sm text-white/70 leading-relaxed">{t('landing.hero.panel.description')}</p>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span>{t('landing.hero.panel.metrics.coverage.title')}</span>
                  <span className="font-semibold text-emerald-200">{t('landing.hero.panel.metrics.coverage.value')}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span>{t('landing.hero.panel.metrics.yield.title')}</span>
                  <span className="font-semibold text-emerald-200">{t('landing.hero.panel.metrics.yield.value')}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span>{t('landing.hero.panel.metrics.pricing.title')}</span>
                  <span className="font-semibold text-emerald-200">{t('landing.hero.panel.metrics.pricing.value')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-16">
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
          {[{
            icon: Sprout,
            title: t('landing.features.yieldIntelligence.title'),
            description: t('landing.features.yieldIntelligence.description')
          }, {
            icon: TrendingUp,
            title: t('landing.features.priceForecasting.title'),
            description: t('landing.features.priceForecasting.description')
          }, {
            icon: Shield,
            title: t('landing.features.virtualHedging.title'),
            description: t('landing.features.virtualHedging.description')
          }].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.4 }}
              className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/95 shadow-lg backdrop-blur transition hover:-translate-y-2 hover:shadow-xl dark:border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden />
              <div className="relative p-8 space-y-5">
                <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4 text-primary shadow-inner">
                  <feature.icon className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                  {t('landing.features.learnMore')}
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary text-white relative overflow-hidden">
          <div className="container relative z-10 px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  {t('landing.cta.title')}
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto px-4">
                  {t('landing.cta.description')}
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <Link to="/login" className="inline-block">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-xl">
                    {t('landing.cta.button')} <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>;
};

// Helper component for star rating
const Star: React.FC<{
  filled: boolean;
}> = ({
  filled
}) => {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-500 hover:scale-125 transition-transform duration-300">
      <path d="M10 1L12.39 6.55L18.5 7.31L14.25 11.75L15.51 18L10 15.09L4.49 18L5.75 11.75L1.5 7.31L7.61 6.55L10 1Z" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
};

export default Index;
