import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Mail, Phone, Clock, MapPin, Sparkles } from "lucide-react";

const quickContacts = [
  {
    title: "Priority helpline",
    detail: "+91 8001 234 567",
    helper: "Daily 6:00 AM – 10:00 PM",
    icon: Phone,
  },
  {
    title: "Email support",
    detail: "support@agrishield.in",
    helper: "Replies within 6 working hours",
    icon: Mail,
  },
  {
    title: "Field advisor",
    detail: "Kalaburagi cluster",
    helper: "Madhav · +91 8888 654 321",
    icon: MapPin,
  },
];

const SupportContact: React.FC = () => {
  const [name, setName] = useState("Rajesh Kumar");
  const [topic, setTopic] = useState("Hedging guidance");
  const [message, setMessage] = useState("I want to optimise my hedge ratio before next week's mandi arrivals.");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Support request logged",
        description: "Our agronomy desk will reach out in under 6 working hours.",
      });
    }, 600);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <section className="rounded-3xl border border-border/50 bg-card/95 p-6 md:p-10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
              <Sparkles className="h-4 w-4" /> Support centre
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Contact support</h1>
              <p className="text-muted-foreground">
                Log operational issues, get agronomy input, or request hedging assistance. Share details and we will assign the right specialist instantly.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Average response · 2h 40m</Badge>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">24×7 helpline</Badge>
            </div>
          </div>
          <Card className="w-full md:w-80 bg-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">Quick contacts</CardTitle>
              <CardDescription>Prefer speaking directly? Use these channels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {quickContacts.map((contact) => (
                <div key={contact.title} className="rounded-2xl border border-border/40 bg-background/80 p-3">
                  <div className="flex items-start gap-3">
                    <contact.icon className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{contact.title}</p>
                      <p className="text-sm text-primary">{contact.detail}</p>
                      <p className="text-xs text-muted-foreground">{contact.helper}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="soft-card hover-lift lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-primary" /> Submit a ticket
            </CardTitle>
            <CardDescription>Tell us what you need help with and we will respond shortly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input id="topic" value={topic} onChange={(event) => setTopic(event.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">How can we help?</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="resize-none"
                  required
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={submitting} className="gap-2">
                  Submit request
                </Button>
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Average acknowledgement time · under 5 minutes
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="soft-card hover-lift">
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
            <CardDescription>We keep you updated every step.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm font-medium text-primary">1 · Assign specialist</p>
              <p className="text-xs mt-1">Based on crop, geography and issue, a subject expert is tagged within minutes.</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-muted/20 p-4">
              <p className="text-sm font-medium text-foreground">2 · Get a call back</p>
              <p className="text-xs mt-1">Expect a phone call or WhatsApp update with actionables and documentation.</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-muted/20 p-4">
              <p className="text-sm font-medium text-foreground">3 · Resolution summary</p>
              <p className="text-xs mt-1">We log next steps, share reference resources, and close the ticket only after you confirm.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportContact;
