import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Shield,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  ArrowRight,
  GaugeCircle,
  LineChart
} from 'lucide-react';

const Hedging = () => {
  const [hedgePercentage, setHedgePercentage] = useState([40]);
  const [lockPrice, setLockPrice] = useState('5150');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [strategyDialog, setStrategyDialog] = useState<{ open: boolean; title: string; steps: string[] }>({
    open: false,
    title: '',
    steps: [],
  });
  const configuratorRef = useRef<HTMLDivElement | null>(null);

  const expectedYield = 80; // quintals
  const currentPrice = 5200;
  const recommendedHedge = 42;

  const hedgedQuantity = useMemo(
    () => Number(((expectedYield * hedgePercentage[0]) / 100).toFixed(1)),
    [expectedYield, hedgePercentage]
  );

  const lockedRevenue = useMemo(() => {
    const price = Number(lockPrice) || 0;
    return Math.round(hedgedQuantity * price);
  }, [hedgedQuantity, lockPrice]);

  const hedgeConfidence = useMemo(() => {
    if (hedgePercentage[0] >= 60) return 'Very strong';
    if (hedgePercentage[0] >= 35) return 'Balanced';
    return 'Conservative';
  }, [hedgePercentage]);

  const hedgeSummaryItems = [
    {
      label: 'Hedged quantity',
      value: `${hedgedQuantity} Q`,
      helper: 'Out of expected 80 Q yield',
    },
    {
      label: 'Locked revenue',
      value: `₹${lockedRevenue.toLocaleString('en-IN')}`,
      helper: `At ₹${lockPrice}/quintal`,
    },
    {
      label: 'Protection level',
      value: hedgeConfidence,
      helper: 'Based on volatility & coverage',
    },
  ];

  const strategistNotes = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      tone: 'text-success',
      title: 'Seasonal support',
      detail: 'Wholesale bids remain firm with exports steady at western ports.',
    },
    {
      icon: <GaugeCircle className="w-4 h-4" />,
      tone: 'text-primary',
      title: 'Volatility cushion',
      detail: 'Hedge ratio keeps downside within ₹140/quintal over the next 45 days.',
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      tone: 'text-warning',
      title: 'Monitor arrivals',
      detail: 'Inflow upticks post-Diwali can soften quotes by 2-3% temporarily.',
    },
  ];

  const strategyTracks = [
    {
      title: 'Baseline hedge',
      description: 'Lock forward contracts for 40% of the harvest. Maintain agility for upside on the remaining output.',
      metrics: ['₹5,150 strike', '60-day window', '40% coverage'],
      steps: [
        'Reserve 40% of projected yield for fixed-price contracts.',
        'Align dispatch schedule with Sangli mandi receiving slots.',
        'Set reminder to review basis spread after 30 days.',
      ],
    },
    {
      title: 'Layered exposure',
      description: 'Split hedges into 30% now & 20% staggered in 3 weeks to ride favourable price spikes.',
      metrics: ['Dual tranches', 'Rebalance alerts', 'Risk 1.2%'],
      steps: [
        'Secure 30% coverage immediately at current strike.',
        'Create follow-up order for 20% coverage with trigger at ₹5,400.',
        'Activate price alerts every ₹120 change to revisit layers.',
      ],
    },
    {
      title: 'Premium hedge',
      description: 'Upgrade with insurance add-on for natural calamity cover on unhedged balance.',
      metrics: ['₹120 add-on', 'Weather cover', 'Claim in <7 days'],
      steps: [
        'Sign up for weather insurance rider covering remaining output.',
        'Share warehouse documents to enable expedited claim processing.',
        'Schedule quarterly review with risk advisor for coverage calibration.',
      ],
    },
  ];

  const handleCreateHedge = () => {
    setConfirmOpen(true);
  };

  const handleConfirmHedge = () => {
    setConfirmOpen(false);
    toast({
      title: "Virtual hedge created",
      description: `${hedgePercentage[0]}% of yield secured at ₹${lockPrice}/quintal`,
    });
  };

  const handleScrollToConfigurator = useCallback(() => {
    configuratorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleDownloadStrategy = useCallback(() => {
    const deck = {
      generatedAt: new Date().toISOString(),
      recommendedHedge,
      coverage: hedgePercentage[0],
      lockPrice,
      strategistNotes: strategistNotes.map((note) => ({
        title: note.title,
        detail: note.detail,
        tone: note.tone,
      })),
      strategyTracks,
      scenario:
        hedgePercentage[0] >= recommendedHedge
          ? 'Coverage ahead of desk guidance – monitor for upside releases.'
          : 'Coverage below suggested range – consider layering another tranche.',
    };

    const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hedging-strategy-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast({ title: 'Strategy deck exported', description: 'Download complete. Share it with your partners.' });
  }, [hedgePercentage, lockPrice, recommendedHedge, strategistNotes, strategyTracks]);

  return (
    <div className="space-y-10 animate-fade-in">
      <section className="rounded-3xl border border-border/50 bg-card/95 p-6 md:p-10 shadow-lg">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
          <div className="space-y-6 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="w-4 h-4" /> Hedging intelligence
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-primary">Smart Hedging Hub</h1>
              <p className="text-muted-foreground text-base">
                Design hedge layers that protect cashflows without locking away upside. Sakhi blends futures, fundamentals and weather to keep your exposure agile.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={handleScrollToConfigurator}>
                <Shield className="w-5 h-5" /> Create hedge plan
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={handleDownloadStrategy}>
                <FileText className="w-5 h-5" /> Download strategy deck
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Current prices</p>
                <p className="text-lg font-semibold text-primary">₹{currentPrice.toLocaleString('en-IN')}/Q</p>
                <p className="text-xs text-muted-foreground">Sangli spot • updated 12 mins ago</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Model hedge</p>
                <p className="text-lg font-semibold text-primary">{recommendedHedge}% coverage</p>
                <p className="text-xs text-muted-foreground">Balances price risk & storage</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Confidence</p>
                <p className="text-lg font-semibold text-primary">77%</p>
                <p className="text-xs text-muted-foreground">Recalibrates every 6 hours</p>
              </div>
            </div>
          </div>

          <Card className="w-full xl:w-96 bg-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">Strategist note</CardTitle>
              <CardDescription>Inputs from commodities desk · 24 Oct 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {strategistNotes.map((note) => (
                <div key={note.title} className="rounded-2xl border border-border/40 bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className={`${note.tone}`}>{note.icon}</span>
                    {note.title}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{note.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div ref={configuratorRef}>
          <Card className="soft-card hover-lift xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Configure hedge contract
              </CardTitle>
              <CardDescription>Adjust coverage to align with yield, cashflow and storage plans.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <Label className="text-sm text-foreground font-medium">Hedge coverage</Label>
                  <span>{hedgePercentage[0]}%</span>
                </div>
                <Slider value={hedgePercentage} onValueChange={setHedgePercentage} max={100} step={5} className="mt-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  Each 5% shift equals {((expectedYield * 0.05)).toFixed(1)} quintals. Coverage recalculates risk instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Lock price (₹/quintal)</Label>
                  <Input value={lockPrice} onChange={(e) => setLockPrice(e.target.value.replace(/[^0-9]/g, ''))} className="focus-visible:ring-primary/40" />
                  <p className="text-xs text-muted-foreground">AI suggests ₹5,120 – ₹5,240 band for current volatility.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Delivery window</Label>
                  <Input value="60 days" disabled className="bg-muted/40" />
                  <p className="text-xs text-muted-foreground">Flexi-schedule available with premium package.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hedgeSummaryItems.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-semibold text-primary">{item.value}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.helper}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Scenario impact</p>
                  <p className="text-xs mt-1">If spot prices dip below ₹4,900, hedge cushions ₹{(hedgedQuantity * (Number(lockPrice) - 4900)).toLocaleString('en-IN')}.</p>
                </div>
                <Badge variant="outline" className="border-primary/40 text-primary bg-background/80">Protected down to ₹4,880</Badge>
              </div>

              <Button onClick={handleCreateHedge} size="lg" className="gap-2 w-full md:w-auto">
                <Shield className="w-4 h-4" />
                Create hedge contract
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="soft-card hover-lift border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                AI hedge cue
              </CardTitle>
              <CardDescription>Updated every 30 minutes • based on futures, arrivals & weather</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-border/40 bg-background/70 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Recommended coverage</p>
                <p className="text-4xl font-bold text-primary mt-2">{recommendedHedge}%</p>
                <p className="text-xs text-muted-foreground mt-1">Keep 35-45% hedged for optimal risk balance.</p>
              </div>
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Intense demand from processors keeps basis strong.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Futures curve stays in mild contango — favourable for carry hedges.</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                  <span>Volatility index at 18.5 — keep alert for macro shocks.</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <LineChart className="w-4 h-4" /> View basis outlook
              </Button>
            </CardContent>
          </Card>

          <Card className="soft-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Risk vs stability
              </CardTitle>
              <CardDescription>Smoothly rebalance hedge coverage as markets evolve.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-xs uppercase tracking-wide text-muted-foreground">
                <span>Price risk</span>
                <span>{100 - hedgePercentage[0]}%</span>
              </div>
              <div className="h-2 rounded-full bg-destructive/20 overflow-hidden">
                <div className="h-full bg-destructive" style={{ width: `${100 - hedgePercentage[0]}%` }} />
              </div>
              <div className="flex justify-between text-xs uppercase tracking-wide text-muted-foreground">
                <span>Income stability</span>
                <span>{hedgePercentage[0]}%</span>
              </div>
              <div className="h-2 rounded-full bg-success/20 overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${hedgePercentage[0]}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">Drift alerts trigger when hedge ratio moves ±10% from the optimal band.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="soft-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            Strategy tracks
          </CardTitle>
          <CardDescription>Pick a playbook tailored to your cashflow, storage and risk appetite.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategyTracks.map((track) => (
            <div key={track.title} className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">{track.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{track.description}</p>
              <div className="flex flex-wrap gap-2">
                {track.metrics.map((metric) => (
                  <Badge key={metric} variant="outline" className="border-primary/30 text-primary text-[11px]">
                    {metric}
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-primary hover:text-primary"
                onClick={() =>
                  setStrategyDialog({ open: true, title: track.title, steps: track.steps })
                }
              >
                View steps <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" /> Confirm hedge summary
            </DialogTitle>
            <DialogDescription>
              Review the contract snapshot before locking the hedge.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 text-sm">
            <div className="rounded-2xl border border-border/40 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Coverage</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{hedgePercentage[0]}% ({hedgedQuantity} Q)</p>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-xs uppercase tracking-wide text-primary/80">Lock price</p>
              <p className="mt-1 text-lg font-semibold text-primary">₹{Number(lockPrice || 0).toLocaleString('en-IN')}/quintal</p>
            </div>
            <div className="rounded-2xl border border-success/40 bg-success/10 p-4">
              <p className="text-xs uppercase tracking-wide text-success/80">Projected revenue</p>
              <p className="mt-1 text-lg font-semibold text-success">₹{lockedRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 text-xs text-muted-foreground leading-relaxed">
              This summary has been saved in your analytics feed. Confirm to notify the hedging desk and trigger monitoring alerts.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmHedge} className="gap-2">
              <CheckCircle className="w-4 h-4" /> Confirm hedge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={strategyDialog.open} onOpenChange={(open) => setStrategyDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" /> {strategyDialog.title}
            </DialogTitle>
            <DialogDescription>Breakdown of the recommended play steps.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            {strategyDialog.steps.map((step, index) => (
              <div key={`${strategyDialog.title}-${index}`} className="rounded-2xl border border-border/40 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Step {index + 1}</p>
                <p className="mt-1 text-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStrategyDialog((prev) => ({ ...prev, open: false }))}>Close</Button>
            <Button onClick={() => {
              toast({
                title: 'Added to playbook',
                description: `${strategyDialog.title} steps pinned to your strategy deck.`,
              });
              setStrategyDialog((prev) => ({ ...prev, open: false }));
            }}>
              Save to playbook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hedging;
