import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Sprout, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import heroBackground from '@/assets/agri-hero-bg.jpg';

const Index: React.FC = () => {
  const { t } = useTranslation();

  return <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-background">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">{t('app.name')}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.features')}
            </a>
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
      
      {/* Hero Section with Background */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBackground} alt="Agricultural fields" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {t('landing.hero.title')}
          </h1>
          <p className="text-xl text-white/90 mb-8 drop-shadow-md">
            {t('landing.hero.subtitle')}
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-xl">
              {t('landing.hero.cta')} <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-16">
        
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white rounded-xl shadow-lg hover-lift">
            <Sprout className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">{t('landing.features.yieldIntelligence.title')}</h3>
            <p className="text-muted-foreground">{t('landing.features.yieldIntelligence.description')}</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg hover-lift">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">{t('landing.features.priceForecasting.title')}</h3>
            <p className="text-muted-foreground">{t('landing.features.priceForecasting.description')}</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg hover-lift">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">{t('landing.features.virtualHedging.title')}</h3>
            <p className="text-muted-foreground">{t('landing.features.virtualHedging.description')}</p>
          </div>
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
