import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Info,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  AlertTriangle
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const MarketForecast = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'forecast' | 'mandis' | 'insights'>('forecast');
  const insightsRef = useRef<HTMLDivElement | null>(null);
  const [priceAlertOpen, setPriceAlertOpen] = useState(false);
  const [logisticsOpen, setLogisticsOpen] = useState(false);
  const [alertPrice, setAlertPrice] = useState('5400');
  const [alertChannel, setAlertChannel] = useState<'sms' | 'whatsapp' | 'email'>('whatsapp');
  const [alertNote, setAlertNote] = useState('Track Sangli mandi premium window.');

  const priceData = [
    { month: 'Jan', price: 4720 },
    { month: 'Feb', price: 4860 },
    { month: 'Mar', price: 5035 },
    { month: 'Apr', price: 5310 },
    { month: 'May', price: 5480 },
    { month: 'Jun', price: 5210 },
  ];

  const maxPrice = Math.max(...priceData.map((data) => data.price)) + 200;
  const minPrice = Math.min(...priceData.map((data) => data.price)) - 150;
  const axisTicks = Array.from({ length: 5 }, (_, index) => {
    const step = (maxPrice - minPrice) / 4;
    return Math.round(minPrice + step * index);
  }).reverse();
  const chartPoints = priceData.map((data, idx) => {
    const x = (idx / (priceData.length - 1)) * 100;
    const y = 100 - ((data.price - minPrice) / (maxPrice - minPrice)) * 100;
    return { ...data, x, y };
  });
  const areaPath = [
    `M 0,100`,
    ...chartPoints.map((point) => `L ${point.x},${point.y}`),
    `L 100,100 Z`
  ].join(' ');
  const linePath = chartPoints.map((point) => `${point.x},${point.y}`).join(' ');

  const highlightStats = [
    {
      title: 'Spot price (Sangli)',
      value: '₹5,200',
      helper: '+3.2% vs last week',
      accent: 'bg-success/15 text-success border border-success/30',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      title: '30-day band',
      value: '₹5,100 – ₹5,400',
      helper: 'HSR model · 52% probability',
      accent: 'bg-primary/15 text-primary border border-primary/30',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      title: 'Volatility',
      value: 'Low',
      helper: '6.4% vs 10% seasonal avg',
      accent: 'bg-accent/20 text-accent-foreground border border-accent/30',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  const priceDrivers = [
    {
      title: 'Monsoon coverage at 108%',
      detail: 'Moisture profile supporting seed demand and crushing schedules.',
      tone: 'positive',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      title: 'Global supply squeeze',
      detail: 'Argentina drought keeps soybean output 18% lower YoY, lifting import parity.',
      tone: 'positive',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      title: 'Import competition',
      detail: 'Palm oil imports at 15-month highs could cap upside beyond ₹5,600.',
      tone: 'negative',
      icon: <TrendingDown className="w-4 h-4" />,
    },
  ];

  const scenarioBands = [
    {
      name: 'Base case',
      range: '₹5,100 – ₹5,350',
      probability: '52%',
      tone: 'text-primary',
      summary: 'Steady domestic demand with normal transport flows.',
    },
    {
      name: 'Bullish case',
      range: '₹5,350 – ₹5,650',
      probability: '28%',
      tone: 'text-success',
      summary: 'Export orders accelerate; MSP procurement stays active.',
    },
    {
      name: 'Bearish case',
      range: '₹4,900 – ₹5,100',
      probability: '20%',
      tone: 'text-warning',
      summary: 'Heavy arrivals meet cheaper palm oil substitutes.',
    },
  ];

  const indicatorStats = [
    { label: 'Global benchmark', value: '$485/MT', note: '+2.1% WoW', tone: 'text-success' },
    { label: 'Import duty', value: '30%', note: 'Unchanged', tone: 'text-muted-foreground' },
    { label: 'MSP (2024-25)', value: '₹5,800/Q', note: '+6.5%', tone: 'text-success' },
    { label: 'Stock-to-use', value: '28%', note: 'Below avg', tone: 'text-warning' },
    { label: 'Currency (USD/INR)', value: '83.1', note: 'Stable', tone: 'text-muted-foreground' },
    { label: 'Export orders', value: '↑ 25%', note: 'China demand', tone: 'text-success' },
  ];

  const mandiPrices = [
    { mandi: 'Ahmedabad', price: 5200, change: 3.2, trend: 'up', note: 'Grade A pods', distance: '620 km' },
    { mandi: 'Rajkot', price: 5150, change: 2.8, trend: 'up', note: 'Moisture 8%', distance: '410 km' },
    { mandi: 'Mumbai', price: 5280, change: 4.1, trend: 'up', note: 'Export demand active', distance: '485 km', best: true },
    { mandi: 'Pune', price: 5190, change: 1.9, trend: 'up', note: 'Premium grading', distance: '320 km' },
    { mandi: 'Indore', price: 5120, change: -0.5, trend: 'down', note: 'Rain-affected lots', distance: '720 km' },
  ];

  const bullishFactors = [
    'Above-normal rainfall (108% of LPA) has expanded kharif sowing, lifting oilseed demand by 12%.',
    "Argentina drought reduced soybean output by 18%, tightening global supply and supporting prices.",
    'Indian groundnut exports to China are up 25% YoY, keeping kernel demand strong.',
    'MSP increased 6.5% with procurement active in Gujarat, Rajasthan and Andhra Pradesh.',
  ];

  const bearishFactors = [
    'Palm oil imports at a 15-month high offer cheaper downstream alternatives.',
    'Rupee strength versus USD could make imports more attractive, pressuring domestic quotes.',
    'Peak arrivals expected in 8–10 weeks may soften bids temporarily by 3–5%.',
  ];

  const aiRecommendation = {
    summary: 'Models keep prices within ₹5,100 – ₹5,400 for the next 30 days with a mild upward bias.',
    action: 'Hedge 40–50% of expected yield in the next two weeks to lock favourable rates.',
    confidence: '78%',
    window: 'Next review in 6 hours',
  };

  const logisticsComparisons = useMemo(() => {
    return mandiPrices
      .map((mandi) => {
        const distanceKm = parseInt(mandi.distance.replace(/[^0-9]/g, ''), 10) || 0;
        const freight = Math.round(distanceKm * 4.2); // ₹ estimate per quintal load share
        const handling = 260;
        const logisticsCost = freight + handling;
        const netRealisation = Math.round(mandi.price - logisticsCost / 10); // assume 10 quintal shipment share
        return {
          ...mandi,
          distanceKm,
          freight,
          handling,
          logisticsCost,
          netRealisation,
        };
      })
      .sort((a, b) => b.netRealisation - a.netRealisation);
  }, [mandiPrices]);

  const handleExportForecast = useCallback(() => {
    const payload = {
      generatedAt: new Date().toISOString(),
      priceData,
      highlightStats,
      scenarioBands,
      indicatorStats,
      mandiPrices,
      aiRecommendation,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `market-forecast-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast({ title: 'Forecast exported', description: 'A JSON snapshot has been downloaded to your device.' });
  }, [aiRecommendation, highlightStats, indicatorStats, mandiPrices, priceData, scenarioBands]);

  const handleAlertSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPriceAlertOpen(false);
    toast({
      title: 'Price alert set',
      description: `We will notify you via ${alertChannel.toUpperCase()} when spot hits ₹${alertPrice}.`,
    });
  };

  const handleSwitchToInsights = () => {
    setActiveTab('insights');
    requestAnimationFrame(() => {
      insightsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleLaunchHedgingPlan = () => {
    toast({ title: 'Opening hedging planner', description: 'Taking you to the Smart Hedging hub.' });
    navigate('/hedging');
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <section className="rounded-3xl border border-border/50 bg-card/95 p-6 md:p-10 shadow-lg">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
          <div className="space-y-6 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="w-4 h-4" /> Market intelligence
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-primary">Market & Price Forecast</h1>
              <p className="text-muted-foreground text-base">
                Live mandi signals blended with Sakhi’s AI models to help you sell at the right moment and secure margins.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={handleExportForecast}>
                <BarChart3 className="w-5 h-5" /> Export forecast
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={() => setPriceAlertOpen(true)}>
                <ArrowUpRight className="w-5 h-5" /> Set price alert
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highlightStats.map((stat) => (
                <div key={stat.title} className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.accent}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.title}</p>
                      <p className="text-lg font-semibold text-primary mt-1">{stat.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{stat.helper}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="w-full xl:w-96 bg-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">Today’s confidence snapshot</CardTitle>
              <CardDescription>Optimised for groundnut, Maharashtra cluster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Market confidence</span>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {aiRecommendation.confidence}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-success mt-0.5" />
                  <span>Retail enquiries up 9% week-on-week across Western India.</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                  <span>Watch palm oil spreads above ₹18/kg — upside caps near ₹5,600.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-0.5" />
                  <span>{aiRecommendation.window}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={handleSwitchToInsights}>
                View hedging ideas
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full space-y-6">
        <TabsList className="mx-auto grid w-full grid-cols-3 rounded-2xl bg-muted/40 p-1">
          <TabsTrigger value="forecast" className="rounded-2xl data-[state=active]:bg-card data-[state=active]:text-foreground">
            Price Forecast
          </TabsTrigger>
          <TabsTrigger value="mandis" className="rounded-2xl data-[state=active]:bg-card data-[state=active]:text-foreground">
            Mandi Prices
          </TabsTrigger>
          <TabsTrigger value="insights" className="rounded-2xl data-[state=active]:bg-card data-[state=active]:text-foreground">
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-6">
          <Card className="soft-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                6-month price trajectory
              </CardTitle>
              <CardDescription>Historical closes and Sakhi projections (₹/quintal)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative h-48 max-w-3xl mx-auto rounded-3xl border border-border/40 bg-card/80">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible rounded-3xl">
                  <defs>
                    <linearGradient id="marketArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="marketLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="70%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#marketArea)" stroke="none" />
                  <polyline points={linePath} fill="none" stroke="url(#marketLine)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  {chartPoints.map((point, idx) => {
                    const isForecast = idx >= priceData.length - 2;
                    return (
                      <g key={`dot-${point.month}`}>
                        <circle cx={point.x} cy={point.y} r={2} fill="white" stroke="none" />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={1.2}
                          fill={isForecast ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}
                        />
                      </g>
                    );
                  })}
                </svg>
                <div className="absolute inset-y-6 left-6 flex flex-col justify-between text-[10px] text-muted-foreground">
                  {axisTicks.map((tick) => (
                    <span key={`axis-${tick}`}>₹{tick.toLocaleString('en-IN')}</span>
                  ))}
                </div>
                <div className="absolute inset-x-8 bottom-3 flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
                  {priceData.map((data) => (
                    <span key={`label-${data.month}`}>{data.month}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-primary/80" />
                  <span>Historical</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-accent/70" />
                  <span>AI forecast</span>
                </div>
                <div className="text-xs">Sakhi models factor weather, MSP, global spreads & logistics.</div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="soft-card hover-lift xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Price drivers on radar</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {priceDrivers.map((driver) => (
                  <div
                    key={driver.title}
                    className={`rounded-2xl border border-border/40 p-4 space-y-2 ${
                      driver.tone === 'positive' ? 'bg-success/5' : 'bg-warning/5'
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      driver.tone === 'positive' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                    }`}>
                      {driver.icon}
                    </div>
                    <p className="text-sm font-medium text-foreground">{driver.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{driver.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="soft-card hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Scenario bands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scenarioBands.map((scenario) => (
                  <div key={scenario.name} className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{scenario.name}</p>
                      <Badge variant="outline" className="border-primary/30 text-xs">
                        {scenario.probability}
                      </Badge>
                    </div>
                    <p className={`text-base font-semibold ${scenario.tone}`}>{scenario.range}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{scenario.summary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="soft-card hover-lift">
            <CardHeader>
              <CardTitle className="text-lg">Key market indicators</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {indicatorStats.map((indicator) => (
                <div key={indicator.label} className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{indicator.label}</p>
                  <p className={`text-lg font-semibold ${indicator.tone}`}>{indicator.value}</p>
                  <p className="text-xs text-muted-foreground">{indicator.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mandis" className="space-y-6">
          <Card className="soft-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Live mandi pulse
              </CardTitle>
              <CardDescription>Updated today at 10:00 AM · All prices in ₹/quintal</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mandiPrices.map((mandi) => (
                <div
                  key={mandi.mandi}
                  className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-3 hover:border-primary/40 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{mandi.mandi}</p>
                      <p className="text-xs text-muted-foreground">{mandi.note}</p>
                    </div>
                    {mandi.best && (
                      <Badge variant="outline" className="border-success/40 bg-success/10 text-success text-[11px]">
                        Best price
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-primary">₹{mandi.price.toLocaleString('en-IN')}</span>
                    <Badge
                      variant="outline"
                      className={`${
                        mandi.trend === 'up'
                          ? 'border-success/40 bg-success/15 text-success'
                          : 'border-destructive/40 bg-destructive/15 text-destructive'
                      } flex items-center gap-1 text-xs`}
                    >
                      {mandi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(mandi.change)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {mandi.distance} from your farm
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="soft-card hover-lift border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3 max-w-3xl">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary">Route optimisation tip</p>
                  <p className="text-sm text-muted-foreground">
                    Net realisation improves ₹90–₹120/quintal if you ship to Mumbai this week after accounting for freight.
                    Evaluate transporter availability before 6 PM to lock the slot.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setLogisticsOpen(true)}>
                <ArrowUpRight className="w-4 h-4" /> Compare logistics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6" ref={insightsRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="soft-card hover-lift border-success/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <TrendingUp className="w-5 h-5" /> Bullish factors
                </CardTitle>
                <CardDescription>Signals supporting higher prices</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {bullishFactors.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-success" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="soft-card hover-lift border-warning/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <TrendingDown className="w-5 h-5" /> Bearish watchlist
                </CardTitle>
                <CardDescription>Risks that could pressurise quotes</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {bearishFactors.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-warning" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="soft-card hover-lift border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg text-primary">AI recommendation</CardTitle>
              <CardDescription>Strategic call based on integrated market, weather and logistics data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{aiRecommendation.summary}</p>
              <div className="rounded-2xl border border-primary/30 bg-background/70 p-4 text-foreground">
                <p className="font-medium">Suggested action</p>
                <p className="mt-1 text-sm text-muted-foreground">{aiRecommendation.action}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  Confidence · {aiRecommendation.confidence}
                </Badge>
                <Button size="sm" className="gap-2" onClick={handleLaunchHedgingPlan}>
                  <TrendingUp className="w-4 h-4" /> Launch hedging plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={priceAlertOpen} onOpenChange={setPriceAlertOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Create price alert</DialogTitle>
            <DialogDescription>Get notified when Sangli spot prices hit your target band.</DialogDescription>
          </DialogHeader>
          <form className="space-y-5" onSubmit={handleAlertSubmit}>
            <div className="space-y-2">
              <Label htmlFor="alertPrice">Target price (₹/quintal)</Label>
              <Input
                id="alertPrice"
                value={alertPrice}
                onChange={(event) => setAlertPrice(event.target.value.replace(/[^0-9]/g, ''))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Notify me via</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'sms', label: 'SMS' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                  { value: 'email', label: 'Email' },
                ].map((channel) => (
                  <Button
                    key={channel.value}
                    type="button"
                    variant={alertChannel === channel.value ? 'default' : 'secondary'}
                    className="text-xs"
                    onClick={() => setAlertChannel(channel.value as typeof alertChannel)}
                  >
                    {channel.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertNote">Note for our desk (optional)</Label>
              <Input
                id="alertNote"
                value={alertNote}
                onChange={(event) => setAlertNote(event.target.value)}
                placeholder="E.g. alert only between 9 AM and 6 PM"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setPriceAlertOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save alert
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={logisticsOpen} onOpenChange={setLogisticsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-primary" /> Logistics comparison
            </DialogTitle>
            <DialogDescription>Evaluate net realization after freight and handling for key mandis.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 text-sm text-muted-foreground">
                Estimates assume 10-quintal shipment, ₹4.2/km freight and ₹260 handling. Adjust to match your transporter quotes.
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {logisticsComparisons.map((option) => (
                <div key={option.mandi} className="rounded-2xl border border-border/40 bg-background/80 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{option.mandi}</p>
                    {option.best && (
                      <Badge variant="outline" className="border-success/40 bg-success/10 text-success text-[11px]">
                        Best price
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Distance · {option.distance}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Spot price</span>
                    <span className="font-semibold text-primary">₹{option.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Logistics (est.)</span>
                    <span className="font-semibold">₹{Math.round(option.logisticsCost / 10).toLocaleString('en-IN')}/Q</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Net realisation</span>
                    <span className="font-semibold text-success">₹{option.netRealisation.toLocaleString('en-IN')}/Q</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogisticsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketForecast;
