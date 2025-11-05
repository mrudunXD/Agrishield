import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileDocument, SupportRequest, defaultProfileDocument } from "@shared/profile";
import { MapPin, Phone, Mail, Edit, Save, Sprout, Droplets, Leaf, FileText, Wallet, HelpCircle, Loader2, Clock3, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 10)}`;

const maskIdentifier = (value: string) =>
  value.length > 4 ? `•••• ${value.slice(-4)}` : value;

const createDocumentForm = () => ({
  documentType: "Aadhar",
  documentNumber: "",
  notes: "",
});

const createSupportForm = () => ({
  topic: "",
  message: "",
});

const createFarmForm = () => ({
  name: "",
  area: "",
  crop: "",
  soilType: "",
  irrigationType: "",
});

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(() => ({ ...defaultProfileDocument.profile }));
  const [focusAreas, setFocusAreas] = useState<string[]>(() => [...defaultProfileDocument.focusAreas]);
  const [focusDraft, setFocusDraft] = useState("");
  const [farms, setFarms] = useState(() => [...defaultProfileDocument.farms]);
  const [documents, setDocuments] = useState(() => [...defaultProfileDocument.documents]);
  const [bankAccount, setBankAccount] = useState(() => defaultProfileDocument.bankAccount ?? null);
  const [supportRequests, setSupportRequests] = useState(() => [...defaultProfileDocument.supportRequests]);
  const [lastUpdated, setLastUpdated] = useState(() => defaultProfileDocument.lastUpdated ?? new Date().toISOString());

  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [farmDialogOpen, setFarmDialogOpen] = useState(false);

  const [documentForm, setDocumentForm] = useState(() => createDocumentForm());

  const [bankForm, setBankForm] = useState(() => ({
    accountName: bankAccount?.accountName ?? defaultProfileDocument.profile.name,
    accountNumber: bankAccount?.accountNumber ?? "",
    ifsc: bankAccount?.ifsc ?? "",
    branch: bankAccount?.branch ?? "",
    upi: bankAccount?.upi ?? "",
  }));

  const [supportForm, setSupportForm] = useState(() => createSupportForm());

  const [farmForm, setFarmForm] = useState(() => createFarmForm());

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: profileData,
    isLoading: profileLoading,
    isFetching: profileFetching,
  } = useQuery<ProfileDocument>({ queryKey: ["/api/profile"] });

  useEffect(() => {
    if (!profileData) return;

    if (!isEditing) {
      setProfile(profileData.profile);
    }

    setFocusAreas([...profileData.focusAreas]);
    setFarms([...profileData.farms]);
    setDocuments([...(profileData.documents ?? [])]);
    setBankAccount(profileData.bankAccount ?? null);
    setSupportRequests([...(profileData.supportRequests ?? [])]);
    setLastUpdated(profileData.lastUpdated ?? new Date().toISOString());

    if (!bankDialogOpen) {
      setBankForm({
        accountName: profileData.bankAccount?.accountName ?? profileData.profile.name,
        accountNumber: profileData.bankAccount?.accountNumber ?? "",
        ifsc: profileData.bankAccount?.ifsc ?? "",
        branch: profileData.bankAccount?.branch ?? "",
        upi: profileData.bankAccount?.upi ?? "",
      });
    }
  }, [profileData, isEditing, bankDialogOpen]);

  useEffect(() => {
    if (!user || isEditing) return;

    setProfile((prev) => {
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
      const nextName = fullName || prev.name;
      if (prev.name === nextName && prev.email === user.email) {
        return prev;
      }
      return {
        ...prev,
        name: nextName,
        email: user.email,
      };
    });
  }, [user, isEditing]);

  const assembleProfilePayload = useCallback(
    (overrides?: Partial<ProfileDocument>): ProfileDocument => ({
      profile,
      focusAreas,
      farms,
      documents,
      bankAccount,
      supportRequests,
      lastUpdated: new Date().toISOString(),
      ...overrides,
    }),
    [profile, focusAreas, farms, documents, bankAccount, supportRequests]
  );

  const saveProfileMutation = useMutation<ProfileDocument, Error, ProfileDocument>({
    mutationFn: (payload) =>
      apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/profile"], data);

      if (!isEditing) {
        setProfile(data.profile);
      }

      setFocusAreas([...data.focusAreas]);
      setFarms([...data.farms]);
      setDocuments([...(data.documents ?? [])]);
      setBankAccount(data.bankAccount ?? null);
      setSupportRequests([...(data.supportRequests ?? [])]);
      setLastUpdated(data.lastUpdated ?? new Date().toISOString());

      if (!bankDialogOpen) {
        setBankForm({
          accountName: data.bankAccount?.accountName ?? data.profile.name,
          accountNumber: data.bankAccount?.accountNumber ?? "",
          ifsc: data.bankAccount?.ifsc ?? "",
          branch: data.bankAccount?.branch ?? "",
          upi: data.bankAccount?.upi ?? "",
        });
      }
    },
  });

  const persistProfileDocument = useCallback(
    async (overrides?: Partial<ProfileDocument>) => {
      const payload = assembleProfilePayload(overrides);
      return saveProfileMutation.mutateAsync(payload);
    },
    [assembleProfilePayload, saveProfileMutation]
  );

  const mutationErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Something went wrong while saving. Please try again.';

  const handleAddFocusArea = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = focusDraft.trim();
    if (!trimmed) {
      toast({
        title: 'Enter a focus area',
        description: 'Add a short label to track your strategic priorities.',
        variant: 'destructive',
      });
      return;
    }

    const exists = focusAreas.some((area) => area.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      toast({
        title: 'Already added',
        description: 'This focus area is already on your list.',
      });
      return;
    }

    const previousAreas = focusAreas;
    const nextAreas = [...focusAreas, trimmed];
    setFocusAreas(nextAreas);

    try {
      await persistProfileDocument({ focusAreas: nextAreas });
      toast({
        title: 'Focus area added',
        description: 'We will prioritise recommendations around this theme.',
      });
      setFocusDraft("");
    } catch (error) {
      setFocusAreas(previousAreas);
      toast({
        title: 'Could not add focus area',
        description: mutationErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleRemoveFocusArea = async (label: string) => {
    const previousAreas = focusAreas;
    const nextAreas = focusAreas.filter((area) => area !== label);
    setFocusAreas(nextAreas);

    try {
      await persistProfileDocument({ focusAreas: nextAreas });
      toast({
        title: 'Focus area removed',
        description: `${label} will no longer influence recommendations.`,
      });
    } catch (error) {
      setFocusAreas(previousAreas);
      toast({
        title: 'Could not remove focus area',
        description: mutationErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleDocumentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNumber = documentForm.documentNumber.trim();
    if (!trimmedNumber) {
      toast({
        title: 'Document number required',
        description: 'Please provide the document reference before saving.',
        variant: 'destructive',
      });
      return;
    }

    const previousDocuments = documents;
    const newDocument = {
      id: generateId(),
      type: documentForm.documentType.trim() || 'Document',
      number: trimmedNumber,
      notes: documentForm.notes?.trim() || undefined,
      uploadedAt: new Date().toISOString(),
    } satisfies ProfileDocument['documents'][number];

    const nextDocuments = [...documents, newDocument];
    setDocuments(nextDocuments);

    try {
      await persistProfileDocument({ documents: nextDocuments });
      toast({
        title: 'Document saved',
        description: `${newDocument.type} stored with reference ${maskIdentifier(newDocument.number)}.`,
      });
      setDocumentDialogOpen(false);
      setDocumentForm(createDocumentForm());
    } catch (error) {
      setDocuments(previousDocuments);
      toast({
        title: 'Could not save document',
        description: mutationErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleBankSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedAccount = bankForm.accountNumber.trim();
    const trimmedIfsc = bankForm.ifsc.trim();

    if (!trimmedAccount || !trimmedIfsc) {
      toast({
        title: 'Bank details incomplete',
        description: 'Please provide both account number and IFSC to link your bank.',
        variant: 'destructive',
      });
      return;
    }

    const previousAccount = bankAccount;
    const nextAccount = {
      accountName: bankForm.accountName.trim() || profile.name,
      accountNumber: trimmedAccount,
      ifsc: trimmedIfsc.toUpperCase(),
      branch: bankForm.branch.trim() || undefined,
      upi: bankForm.upi.trim() || undefined,
      linkedAt: new Date().toISOString(),
    } satisfies NonNullable<ProfileDocument['bankAccount']>;

    setBankAccount(nextAccount);

    try {
      await persistProfileDocument({ bankAccount: nextAccount });
      toast({
        title: 'Bank account linked',
        description: `${nextAccount.accountName}'s account ${maskIdentifier(nextAccount.accountNumber)} is ready for payouts.`,
      });
      setBankDialogOpen(false);
    } catch (error) {
      setBankAccount(previousAccount);
      toast({
        title: 'Could not link bank account',
        description: mutationErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleSupportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTopic = supportForm.topic.trim();
    const trimmedMessage = supportForm.message.trim();

    if (!trimmedTopic || !trimmedMessage) {
      toast({
        title: 'Tell us more about your request',
        description: 'Please provide both a topic and message so our team can help quickly.',
        variant: 'destructive',
      });
      return;
    }

    const newRequest = {
      id: generateId(),
      topic: trimmedTopic,
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
      status: 'open' as const,
    } satisfies ProfileDocument['supportRequests'][number];

    const previousRequests = supportRequests;
    const nextRequests = [newRequest, ...supportRequests];
    setSupportRequests(nextRequests);

    try {
      await persistProfileDocument({ supportRequests: nextRequests });
      toast({
        title: 'Support request submitted',
        description: 'Our relationship manager will reach out within the next 2 working hours.',
      });
      setSupportDialogOpen(false);
      setSupportForm(createSupportForm());
    } catch (error) {
      setSupportRequests(previousRequests);
      toast({
        title: 'Could not submit request',
        description: mutationErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleFarmSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const areaValue = parseFloat(farmForm.area);
    if (Number.isNaN(areaValue) || areaValue <= 0) {
      toast({
        title: 'Enter a valid acreage',
        description: 'Please provide the farm size in acres before saving.',
        variant: 'destructive',
      });
      return;
    }

    const newFarm = {
      name: farmForm.name.trim() || `Farm Plot ${farms.length + 1}`,
      area: Number(areaValue.toFixed(2)),
      crop: farmForm.crop.trim() || 'Not set',
      soilType: farmForm.soilType.trim() || 'Not set',
      irrigationType: farmForm.irrigationType.trim() || 'Not set',
    } satisfies ProfileDocument['farms'][number];

    const previousFarms = farms;
    const nextFarms = [...farms, newFarm];
    setFarms(nextFarms);

    try {
      await persistProfileDocument({ farms: nextFarms });
      toast({
        title: 'Farm plot added',
        description: `${newFarm.name} recorded with ${newFarm.area} acres.`,
      });
      setFarmDialogOpen(false);
      setFarmForm(createFarmForm());
    } catch (error) {
      setFarms(previousFarms);
      toast({
        title: 'Could not save farm plot',
        description: mutationErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const isSaving = saveProfileMutation.isPending;
  const showInitialLoading = profileLoading && !profileData;

  const handleSave = async () => {
    try {
      await persistProfileDocument();
      toast({
        title: 'Profile updated',
        description: 'Your farmer identity details have been synced.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Could not save changes',
        description: mutationErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const totalArea = useMemo(() => farms.reduce((sum, farm) => sum + farm.area, 0), [farms]);
  const primaryCrops = useMemo(() => Array.from(new Set(farms.map((farm) => farm.crop))).join(', '), [farms]);
  const irrigationMix = useMemo(
    () => Array.from(new Set(farms.map((farm) => farm.irrigationType))).join(' • '),
    [farms]
  );
  const location = useMemo(() => `${profile.village}, ${profile.state}`, [profile.village, profile.state]);
  const displayName = useMemo(() => {
    const derived = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
    return derived || profile.name || user?.email || 'Farmer';
  }, [user?.firstName, user?.lastName, user?.email, profile.name]);
  const displayEmail = user?.email || profile.email;
  const contactDetails = useMemo(
    () => [
      { label: 'Phone', value: profile.phone, icon: Phone },
      { label: 'Email', value: profile.email, icon: Mail },
      { label: 'Location', value: location, icon: MapPin },
    ],
    [profile.phone, profile.email, location]
  );
  const statHighlights = [
    { label: 'Total farm area', value: `${totalArea} acres`, icon: Leaf },
    { label: 'Primary crops', value: primaryCrops || 'Add crops', icon: Sprout },
    { label: 'Irrigation mix', value: irrigationMix || 'Update irrigation', icon: Droplets },
  ];
  const quickActions = [
    { label: 'Upload documents', onClick: () => setDocumentDialogOpen(true) },
    { label: 'Link bank account', onClick: () => setBankDialogOpen(true) },
    { label: 'Request support', onClick: () => setSupportDialogOpen(true) },
  ];

  if (showInitialLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading your profile. Hang tight while we fetch the latest details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Account</span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">Profile & identity</h1>
          <p className="text-muted-foreground max-w-2xl">
            Curate your farmer identity, keep contact details current, and stay ready for premium advisory support.
          </p>
        </div>
        <div>
          {isEditing ? (
            <Button className="gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          ) : (
            <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
              Manage profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/15 via-primary/5 to-background shadow-xl xl:col-span-2">
          <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_55%)]" />
          <CardContent className="relative space-y-8 p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-2 ring-primary/20 bg-primary text-primary-foreground">
                    <AvatarFallback className="text-3xl font-semibold">
                      {displayName
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join('') || 'AG'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-foreground">{displayName}</h2>
                    <p className="text-sm text-muted-foreground">{displayEmail}</p>
                    <p className="text-sm text-foreground/80">{profile.fpoCode}</p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-primary shadow-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      {location}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="secondary"
                      size="sm"
                      className="rounded-full bg-white/70 text-xs text-foreground shadow-sm hover:bg-white"
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:max-w-xl">
                {statHighlights.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/50 bg-white/30 p-4 backdrop-blur">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <stat.icon className="h-4 w-4 text-primary" />
                      <p className="text-xs uppercase tracking-wide">{stat.label}</p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {contactDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/85 px-3 py-2 text-sm text-foreground shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <detail.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{detail.label}</p>
                    <p className="font-medium">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/40 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Focus areas</CardTitle>
              <CardDescription>Shape recommendations around what matters most.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleAddFocusArea}>
                <Input
                  value={focusDraft}
                  onChange={(event) => setFocusDraft(event.target.value)}
                  placeholder='Add a new priority (e.g. "Export markets")'
                  className="sm:flex-1"
                  disabled={saveProfileMutation.isPending}
                />
                <Button type="submit" disabled={saveProfileMutation.isPending}>
                  Add focus
                </Button>
              </form>
              <div className="flex flex-wrap gap-2">
                {focusAreas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No focus areas yet. Add one to personalise insights.</p>
                ) : (
                  focusAreas.map((area) => (
                    <Badge
                      key={area}
                      variant="outline"
                      className="group flex items-center gap-1 rounded-full border-primary/30 bg-primary/10 pr-2 text-primary"
                    >
                      {area}
                      <button
                        type="button"
                        className="rounded-full p-1 transition hover:bg-primary/10"
                        onClick={() => handleRemoveFocusArea(area)}
                        aria-label={`Remove ${area}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Farm snapshot</CardTitle>
              <CardDescription>Overview of your registered holdings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-muted/20 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Active plots</p>
                  <p className="text-2xl font-semibold text-foreground">{farms.length}</p>
                </div>
                <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
                  {totalArea} acres total
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Primary crops: <span className="text-foreground font-medium">{primaryCrops || 'Add crops'}</span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Irrigation mix: <span className="text-foreground font-medium">{irrigationMix || 'Update irrigation details'}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/50 bg-card/95 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Personal & contact information</CardTitle>
          <CardDescription>Keep your identity details accurate for faster support.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={profile.name}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                value={profile.phone}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fpo">FPO code</Label>
              <Input id="fpo" value={profile.fpoCode} disabled />
            </div>
          </div>
          <div className="h-px bg-border/60" />
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Address</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={profile.village}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={profile.district}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profile.state}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN code</Label>
                <Input
                  id="pincode"
                  value={profile.pincode}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/95 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Farm details</CardTitle>
            <CardDescription>Your registered farm plots</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setFarmDialogOpen(true)}>
            <Sprout className="h-4 w-4" />
            Add farm plot
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {farms.map((farm) => (
              <div
                key={farm.name}
                className="space-y-4 rounded-2xl border border-border/40 bg-background/90 p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{farm.name}</h3>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Primary crop</p>
                  </div>
                  <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
                    {farm.area} acres
                  </Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sprout className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{farm.crop}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{farm.soilType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{farm.irrigationType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">Upload identity / ownership documents</DialogTitle>
            <DialogDescription>Keep KYC and ownership details updated for faster loan and insurance clearances.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleDocumentSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document type</Label>
                <Input
                  id="document-type"
                  value={documentForm.documentType}
                  onChange={(event) => setDocumentForm((prev) => ({ ...prev, documentType: event.target.value }))}
                  placeholder="Aadhar"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-number">Document number</Label>
                <Input
                  id="document-number"
                  value={documentForm.documentNumber}
                  onChange={(event) => setDocumentForm((prev) => ({ ...prev, documentNumber: event.target.value }))}
                  placeholder="XXXX-XXXX-XXXX"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-notes">Notes</Label>
              <Textarea
                id="document-notes"
                value={documentForm.notes}
                onChange={(event) => setDocumentForm((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder="Mention document holder, issuing authority or expiry."
                rows={4}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setDocumentDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save document</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={bankDialogOpen} onOpenChange={setBankDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">Link bank account</DialogTitle>
            <DialogDescription>Secure payouts directly to your bank or UPI ID for hedging settlements.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleBankSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="bank-account-name">Account holder name</Label>
                <Input
                  id="bank-account-name"
                  value={bankForm.accountName}
                  onChange={(event) => setBankForm((prev) => ({ ...prev, accountName: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-account-number">Account number</Label>
                <Input
                  id="bank-account-number"
                  value={bankForm.accountNumber}
                  onChange={(event) => setBankForm((prev) => ({ ...prev, accountNumber: event.target.value }))}
                  placeholder="Enter account"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-ifsc">IFSC</Label>
                <Input
                  id="bank-ifsc"
                  value={bankForm.ifsc}
                  onChange={(event) => setBankForm((prev) => ({ ...prev, ifsc: event.target.value.toUpperCase() }))}
                  placeholder="SBIN000000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-branch">Branch</Label>
                <Input
                  id="bank-branch"
                  value={bankForm.branch}
                  onChange={(event) => setBankForm((prev) => ({ ...prev, branch: event.target.value }))}
                  placeholder="City / branch"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-upi">UPI ID (optional)</Label>
              <Input
                id="bank-upi"
                value={bankForm.upi}
                onChange={(event) => setBankForm((prev) => ({ ...prev, upi: event.target.value }))}
                placeholder="name@upi"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setBankDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Link account</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">Request support</DialogTitle>
            <DialogDescription>Raise an assistance ticket for onboarding, hedging, or agronomy help.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSupportSubmit}>
            <div className="space-y-2">
              <Label htmlFor="support-topic">Topic</Label>
              <Input
                id="support-topic"
                value={supportForm.topic}
                onChange={(event) => setSupportForm((prev) => ({ ...prev, topic: event.target.value }))}
                placeholder="e.g. Need help with hedging contract"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-message">Message</Label>
              <Textarea
                id="support-message"
                value={supportForm.message}
                onChange={(event) => setSupportForm((prev) => ({ ...prev, message: event.target.value }))}
                placeholder="Describe your query. Our team will call or message you."
                rows={5}
                required
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setSupportDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Submit request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={farmDialogOpen} onOpenChange={setFarmDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">Add farm plot</DialogTitle>
            <DialogDescription>Capture new plot details so advisory, hedging, and logistics stay in sync.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleFarmSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="farm-name">Plot name</Label>
                <Input
                  id="farm-name"
                  value={farmForm.name}
                  onChange={(event) => setFarmForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Farm Plot 3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farm-area">Area (acres)</Label>
                <Input
                  id="farm-area"
                  type="number"
                  min="0"
                  step="0.1"
                  value={farmForm.area}
                  onChange={(event) => setFarmForm((prev) => ({ ...prev, area: event.target.value }))}
                  placeholder="4.5"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="farm-crop">Primary crop</Label>
                <Input
                  id="farm-crop"
                  value={farmForm.crop}
                  onChange={(event) => setFarmForm((prev) => ({ ...prev, crop: event.target.value }))}
                  placeholder="Soybean"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farm-soil">Soil type</Label>
                <Input
                  id="farm-soil"
                  value={farmForm.soilType}
                  onChange={(event) => setFarmForm((prev) => ({ ...prev, soilType: event.target.value }))}
                  placeholder="Alluvial"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farm-irrigation">Irrigation type</Label>
                <Input
                  id="farm-irrigation"
                  value={farmForm.irrigationType}
                  onChange={(event) => setFarmForm((prev) => ({ ...prev, irrigationType: event.target.value }))}
                  placeholder="Drip"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setFarmDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save plot</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
