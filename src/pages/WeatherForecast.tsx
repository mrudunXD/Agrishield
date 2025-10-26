import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  CloudRain,
  CloudSun,
  Cloud,
  ThermometerSun,
  Droplets,
  Wind,
  Sunrise,
  Sunset,
  Radar,
  Umbrella,
  Waves,
  MapPin,
  AlertTriangle,
  CalendarDays,
  Sparkles
} from 'lucide-react';

const WeatherForecast = () => {
  const [hourlyDialogOpen, setHourlyDialogOpen] = useState(false);

  const todayStats = [
    {
      label: 'High / Low',
      value: '32°C / 22°C',
      icon: <ThermometerSun className="w-5 h-5 text-primary" />,
      helper: 'Feels like 34°C at noon'
    },
    {
      label: 'Humidity',
      value: '68%',
      icon: <Droplets className="w-5 h-5 text-primary" />,
      helper: 'Morning dew point 21°C'
    },
    {
      label: 'Wind',
      value: '12 km/h NE',
      icon: <Wind className="w-5 h-5 text-primary" />,
      helper: 'Gusts up to 18 km/h'
    },
    {
      label: 'Rain window',
      value: '40% chance',
      icon: <CloudRain className="w-5 h-5 text-primary" />,
      helper: 'Spotty showers after 5:30 PM'
    }
  ];

  const upcomingDays = [
    { day: 'Today', icon: <CloudSun className="w-6 h-6 text-primary" />, temp: '32° / 22°', rain: '40%', wind: '12 km/h' },
    { day: 'Tue', icon: <CloudRain className="w-6 h-6 text-accent" />, temp: '30° / 23°', rain: '65%', wind: '16 km/h' },
    { day: 'Wed', icon: <Cloud className="w-6 h-6 text-primary" />, temp: '29° / 21°', rain: '20%', wind: '10 km/h' },
    { day: 'Thu', icon: <CloudRain className="w-6 h-6 text-accent" />, temp: '31° / 22°', rain: '55%', wind: '14 km/h' },
    { day: 'Fri', icon: <CloudSun className="w-6 h-6 text-primary" />, temp: '33° / 23°', rain: '30%', wind: '13 km/h' },
    { day: 'Sat', icon: <CloudRain className="w-6 h-6 text-accent" />, temp: '29° / 21°', rain: '70%', wind: '22 km/h' },
    { day: 'Sun', icon: <Cloud className="w-6 h-6 text-primary" />, temp: '28° / 20°', rain: '25%', wind: '11 km/h' }
  ];

  const hourlyData = [
    { time: '06:00', temp: '22°C', rain: '10%', wind: '6 km/h' },
    { time: '09:00', temp: '26°C', rain: '15%', wind: '8 km/h' },
    { time: '12:00', temp: '30°C', rain: '25%', wind: '12 km/h' },
    { time: '15:00', temp: '32°C', rain: '35%', wind: '15 km/h' },
    { time: '18:00', temp: '28°C', rain: '45%', wind: '18 km/h' },
    { time: '21:00', temp: '25°C', rain: '40%', wind: '12 km/h' }
  ];

  const handleExportWeeklyPlan = useCallback(() => {
    const exportPayload = {
      generatedAt: new Date().toISOString(),
      location: 'Sangli Farm Cluster',
      today: todayStats.map(({ label, value, helper }) => ({ label, value, helper })),
      hourly: hourlyData,
      upcoming: upcomingDays.map(({ day, temp, rain, wind }) => ({ day, temp, rain, wind })),
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `weather-plan-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast({ title: '7-day plan exported', description: 'Weather itinerary has been downloaded to your device.' });
  }, [hourlyData, todayStats, upcomingDays]);

  return (
    <div className="space-y-10 animate-fade-in">
      <section className="rounded-3xl border border-border/50 bg-card/95 p-6 md:p-10 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-6 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="w-4 h-4" /> Forecast intelligence
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-primary">Detailed Weather Forecast</h1>
              <p className="text-muted-foreground text-base">
                Hyperlocal outlook for your farm in Sangli — updated every 15 minutes using Doppler radar, satellite and ground sensors.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={() => setHourlyDialogOpen(true)}>
                <CloudRain className="w-5 h-5" /> View hourly breakdown
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={handleExportWeeklyPlan}>
                <CalendarDays className="w-5 h-5" /> Export 7-day plan
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Sunrise</p>
                <div className="flex items-baseline gap-2 text-primary">
                  <Sunrise className="w-5 h-5" />
                  <span className="text-lg font-semibold">06:12 AM</span>
                </div>
                <p className="text-xs text-muted-foreground">Golden hour until 07:10 AM</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Sunset</p>
                <div className="flex items-baseline gap-2 text-primary">
                  <Sunset className="w-5 h-5" />
                  <span className="text-lg font-semibold">05:54 PM</span>
                </div>
                <p className="text-xs text-muted-foreground">Last light at 06:20 PM</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Rainfall (24h)</p>
                <div className="flex items-baseline gap-2 text-primary">
                  <Droplets className="w-5 h-5" />
                  <span className="text-lg font-semibold">6.4 mm</span>
                </div>
                <p className="text-xs text-muted-foreground">Peak intensity at 07:35 PM</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Spray window</p>
                <div className="flex items-baseline gap-2 text-primary">
                  <Umbrella className="w-5 h-5" />
                  <span className="text-lg font-semibold">10 AM - 3 PM</span>
                </div>
                <p className="text-xs text-muted-foreground">Wind below 15 km/h, RH under 70%</p>
              </div>
            </div>
          </div>

          <Card className="w-full lg:w-96 bg-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">Live radar snapshot</CardTitle>
              <CardDescription>Last refreshed • 2 minutes ago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6">
                <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-primary">
                  <Radar className="w-4 h-4" />
                  Doppler Layer
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-primary">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-semibold">Sangli Farm Cluster</p>
                      <p className="text-xs text-muted-foreground">Lat 17.7° N • Long 74.5° E</p>
                    </div>
                  </div>
                  <Separator className="bg-primary/20" />
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-white/70 dark:bg-primary/10 p-3">
                      <p className="text-xs text-muted-foreground">Coverage</p>
                      <p className="text-lg font-semibold text-primary">18 km</p>
                    </div>
                    <div className="rounded-xl bg-white/70 dark:bg-primary/10 p-3">
                      <p className="text-xs text-muted-foreground">Intensity</p>
                      <p className="text-lg font-semibold text-primary">Moderate</p>
                    </div>
                    <div className="rounded-xl bg-white/70 dark:bg-primary/10 p-3">
                      <p className="text-xs text-muted-foreground">Direction</p>
                      <p className="text-lg font-semibold text-primary">NE → SW</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                  <span>Next rainfall band expected around 6:00 PM. Keep tarpaulins ready for drying yards.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Waves className="w-4 h-4 text-primary mt-0.5" />
                  <span>Surface moisture will drop rapidly after 11:30 AM due to clear skies and wind.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="soft-card hover-lift lg:col-span-7">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              Today at a glance
            </CardTitle>
            <CardDescription>Key variables to plan irrigation, spraying and harvest.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {todayStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-semibold text-primary">{stat.value}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{stat.helper}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="soft-card hover-lift lg:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Risk alerts
            </CardTitle>
            <CardDescription>Threshold-based alerts generated for your farm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 space-y-2">
              <div className="flex items-center gap-3 text-warning">
                <Wind className="w-5 h-5" />
                <p className="font-medium text-sm">High winds forecast between 4-6 PM</p>
              </div>
              <p className="text-xs text-warning/80 leading-relaxed">Delay spraying operations to avoid drift. Secure greenhouse covers.</p>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-3 text-primary">
                <Droplets className="w-5 h-5" />
                <p className="font-medium text-sm">Very high humidity overnight</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Switch on circulation fans after midnight to prevent fungal buildup.</p>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 space-y-2">
              <div className="flex items-center gap-3 text-accent-foreground">
                <Umbrella className="w-5 h-5" />
                <p className="font-medium text-sm">Light showers expected on Tuesday morning</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Harvested produce should be tarped by 7 AM to avoid moisture.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="soft-card hover-lift">
        <CardHeader>
          <CardTitle className="text-lg">7-day outlook</CardTitle>
          <CardDescription>Temperature, rain probability and wind trend for the next week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
            {upcomingDays.map((day) => (
              <div key={day.day} className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-3 text-center">
                <p className="text-sm font-medium">{day.day}</p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  {day.icon}
                </div>
                <div className="text-lg font-semibold text-primary">{day.temp}</div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Droplets className="w-3 h-3" />
                  {day.rain}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Wind className="w-3 h-3" />
                  {day.wind}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="hourly" className="w-full space-y-6">
        <TabsList className="mx-auto grid w-full gap-2 rounded-2xl bg-muted/40 p-1 md:grid-cols-3">
          <TabsTrigger value="hourly" className="rounded-2xl data-[state=active]:bg-card data-[state=active]:text-foreground">
            Hourly details
          </TabsTrigger>
          <TabsTrigger value="rainfall" className="rounded-2xl data-[state=active]:bg-card data-[state=active]:text-foreground">
            Rainfall zones
          </TabsTrigger>
          <TabsTrigger value="wind" className="rounded-2xl data-[state=active]:bg-card data-[state=active]:text-foreground">
            Wind planner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hourly" className="space-y-4">
          <Card className="soft-card hover-lift">
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
              {hourlyData.map((slot) => (
                <div key={slot.time} className="rounded-2xl border border-border/40 bg-background/70 p-4 space-y-3 text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{slot.time}</p>
                  <p className="text-lg font-semibold text-primary">{slot.temp}</p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Droplets className="w-3 h-3" />
                    {slot.rain}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Wind className="w-3 h-3" />
                    {slot.wind}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rainfall" className="space-y-4">
          <Card className="soft-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radar className="w-5 h-5 text-primary" />
                Rainfall intensity map
              </CardTitle>
              <CardDescription>Estimated accumulation over the next 48 hours.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-background to-background p-6">
                <div className="flex items-center justify-between text-sm text-primary">
                  <span>Radar composite</span>
                  <span>Updated 5 mins ago</span>
                </div>
                <div className="mt-4 h-48 rounded-2xl bg-primary/10"></div>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="rounded-2xl border border-border/40 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Next 6 hours</p>
                  <p className="text-lg font-semibold text-primary mt-2">12.4 mm</p>
                  <p className="text-xs mt-2">Heaviest burst between 17:00 - 19:00 • keep drains clear.</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">24 hour outlook</p>
                  <p className="text-lg font-semibold text-primary mt-2">26.8 mm</p>
                  <p className="text-xs mt-2">Rainfall shifts westward after midnight, tapering off by dawn.</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="rounded-2xl border border-border/40 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Field impact</p>
                  <p className="text-xs mt-2">Plot D will have saturated topsoil — avoid machine entry tomorrow morning.</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Reservoir status</p>
                  <p className="text-xs mt-2">Pond levels rising — release 5% spillover to canal by 22:00 hrs.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wind" className="space-y-4">
          <Card className="soft-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-primary" />
                Wind planner
              </CardTitle>
              <CardDescription>Identify safe slots for spraying, harvesting and shed maintenance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border/40 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Calm window</p>
                  <p className="text-lg font-semibold text-primary mt-2">10:00 - 13:00</p>
                  <p className="text-xs mt-2 text-muted-foreground">Wind stays under 14 km/h • ideal for foliar spray.</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Monitor</p>
                  <p className="text-lg font-semibold text-primary mt-2">16:00 - 18:00</p>
                  <p className="text-xs mt-2 text-muted-foreground">Gusts crossing 20 km/h • postpone light plastic repairs.</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Overnight</p>
                  <p className="text-lg font-semibold text-primary mt-2">00:00 - 05:00</p>
                  <p className="text-xs mt-2 text-muted-foreground">Wind shifts northward • open vents to balance humidity.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground space-y-2">
                <p><strong className="text-primary">Expert cue:</strong> Align drip irrigation laterals today evening to the NE-SW axis to reduce flapping.</p>
                <p>Use temporary windbreak netting near nursery beds if gusts exceed 25 km/h.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={hourlyDialogOpen} onOpenChange={setHourlyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <CloudRain className="w-5 h-5 text-primary" /> Hour-by-hour weather breakdown
            </DialogTitle>
            <DialogDescription>Extended outlook for the next 18 hours. Values auto-sync with the radar layer.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hourlyData.map((slot) => (
              <div key={slot.time} className="rounded-2xl border border-border/40 bg-background/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{slot.time}</p>
                  <Badge variant="outline" className="border-primary/30 text-primary">{slot.temp}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Rain probability</span>
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> {slot.rain}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Wind</span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3" /> {slot.wind}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHourlyDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeatherForecast;
