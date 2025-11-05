import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  MapPin, 
  Droplets, 
  Bug, 
  Sprout, 
  ThermometerSun,
  Cloud,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Leaf,
  ArrowRight,
  CalendarDays,
  Sparkles
} from 'lucide-react';

const YieldIntelligence = () => {
  const [irrigationLevel, setIrrigationLevel] = useState([60]);
  const [fertilizerLevel, setFertilizerLevel] = useState([75]);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [sowingCalendarOpen, setSowingCalendarOpen] = useState(false);
  const [fieldChecklistOpen, setFieldChecklistOpen] = useState(false);
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);

  const plots = [
    { id: 'A', name: 'North Field', status: 'good', yield: 85, area: 5, soil: 68 },
    { id: 'B', name: 'East Field', status: 'moderate', yield: 72, area: 3, soil: 55 },
    { id: 'C', name: 'South Field', status: 'good', yield: 90, area: 4, soil: 75 },
    { id: 'D', name: 'West Field', status: 'critical', yield: 45, area: 2, soil: 35 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-success/15 text-success border border-success/30';
      case 'moderate': return 'bg-warning/15 text-warning border border-warning/30';
      case 'critical': return 'bg-destructive/15 text-destructive border border-destructive/30';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'moderate': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  const highlightStats = [
    {
      title: 'Healthy plots',
      value: '2/4',
      helper: 'Stable leaf growth detected this week',
      accent: 'bg-success/15 text-success',
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      title: 'Watchlist',
      value: '1 plot',
      helper: 'Moderate stress in East Field — review irrigation',
      accent: 'bg-warning/15 text-warning',
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      title: 'Rain window',
      value: '48 hrs',
      helper: 'Light showers expected — plan spray schedule',
      accent: 'bg-accent/15 text-accent-foreground',
      icon: <Cloud className="w-4 h-4" />,
    },
  ];

  const focusTasks = [
    {
      title: 'Irrigate Plot D',
      detail: 'Soil moisture at 35%, target 55%',
      tag: 'Due today',
      accent: 'bg-primary/15 text-primary',
      icon: <Droplets className="w-4 h-4" />,
    },
    {
      title: 'Scout for aphids',
      detail: 'Check eastern boundary before noon',
      tag: 'High risk',
      accent: 'bg-warning/15 text-warning',
      icon: <Bug className="w-4 h-4 text-success" />,
    },
    {
      title: 'Schedule soil test',
      detail: 'Book lab slot for 28 Oct — rotation update',
      tag: 'Reminder set',
      accent: 'bg-secondary/30 text-secondary-foreground',
      icon: <CalendarDays className="w-4 h-4" />,
    },
  ];

  const timelineEvents = [
    {
      time: 'Today · 07:30 AM',
      title: 'Soil moisture alert',
      detail: 'Plot D dropped to 35% moisture — irrigation recommended within 24 hours.',
      tone: 'border-warning/40 bg-warning/10 text-warning'
    },
    {
      time: 'Yesterday · 05:10 PM',
      title: 'Fertilizer application logged',
      detail: 'DAP applied on Plot B at 160 kg/acre. Follow-up check scheduled in 4 days.',
      tone: 'border-primary/40 bg-primary/5 text-primary'
    },
    {
      time: '22 Oct · 09:45 AM',
      title: 'Pest scouting complete',
      detail: 'No aphid clusters detected across East Field perimeter.',
      tone: 'border-success/40 bg-success/10 text-success'
    },
    {
      time: '21 Oct · 03:20 PM',
      title: 'Weather advisory pushed',
      detail: 'Light showers expected in 48 hours — adjust spray plans accordingly.',
      tone: 'border-accent/40 bg-accent/10 text-accent-foreground'
    }
  ];

  const weatherHighlights = {
    summary: 'Warm afternoons with light showers in 48 hours. Humidity remains supportive for vegetative growth.',
    temperature: { max: 31, min: 22 },
    rainfall: 16,
    wind: '11 km/h NE'
  };

  const soilSnapshot = {
    moisture: 54,
    ph: 6.5,
    organic: 2.8,
    ec: 0.9,
    summary: 'Soil moisture steady in most plots; Plot D trending low. pH remains optimal with moderate organic matter reserves.'
  };

  const recommendedIrrigation = 80;
  const recommendedFertilizer = 90;

  const fieldChecklist = useMemo(
    () => [
      {
        title: 'Moisture balance',
        detail: 'Irrigate Plot D within the next 18 hours and re-check sensors 2 hours post watering.',
        tag: 'Urgent',
      },
      {
        title: 'Nutrient plan',
        detail: 'Broadcast 20 kg/acre DAP on Plots B & D, followed by foliar spray on day 3.',
        tag: 'Recommended',
      },
      {
        title: 'Scouting route',
        detail: 'Walk east boundary at 5 PM tomorrow to look for aphid clusters and leaf curling.',
        tag: 'Field walk',
      },
      {
        title: 'Equipment readiness',
        detail: 'Calibrate drip emitters on south block and clean pivot filters before the weekend rainfall.',
        tag: 'Maintenance',
      },
    ],
    []
  );

  const sowingCalendar = [
    {
      phase: 'Seed selection',
      window: '15 – 20 Oct',
      guidance: 'Choose GH-421 hybrid for drought tolerance. Ensure seeds are treated with trichoderma.',
    },
    {
      phase: 'Field preparation',
      window: '21 – 24 Oct',
      guidance: 'Deep tillage with FYM incorporation; maintain 45 cm row spacing markers.',
    },
    {
      phase: 'Sowing & basal nutrition',
      window: '25 – 27 Oct',
      guidance: 'Sow at 4 cm depth using seed drill. Apply 40 kg DAP + 20 kg MOP as basal dose.',
    },
    {
      phase: 'Irrigation & gap filling',
      window: '29 Oct – 2 Nov',
      guidance: 'First irrigation within 48 hours. Inspect for skips and re-sow late evening.',
    },
    {
      phase: 'Weed management',
      window: '4 – 10 Nov',
      guidance: 'Spray post-emergent herbicide at 12 DAS. Maintain soil moisture at 60%.',
    },
  ];

  const computeProjection = (irrigation: number, fertilizer: number) => {
    const irrigationScore = irrigation / 100;
    const fertilizerScore = fertilizer / 100;
    const baseline = 12;
    const projection = baseline + irrigationScore * 4 + fertilizerScore * 4;
    return Number(projection.toFixed(1));
  };

  const currentProjection = useMemo(
    () => computeProjection(irrigationLevel[0], fertilizerLevel[0]),
    [irrigationLevel, fertilizerLevel]
  );

  const optimizedProjection = useMemo(
    () => computeProjection(recommendedIrrigation, recommendedFertilizer),
    []
  );

  const potentialGain = Math.max(0, optimizedProjection - currentProjection);
  const potentialGainPercent = currentProjection > 0 ? (potentialGain / currentProjection) * 100 : 0;
  const estimatedRevenueGain = potentialGain * 5200; // ₹ per quintal

  const selectedPlot = useMemo(() => plots.find((plot) => plot.id === selectedPlotId) || null, [plots, selectedPlotId]);

  const handleDownloadInsights = useCallback(() => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        healthyPlots: highlightStats[0].value,
        watchlist: highlightStats[1].value,
        rainWindow: highlightStats[2].value,
      },
      plots,
      focusTasks,
      soilSnapshot,
      weatherHighlights,
      simulator: {
        currentProjection,
        optimizedProjection,
        potentialGain,
        potentialGainPercent: potentialGainPercent.toFixed(1),
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yield-intelligence-report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [highlightStats, plots, focusTasks, soilSnapshot, weatherHighlights, currentProjection, optimizedProjection, potentialGain, potentialGainPercent]);

  return (
    <div className="space-y-10 animate-fade-in">
      <section className="rounded-3xl border border-border/50 bg-card/95 p-6 md:p-10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-6 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="w-4 h-4" /> Intelligence hub
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-primary">AI Yield Intelligence</h1>
              <p className="text-muted-foreground text-base">
                Transform satellite, soil and weather signals into simple actions that protect your next harvest.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={() => setFieldChecklistOpen(true)}>
                <Sparkles className="w-5 h-5" /> Generate field readiness plan
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={handleDownloadInsights}>
                <TrendingUp className="w-5 h-5" /> Download insights
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highlightStats.map((stat) => (
                <div key={stat.title} className="rounded-2xl border border-border/40 bg-background/60 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.accent}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.title}</p>
                      <p className="text-lg font-semibold text-primary mt-1">{stat.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{stat.helper}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="w-full md:w-80 bg-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">Today’s focus</CardTitle>
              <CardDescription>3 high-impact tasks curated by Sakhi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {focusTasks.map((task) => (
                <div key={task.title} className="rounded-xl border border-border/40 bg-card/80 p-3 space-y-2">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full ${task.accent}`}>
                      {task.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm text-foreground">{task.title}</p>
                        <Badge variant="outline" className="text-[11px] px-2 py-0.5 border-primary/30">
                          {task.tag}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{task.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" onClick={() => setTimelineOpen(true)}>
                View activity timeline
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="soft-card hover-lift border border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Farm plot overview
              </CardTitle>
              <CardDescription>Real-time yield potential across your farm</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setSelectedPlotId(plots[0]?.id ?? null)}
            >
              Inspect in detail <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plots.map((plot) => (
              <div
                key={plot.id}
                className={`group rounded-2xl border border-border/40 bg-background/70 p-4 transition-all hover:border-primary/40 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Plot {plot.id}</h3>
                    <p className="text-xs text-muted-foreground">{plot.name}</p>
                  </div>
                  <Badge className={`flex items-center gap-1 px-2 py-1 text-xs ${getStatusColor(plot.status)}`}>
                    {getStatusIcon(plot.status)}
                    {formatStatus(plot.status)}
                  </Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wide">
                      <span>Yield potential</span>
                      <span className="font-semibold text-foreground text-sm">{plot.yield}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted/60">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: `${plot.yield}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wide">
                    <span>Area</span>
                    <span className="font-semibold text-foreground text-sm">{plot.area} acres</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wide">
                      <span>Soil health</span>
                      <span className="font-semibold text-foreground text-sm">{plot.soil}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted/60">
                      <div className="h-full rounded-full bg-success/70" style={{ width: `${plot.soil}%` }} />
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full justify-between text-xs"
                  onClick={() => setSelectedPlotId(plot.id)}
                >
                  Inspect in detail <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="advisories" className="w-full space-y-6">
        <TabsList className="mx-auto grid w-full grid-cols-3 rounded-2xl bg-muted/40 p-1">
          <TabsTrigger value="advisories" className="rounded-2xl data-[state=active]:bg-card data-[state=active]:text-foreground">Advisories</TabsTrigger>
          <TabsTrigger value="weather" className="rounded-2xl data-[state=active]:bg-card data-[state=active]:text-foreground">Weather & Soil</TabsTrigger>
          <TabsTrigger value="simulator" className="rounded-2xl data-[state=active]:bg-card data-[state=active]:text-foreground">Yield Simulator</TabsTrigger>
        </TabsList>

        <TabsContent value="advisories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="soft-card hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary" />
                  Irrigation Advisory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm font-medium mb-2">Immediate Action Required</p>
                  <p className="text-sm text-muted-foreground">
                    Plot D soil moisture at 35%. Irrigate within 24 hours to prevent yield loss.
                  </p>
                </div>
                <div className="p-3 bg-success/5 rounded-lg">
                  <p className="text-sm font-medium mb-2">Optimal Schedule</p>
                  <p className="text-sm text-muted-foreground">
                    Plots A, B, C: Next irrigation recommended in 3-4 days based on weather forecast.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="soft-card hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bug className="w-5 h-5 text-success" />
                  Pest Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-warning">
                  <p className="text-sm font-medium mb-2">High Risk Alert</p>
                  <p className="text-sm text-muted-foreground">
                    Aphid infestation risk high in eastern plots. Apply neem-based spray preventively.
                  </p>
                </div>
                <div className="p-3 bg-success/5 rounded-lg">
                  <p className="text-sm font-medium mb-2">Overall Status</p>
                  <p className="text-sm text-muted-foreground">
                    No active infestations detected. Continue monitoring.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="soft-card hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-primary" />
                  Crop Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Leaf Health Index</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-success">92%</span>
                      <Badge variant="outline" className="bg-success/20 text-success">Excellent</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Phosphorus (P)</span>
                    <Badge variant="outline" className="bg-warning/20 text-warning">Moderate</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Potassium (K)</span>
                    <Badge variant="outline" className="bg-success/20 text-success">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>pH Level</span>
                    <Badge variant="outline" className="bg-success/20 text-success">6.5 (Optimal)</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Organic Matter</span>
                    <Badge variant="outline" className="bg-warning/20 text-warning">2.8%</Badge>
                  </div>
                </div>
                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-warning">
                  <p className="text-sm">
                    <strong>Recommendation:</strong> Apply DAP fertilizer to boost phosphorus levels.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="soft-card hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-success" />
                  Seed Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Consider switching 30% of Plot D to hybrid variety <strong>GH-421</strong> for better drought tolerance and oil recovery.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="rounded-lg border border-success/30 bg-success/10 p-2">
                    <p className="font-semibold text-success">Maturity</p>
                    <p>105 days</p>
                  </div>
                  <div className="rounded-lg border border-success/30 bg-success/10 p-2">
                    <p className="font-semibold text-success">Expected lift</p>
                    <p>+8% yield</p>
                  </div>
                  <div className="rounded-lg border border-success/30 bg-success/10 p-2">
                    <p className="font-semibold text-success">Rainfall fit</p>
                    <p>450-600 mm</p>
                  </div>
                  <div className="rounded-lg border border-success/30 bg-success/10 p-2">
                    <p className="font-semibold text-success">Seed rate</p>
                    <p>35 kg/ha</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 text-success border-success/30" onClick={() => setSowingCalendarOpen(true)}>
                  View sowing calendar <ArrowRight className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="soft-card hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  Weather summary
                </CardTitle>
                <CardDescription>48-hour outlook & field readiness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground leading-relaxed">{weatherHighlights.summary}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                    <p className="text-muted-foreground uppercase tracking-wide">Temperature</p>
                    <p className="text-lg font-semibold text-primary">{weatherHighlights.temperature.max}° / {weatherHighlights.temperature.min}°</p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                    <p className="text-muted-foreground uppercase tracking-wide">Rainfall chance</p>
                    <p className="text-lg font-semibold text-primary">{weatherHighlights.rainfall}%</p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                    <p className="text-muted-foreground uppercase tracking-wide">Wind</p>
                    <p className="text-lg font-semibold text-primary">{weatherHighlights.wind}</p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                    <p className="text-muted-foreground uppercase tracking-wide">Field window</p>
                    <p className="text-lg font-semibold text-primary">Sprays after 6 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="soft-card hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThermometerSun className="w-5 h-5 text-primary" />
                  Soil snapshot
                </CardTitle>
                <CardDescription>Sensor insights from last 6 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground leading-relaxed">{soilSnapshot.summary}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-success/30 bg-success/10 p-3">
                    <p className="text-muted-foreground uppercase tracking-wide">Moisture</p>
                    <p className="text-lg font-semibold text-success">{soilSnapshot.moisture}%</p>
                  </div>
                  <div className="rounded-xl border border-success/30 bg-success/10 p-3">
                    <p className="text-muted-foreground uppercase tracking-wide">pH</p>
                    <p className="text-lg font-semibold text-success">{soilSnapshot.ph}</p>
                  </div>
                  <div className="rounded-xl border border-success/30 bg-success/10 p-3">
                    <p className="text-muted-foreground uppercase tracking-wide">Organic matter</p>
                    <p className="text-lg font-semibold text-success">{soilSnapshot.organic}%</p>
                  </div>
                  <div className="rounded-xl border border-success/30 bg-success/10 p-3">
                    <p className="text-muted-foreground uppercase tracking-wide">EC</p>
                    <p className="text-lg font-semibold text-success">{soilSnapshot.ec} dS/m</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulator" className="space-y-4">
          <Card className="soft-card hover-lift border border-primary/30">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                Yield simulation tool
              </CardTitle>
              <CardDescription>Adjust irrigation and nutrition sliders to see impact instantly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-sm font-medium text-foreground">
                    Irrigation coverage
                    <span className="text-muted-foreground">{irrigationLevel[0]}%</span>
                  </label>
                  <Slider value={irrigationLevel} onValueChange={setIrrigationLevel} max={100} step={5} />
                  <p className="text-xs text-muted-foreground">Current schedule every 5 days · optimal band 75-85%.</p>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-sm font-medium text-foreground">
                    Fertilizer readiness
                    <span className="text-muted-foreground">{fertilizerLevel[0]}%</span>
                  </label>
                  <Slider value={fertilizerLevel} onValueChange={setFertilizerLevel} max={100} step={5} />
                  <p className="text-xs text-muted-foreground">Current 150 kg/acre · target 180 kg/acre within 10 days.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border/40 bg-secondary/30 p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Current projection</p>
                  <p className="text-2xl font-semibold text-primary mt-1">{currentProjection} Q/acre</p>
                </div>
                <div className="rounded-2xl border-2 border-primary bg-primary/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Optimized projection</p>
                  <p className="text-2xl font-semibold text-primary mt-1">{optimizedProjection} Q/acre</p>
                </div>
                <div className="rounded-2xl border border-success/40 bg-success/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Potential gain</p>
                  <p className="text-2xl font-semibold text-success mt-1">+{potentialGainPercent.toFixed(1)}%</p>
                </div>
              </div>

              <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm text-muted-foreground leading-relaxed">
                <strong className="text-accent-foreground">AI insight:</strong> Adopting the optimized schedule could add <strong className="text-foreground">{potentialGain.toFixed(1)} quintals</strong> per acre (~₹{estimatedRevenueGain.toLocaleString('en-IN')}) over the season.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={timelineOpen} onOpenChange={setTimelineOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="w-5 h-5 text-primary" /> Activity timeline
            </DialogTitle>
            <DialogDescription>Recent actions and sensor triggers from the last 7 days.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {timelineEvents.map((event) => (
              <div key={event.time} className={`rounded-2xl border ${event.tone} p-4 space-y-1`}>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{event.time}</p>
                <p className="text-sm font-semibold text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{event.detail}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTimelineOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sowingCalendarOpen} onOpenChange={setSowingCalendarOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="w-5 h-5 text-primary" /> Hybrid GH-421 sowing calendar
            </DialogTitle>
            <DialogDescription>Stagger chores to keep germination uniform across all plots.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {sowingCalendar.map((entry) => (
              <div key={entry.phase} className="rounded-2xl border border-border/40 bg-muted/30 p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{entry.phase}</p>
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                    {entry.window}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{entry.guidance}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSowingCalendarOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPlot} onOpenChange={(open) => !open && setSelectedPlotId(null)}>
        <DialogContent className="max-w-3xl">
          {selectedPlot && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-primary" /> {selectedPlot.name} · Plot {selectedPlot.id}
                </DialogTitle>
                <DialogDescription>
                  Detailed health snapshot with soil, canopy and management insights.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-2 mb-4">
                {plots.map((plot) => (
                  <Button
                    key={plot.id}
                    size="sm"
                    variant={plot.id === selectedPlot.id ? 'default' : 'secondary'}
                    className={plot.id === selectedPlot.id ? 'gap-2' : 'gap-2 bg-muted/60 text-foreground hover:bg-muted'}
                    onClick={() => setSelectedPlotId(plot.id)}
                  >
                    Plot {plot.id}
                    <Badge variant="outline" className="border-border/40 text-xs">
                      {formatStatus(plot.status)}
                    </Badge>
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-background/80 border-border/40 border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Health metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Yield potential</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary">{selectedPlot.yield}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Soil health</span>
                      <Badge variant="outline" className="bg-success/10 text-success">{selectedPlot.soil}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Last irrigation</span>
                      <span className="text-muted-foreground">2 days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nutrient status</span>
                      <Badge variant="outline" className="bg-warning/10 text-warning">P low</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/80 border-border/40 border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Recommended actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>• Irrigate within the next 18 hours to lift moisture above 55%.</p>
                    <p>• Apply 20 kg/acre of DAP to correct phosphorus deficiency.</p>
                    <p>• Schedule canopy spray post forecasted showers (48 hrs).</p>
                  </CardContent>
                </Card>
              </div>
              <div className="rounded-2xl border border-border/40 bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed">
                Satellite NDVI trend indicates steady improvement week-on-week. Monitor for localized aphid hotspots on east boundary after irrigation.
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedPlotId(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={fieldChecklistOpen} onOpenChange={setFieldChecklistOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" /> 48-hour readiness checklist
            </DialogTitle>
            <DialogDescription>
              Prioritised actions compiled from soil, weather and crop health signals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {fieldChecklist.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/40 bg-muted/25 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-[11px]">
                    {item.tag}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFieldChecklistOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              handleDownloadInsights();
              setFieldChecklistOpen(false);
            }}>
              Export with insights
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YieldIntelligence;
