import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, Shield, TrendingUp, Users, Target, Award, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-background">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">AgriShield</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/">
              <Button variant="outline" size="sm">Home</Button>
            </Link>
            <Link to="/onboarding">
              <Button className="bg-primary hover:bg-primary/90" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            About AgriShield
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Empowering India's oilseed farmers with AI-driven intelligence and financial protection
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To transform the lives of India's oilseed farmers by providing cutting-edge AI technology 
                    that optimizes crop yields and protects their income through smart price hedging strategies.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                    <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Farmer-First Approach</h3>
                      <p className="text-sm text-muted-foreground">
                        Every feature designed with farmer needs at the core
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                    <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Data-Driven Decisions</h3>
                      <p className="text-sm text-muted-foreground">
                        Leveraging satellite, weather, and market data for accurate predictions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-success/10 mb-4">
                  <Sprout className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Yield Intelligence</h3>
                <p className="text-muted-foreground mb-4">
                  Predict yield potential with precision using advanced AI models trained on weather patterns, 
                  soil health data, and satellite imagery.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                    Real-time crop health monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                    Personalized farm advisories
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                    Weather and pest alerts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Market Forecasting</h3>
                <p className="text-muted-foreground mb-4">
                  Stay ahead with 30 and 90-day price predictions powered by AI analysis of global 
                  and local market trends.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Live mandi price updates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Predictive price charts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Market insights explained
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-warning/10 mb-4">
                  <Shield className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Hedging</h3>
                <p className="text-muted-foreground mb-4">
                  Protect your income with virtual forward contracts that lock in favorable prices 
                  before harvest.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning"></div>
                    Virtual contract simulation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning"></div>
                    Risk protection tools
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning"></div>
                    FPO partnership support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Field Insights Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Farmers Gain on Day One</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border border-primary/30 bg-primary/5">
              <CardContent className="p-6 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Risk briefings every Monday</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Weekly WhatsApp digests summarise weather disruptions, mandi volatility, and input price changes for your village cluster.
                </p>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li>⏱️ 3-minute read in Hindi, Marathi, or Kannada</li>
                  <li>📊 Action checklist tailored to your acreage</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-success/30 bg-success/5">
              <CardContent className="p-6 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success/15 text-success">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Shared agronomy playbooks</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Download ready-to-deploy spray schedules, fertigation recipes, and pest scouting templates curated with KVK partners.
                </p>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li>📁 CSV + PDF formats</li>
                  <li>🤝 Co-created with 18 FPO agronomists</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-warning/30 bg-warning/5">
              <CardContent className="p-6 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-warning/15 text-warning">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Mentor-on-call desk</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Speak with a crop economist or insurance specialist in under 30 minutes to review hedging plans or financing paperwork.
                </p>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li>☎️ Hotline: +91-80-4890-2200</li>
                  <li>🗓️ Slots open 7 AM – 9 PM IST, Monday to Saturday</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farming?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of farmers who are already using AgriShield to grow smarter and sell safer.
              </p>
              <Link to="/onboarding">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  Get Started Today <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default About;
