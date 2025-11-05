import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  FileText,
  Calendar,
  PiggyBank,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  GaugeCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

type ContractRecord = {
  id: string;
  crop: string;
  quantity: string;
  lockedPrice: string;
  currentPrice: string;
  status: 'active' | 'completed' | 'pending' | string;
  deliveryDate: string;
  buyer: string;
  savings: string;
};

const Contracts: React.FC = () => {
  const contracts = useMemo<ContractRecord[]>(() => ([
    {
      id: "HC-2024-001",
      crop: "Mustard",
      quantity: "2.5 tons",
      lockedPrice: "₹6,500/quintal",
      currentPrice: "₹6,200/quintal",
      status: "active",
      deliveryDate: "2024-03-15",
      buyer: "Sunrise Oils FPO",
      savings: "₹7,500"
    },
    {
      id: "HC-2024-002",
      crop: "Sunflower",
      quantity: "1.8 tons",
      lockedPrice: "₹5,800/quintal",
      currentPrice: "₹6,100/quintal",
      status: "completed",
      deliveryDate: "2024-02-20",
      buyer: "GreenFields Cooperative",
      savings: "-₹5,400"
    },
    {
      id: "HC-2024-003",
      crop: "Soybean",
      quantity: "3.0 tons",
      lockedPrice: "₹4,200/quintal",
      currentPrice: "₹4,000/quintal",
      status: "pending",
      deliveryDate: "2024-04-10",
      buyer: "AgriTrade Solutions",
      savings: "₹6,000"
    }
  ]), []);

  const summaryHighlights = useMemo(() => ([
    {
      label: 'Total contracts',
      value: '12',
      delta: '+2 this month',
      tone: 'from-primary/20 via-primary/5 to-background',
      accent: 'bg-primary/10 text-primary'
    },
    {
      label: 'Active hedges',
      value: '4',
      delta: 'Awaiting delivery',
      tone: 'from-blue-400/20 via-blue-400/10 to-background',
      accent: 'bg-blue-500/10 text-blue-600'
    },
    {
      label: 'Completed',
      value: '7',
      delta: 'Settled on time',
      tone: 'from-emerald-400/20 via-emerald-400/10 to-background',
      accent: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      label: 'Savings this season',
      value: '₹45,200',
      delta: 'Locked above spot',
      tone: 'from-amber-300/20 via-amber-300/10 to-background',
      accent: 'bg-amber-500/10 text-amber-600'
    }
  ]), []);

  const [newContractOpen, setNewContractOpen] = useState(false);
  const [activeContract, setActiveContract] = useState<ContractRecord | null>(null);
  const [newContractForm, setNewContractForm] = useState({
    crop: 'Groundnut',
    quantity: '2.0 tons',
    buyer: '',
    lockedPrice: '₹5,450/quintal',
    deliveryDate: '',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/15 text-primary';
      case 'completed': return 'bg-success/15 text-success';
      case 'pending': return 'bg-warning/15 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock3 className="w-4 h-4" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock3 className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const parseQuantity = useCallback((value: string) => {
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  }, []);

  const parsePrice = useCallback((value: string) => {
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  }, []);

  const analytics = useMemo(() => {
    if (!contracts.length) {
      return {
        totalQuantity: 0,
        hedgedValue: 0,
        avgLocked: 0,
        avgSpot: 0,
        totalSavings: 0,
        activeRatio: 0,
        upcoming: [] as ContractRecord[],
      };
    }

    const totals = contracts.reduce(
      (acc, contract) => {
        const quantity = parseQuantity(contract.quantity);
        const locked = parsePrice(contract.lockedPrice);
        const current = parsePrice(contract.currentPrice);
        const savings = parseFloat(contract.savings.replace(/[^-0-9.]/g, '')) || 0;

        acc.totalQuantity += quantity;
        acc.hedgedValue += quantity * locked;
        acc.totalLocked += locked;
        acc.totalSpot += current;
        acc.totalSavings += savings;
        acc.count += 1;
        if (contract.status === 'active') acc.active += 1;
        acc.deliveries.push(contract);
        return acc;
      },
      {
        totalQuantity: 0,
        hedgedValue: 0,
        totalLocked: 0,
        totalSpot: 0,
        totalSavings: 0,
        active: 0,
        count: 0,
        deliveries: [] as ContractRecord[],
      }
    );

    const upcoming = totals.deliveries
      .filter((item) => new Date(item.deliveryDate).getTime() >= Date.now())
      .sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime())
      .slice(0, 3);

    return {
      totalQuantity: totals.totalQuantity,
      hedgedValue: totals.hedgedValue,
      avgLocked: totals.totalLocked / totals.count,
      avgSpot: totals.totalSpot / totals.count,
      totalSavings: totals.totalSavings,
      activeRatio: totals.count ? totals.active / totals.count : 0,
      upcoming,
    };
  }, [contracts, parsePrice, parseQuantity]);

  const hedgeBreakeven = useMemo(() => {
    const delta = analytics.avgLocked - analytics.avgSpot;
    return {
      delta,
      message:
        delta >= 0
          ? 'Locked prices remain above current spot — coverage is yielding gains.'
          : 'Spot has overtaken the locked strike. Review tranches to trim carry costs.',
    };
  }, [analytics.avgLocked, analytics.avgSpot]);

  const handleExportReport = useCallback(() => {
    const payload = {
      generatedAt: new Date().toISOString(),
      summary: summaryHighlights,
      contracts,
      analytics,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hedging-report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast({ title: 'Hedging report exported', description: 'Contract portfolio snapshot downloaded as JSON.' });
  }, [contracts, summaryHighlights]);

  const handleDownloadContract = useCallback((contract: ContractRecord) => {
    const payload = {
      ...contract,
      downloadedAt: new Date().toISOString(),
      spotDelta: contract.savings,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contract.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast({ title: 'Contract downloaded', description: `${contract.crop} contract saved to your device.` });
  }, []);

  const handleNewContractChange = useCallback(<K extends keyof typeof newContractForm>(field: K, value: typeof newContractForm[K]) => {
    setNewContractForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmitNewContract = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Contract request sent',
      description: `${newContractForm.crop} coverage request queued for desk review.`,
    });
    setNewContractForm({ crop: 'Groundnut', quantity: '2.0 tons', buyer: '', lockedPrice: '₹5,450/quintal', deliveryDate: '', notes: '' });
    setNewContractOpen(false);
  }, [newContractForm]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Hedging desk</span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">My contracts</h1>
          <p className="text-muted-foreground max-w-2xl">
            Monitor every forward sale, compare with current market prices, and act ahead of settlement windows.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExportReport}>
            <PiggyBank className="w-4 h-4" />
            Export hedging report
          </Button>
          <Button className="gap-2" onClick={() => setNewContractOpen(true)}>
            <FileText className="w-4 h-4" />
            New contract
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="border-border/40 bg-card/95 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <GaugeCircle className="w-4 h-4 text-primary" /> Coverage health
            </CardTitle>
            <CardDescription>Portfolio averages based on current contracts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3">
              <span className="text-muted-foreground">Hedged volume</span>
              <strong className="text-primary">{analytics.totalQuantity.toFixed(2)} tons</strong>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border/40 bg-muted/20 p-3 space-y-1">
                <p className="uppercase tracking-wide text-muted-foreground">Avg locked</p>
                <p className="text-sm font-semibold text-foreground">₹{analytics.avgLocked.toFixed(0)}/Q</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-muted/20 p-3 space-y-1">
                <p className="uppercase tracking-wide text-muted-foreground">Avg spot</p>
                <p className="text-sm font-semibold text-foreground">₹{analytics.avgSpot.toFixed(0)}/Q</p>
              </div>
            </div>
            <div className="rounded-xl border border-success/40 bg-success/10 p-3">
              <p className="text-xs uppercase tracking-wide text-success/80">Cumulative savings</p>
              <p className="text-sm font-semibold text-success">₹{analytics.totalSavings.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/95 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="w-4 h-4 text-primary" /> Risk monitor
            </CardTitle>
            <CardDescription>Active hedges vs exposure by contract count.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-2xl border border-border/40 bg-muted/20 p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                <span>Active coverage</span>
                <span>{Math.round(analytics.activeRatio * 100)}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, Math.round(analytics.activeRatio * 100))}%` }}
                />
              </div>
            </div>
            <div className={`rounded-2xl border ${hedgeBreakeven.delta >= 0 ? 'border-success/40 bg-success/10' : 'border-destructive/40 bg-destructive/10'} p-4 text-xs leading-relaxed`}>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingUp className="w-4 h-4 text-primary" /> Breakeven watch
              </p>
              <p className="mt-2 text-muted-foreground">{hedgeBreakeven.message}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/95 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-primary" /> Upcoming deliveries
            </CardTitle>
            <CardDescription>Stay ahead of logistics for the next 3 fulfilments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {analytics.upcoming.length === 0 ? (
              <p className="text-muted-foreground text-xs">No scheduled deliveries. Plan your next tranche from the hedging hub.</p>
            ) : (
              analytics.upcoming.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border/40 bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                    <span>{item.crop}</span>
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[10px]">
                      {new Date(item.deliveryDate).toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{item.quantity}</p>
                  <p className="text-xs text-muted-foreground">Buyer · {item.buyer}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryHighlights.map((summary) => (
          <Card key={summary.label} className={`relative overflow-hidden border-none bg-gradient-to-br ${summary.tone} shadow-md`}>
            <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3),transparent_55%)]" />
            <CardContent className="relative space-y-3 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{summary.label}</p>
                <div className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${summary.accent}`}>
                  {summary.delta}
                </div>
              </div>
              <p className="text-3xl font-semibold text-foreground">{summary.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {contracts.map((contract) => {
          const numericSavings = parseFloat(contract.savings.replace(/[₹,]/g, ''));
          const positive = numericSavings >= 0;
          const savingsTone = positive ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10';

          return (
            <Card key={contract.id} className="border-border/40 bg-card/95 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl font-semibold text-foreground">{contract.crop}</CardTitle>
                      <Badge className={`${getStatusColor(contract.status)} px-3 py-1 text-xs capitalize`}> 
                        <span className="flex items-center gap-1">
                          {getStatusIcon(contract.status)}
                          {contract.status}
                        </span>
                      </Badge>
                    </div>
                    <CardDescription className="text-xs uppercase tracking-wide">Contract ID · {contract.id}</CardDescription>
                  </div>
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${savingsTone}`}>
                    {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {contract.savings}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div className="rounded-xl border border-border/40 bg-muted/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Quantity</p>
                    <p className="mt-1 font-semibold text-foreground">{contract.quantity}</p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
                    <p className="text-xs uppercase tracking-wide text-primary/70">Locked price</p>
                    <p className="mt-1 font-semibold text-primary">{contract.lockedPrice}</p>
                  </div>
                  <div className="rounded-xl border border-muted/40 bg-muted/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Current price</p>
                    <p className="mt-1 font-semibold text-foreground">{contract.currentPrice}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-muted/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Delivery window</p>
                    <p className="mt-1 font-semibold flex items-center gap-2 text-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(contract.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4">
                  <div className="text-sm text-muted-foreground">
                    Buyer · <span className="font-medium text-foreground">{contract.buyer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleDownloadContract(contract)}
                    >
                      Download record
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setActiveContract(contract)}
                    >
                      View details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={newContractOpen} onOpenChange={setNewContractOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" /> Raise new hedge contract
            </DialogTitle>
            <DialogDescription>
              Share deal preferences. Our commodities desk will confirm lots and pricing within two working hours.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmitNewContract}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="contract-crop">Crop</Label>
                <Input
                  id="contract-crop"
                  value={newContractForm.crop}
                  onChange={(event) => handleNewContractChange('crop', event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-quantity">Quantity</Label>
                <Input
                  id="contract-quantity"
                  value={newContractForm.quantity}
                  onChange={(event) => handleNewContractChange('quantity', event.target.value)}
                  placeholder="e.g. 2.5 tons"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-price">Target locked price</Label>
                <Input
                  id="contract-price"
                  value={newContractForm.lockedPrice}
                  onChange={(event) => handleNewContractChange('lockedPrice', event.target.value)}
                  placeholder="₹5,500/quintal"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-delivery">Preferred delivery date</Label>
                <Input
                  id="contract-delivery"
                  type="date"
                  value={newContractForm.deliveryDate}
                  onChange={(event) => handleNewContractChange('deliveryDate', event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract-buyer">Buyer or processor</Label>
              <Input
                id="contract-buyer"
                value={newContractForm.buyer}
                onChange={(event) => handleNewContractChange('buyer', event.target.value)}
                placeholder="Sunrise Oils FPO"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract-notes">Notes for hedging desk</Label>
              <Textarea
                id="contract-notes"
                value={newContractForm.notes}
                onChange={(event) => handleNewContractChange('notes', event.target.value)}
                placeholder="Share storage constraints, logistics needs, or MSP considerations."
                rows={3}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setNewContractOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Submit request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!activeContract} onOpenChange={(open) => !open && setActiveContract(null)}>
        <DialogContent className="max-w-2xl">
          {activeContract && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Badge className={`${getStatusColor(activeContract.status)} px-3 py-1 text-xs capitalize`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(activeContract.status)}
                      {activeContract.status}
                    </span>
                  </Badge>
                  {activeContract.crop} · {activeContract.id}
                </DialogTitle>
                <DialogDescription>
                  Forward contract snapshot with pricing, counterparties and timeline insights.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border/40 bg-muted/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Contract basics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium text-foreground">Quantity:</span> {activeContract.quantity}</p>
                    <p><span className="font-medium text-foreground">Locked price:</span> {activeContract.lockedPrice}</p>
                    <p><span className="font-medium text-foreground">Current spot:</span> {activeContract.currentPrice}</p>
                    <p><span className="font-medium text-foreground">Buyer:</span> {activeContract.buyer}</p>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-muted/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Delivery & savings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium text-foreground">Delivery window:</span> {new Date(activeContract.deliveryDate).toLocaleDateString()}</p>
                    <p><span className="font-medium text-foreground">Savings vs spot:</span> {activeContract.savings}</p>
                    <p className="leading-relaxed">Desk guidance: keep transporter on provisional hold 10 days before dispatch to preserve basis gains.</p>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter className="justify-between">
                <Button variant="ghost" className="gap-2" onClick={() => handleDownloadContract(activeContract)}>
                  <FileText className="w-4 h-4" /> Download summary
                </Button>
                <Button variant="outline" onClick={() => setActiveContract(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;
