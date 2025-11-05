import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import LessonPlayer from "@/components/learning/LessonPlayer";
import {
  Award,
  CalendarDays,
  CheckCircle,
  Clock3,
  Lock,
  PlayCircle,
  Sparkles,
  Users,
  BookOpen,
  Sprout,
  LineChart,
  ShieldCheck,
  Droplets,
  Microscope,
  Wheat,
  Play,
  Pause,
  Video,
  Trophy,
  Star,
  Diamond,
} from 'lucide-react';
import { motion } from "framer-motion";

type LessonStatus = 'completed' | 'in-progress' | 'locked';

type Lesson = {
  id: string;
  title: string;
  type: 'video' | 'case' | 'quiz' | 'lab' | 'note';
  duration: string;
  status: LessonStatus;
  summary: string;
  competency: string;
  videoUrl?: string;
  coverImage?: string;
};

type Module = {
  id: number;
  title: string;
  description: string;
  duration: string;
  progress: number;
  completed: boolean;
  language: string[];
  icon: React.ReactNode;
  theme: {
    gradient: string;
    accent: string;
    badge: string;
  };
  quiz: { total: number; passed: number };
  lessons: Lesson[];
};

type CertificateMilestone = {
  title: string;
  focus: string;
  duration: string;
  status: 'completed' | 'active' | 'upcoming';
  outcome: string;
};

const initialModules: Module[] = [
  {
    id: 1,
    title: "Understanding Yield Intelligence",
    description: "Learn how AI predicts crop yields using weather, soil, and satellite data",
    duration: "15 min",
    progress: 100,
    completed: true,
    lessons: [
      {
        id: "1-1",
        title: "Yield model basics",
        type: "video",
        duration: "04:30",
        status: "completed",
        summary: "How satellite indices combine with ground truth plots to estimate yield.",
        competency: "Satellite interpretation",
        videoUrl: "https://www.youtube.com/embed/6W8B3p3sBws"
      },
      {
        id: "1-2",
        title: "Moisture & canopy signals",
        type: "case",
        duration: "03:40",
        status: "completed",
        summary: "Identify stress signals early using Sakhi's NDVI overlays.",
        competency: "Crop scouting"
      },
      {
        id: "1-3",
        title: "Soil lab integration",
        type: "video",
        duration: "03:20",
        status: "completed",
        summary: "Sync soil test reports and calibrate yield variance bands.",
        competency: "Soil analytics",
        videoUrl: "https://www.youtube.com/embed/ka7UQZG1Neo"
      },
      {
        id: "1-4",
        title: "Apply insights on field",
        type: "quiz",
        duration: "03:00",
        status: "completed",
        summary: "Answer scenario questions to validate crop management steps.",
        competency: "Decision making"
      }
    ],
    language: ["English", "Hindi", "Marathi"],
    icon: <Sprout className="h-7 w-7" />,
    theme: {
      gradient: "from-emerald-500/25 via-lime-400/10 to-transparent",
      accent: "text-emerald-200",
      badge: "border-emerald-300/30 bg-emerald-500/15 text-emerald-50"
    },
    quiz: { total: 5, passed: 5 }
  },
  {
    id: 2,
    title: "What is Price Hedging?",
    description: "Protect your income by locking prices before harvest",
    duration: "20 min",
    progress: 60,
    completed: false,
    lessons: [
      {
        id: "2-1",
        title: "Forward vs spot",
        type: "video",
        duration: "05:10",
        status: "completed",
        summary: "Compare mandis with forward contracts using recent arrivals data.",
        competency: "Market literacy",
        videoUrl: "https://www.youtube.com/embed/ZF4Kz2jX1x8"
      },
      {
        id: "2-2",
        title: "Hedge ratio drill",
        type: "lab",
        duration: "04:30",
        status: "completed",
        summary: "Practice calculating hedge coverage for mixed acreage.",
        competency: "Risk math"
      },
      {
        id: "2-3",
        title: "Cashflow storyboard",
        type: "case",
        duration: "03:50",
        status: "completed",
        summary: "Layer payouts and expenses to see cashflow stability gains.",
        competency: "Financial planning"
      },
      {
        id: "2-4",
        title: "Simulate price swings",
        type: "lab",
        duration: "03:20",
        status: "in-progress",
        summary: "Adjust hedge ratios to absorb market volatility.",
        competency: "Scenario planning"
      },
      {
        id: "2-5",
        title: "Module knowledge check",
        type: "quiz",
        duration: "02:40",
        status: "locked",
        summary: "Quick quiz to validate understanding before certification.",
        competency: "Certification"
      }
    ],
    language: ["English", "Hindi"],
    icon: <LineChart className="h-7 w-7" />,
    theme: {
      gradient: "from-amber-500/25 via-orange-400/15 to-transparent",
      accent: "text-amber-200",
      badge: "border-amber-300/40 bg-amber-500/15 text-amber-100"
    },
    quiz: { total: 5, passed: 3 }
  },
  {
    id: 3,
    title: "Market Price Forecasting",
    description: "Understand how to read and use 30 & 90-day price predictions",
    duration: "18 min",
    progress: 0,
    completed: false,
    lessons: [
      {
        id: "3-1",
        title: "Forecast dashboard tour",
        type: "video",
        duration: "04:20",
        status: "in-progress",
        summary: "Navigate probability bands and seasonal trend markers.",
        competency: "Dashboard navigation",
        videoUrl: "https://www.youtube.com/embed/L6sJbJbxXbE"
      },
      {
        id: "3-2",
        title: "Signal confidence",
        type: "note",
        duration: "03:10",
        status: "locked",
        summary: "Interpret confidence scores using arrival spreads.",
        competency: "Signal analysis"
      },
      {
        id: "3-3",
        title: "Field application story",
        type: "case",
        duration: "04:40",
        status: "locked",
        summary: "Case study on aligning sowing with market peaks.",
        competency: "Market timing"
      },
      {
        id: "3-4",
        title: "Capstone quiz",
        type: "quiz",
        duration: "04:10",
        status: "locked",
        summary: "Multiple choice quiz to validate readiness.",
        competency: "Certification"
      }
    ],
    language: ["English", "Hindi", "Gujarati"],
    icon: <ShieldCheck className="h-7 w-7" />,
    theme: {
      gradient: "from-sky-500/25 via-indigo-400/20 to-transparent",
      accent: "text-sky-200",
      badge: "border-sky-300/40 bg-sky-500/15 text-sky-100"
    },
    quiz: { total: 5, passed: 0 }
  },
  {
    id: 4,
    title: "Virtual Forward Contracts",
    description: "Step-by-step guide to creating and managing hedge contracts",
    duration: "25 min",
    progress: 0,
    completed: false,
    lessons: [
      {
        id: "4-1",
        title: "Contract builder walkthrough",
        type: "video",
        duration: "05:00",
        status: "in-progress",
        summary: "Create a virtual contract using Sakhi's hedging hub.",
        competency: "Platform mastery",
        videoUrl: "https://www.youtube.com/embed/pihcAg9-31A"
      },
      {
        id: "4-2",
        title: "Approval workflow",
        type: "note",
        duration: "03:00",
        status: "locked",
        summary: "Understand verification and approval with FPO desks.",
        competency: "Compliance"
      },
      {
        id: "4-3",
        title: "Settlement scenarios",
        type: "case",
        duration: "04:30",
        status: "locked",
        summary: "Walk through payout vs default scenarios.",
        competency: "Risk mitigation"
      },
      {
        id: "4-4",
        title: "Action lab",
        type: "lab",
        duration: "05:20",
        status: "locked",
        summary: "Submit your first contract draft to the mentoring desk.",
        competency: "Hands-on practice"
      },
      {
        id: "4-5",
        title: "Module checkpoint",
        type: "quiz",
        duration: "03:00",
        status: "locked",
        summary: "Quick check to unlock certification credits.",
        competency: "Certification"
      }
    ],
    language: ["English", "Hindi"],
    icon: <Microscope className="h-7 w-7" />,
    theme: {
      gradient: "from-fuchsia-500/25 via-purple-500/15 to-transparent",
      accent: "text-fuchsia-200",
      badge: "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100"
    },
    quiz: { total: 5, passed: 0 }
  },
  {
    id: 5,
    title: "Soil Health & Crop Advisory",
    description: "Optimize inputs using AI-powered recommendations",
    duration: "22 min",
    progress: 30,
    completed: false,
    lessons: [
      {
        id: "5-1",
        title: "Soil profile essentials",
        type: "video",
        duration: "04:20",
        status: "completed",
        summary: "Decode pH, EC and organic carbon insights for your plot.",
        competency: "Soil literacy",
        videoUrl: "https://www.youtube.com/embed/EWcY8wP9zPc"
      },
      {
        id: "5-2",
        title: "Nutrient scheduling",
        type: "lab",
        duration: "03:45",
        status: "in-progress",
        summary: "Craft a nutrition calendar using Sakhi's calculators.",
        competency: "Input planning"
      },
      {
        id: "5-3",
        title: "Pest watchlist",
        type: "case",
        duration: "04:00",
        status: "locked",
        summary: "Spot stress indicators using leaf imagery and trap alerts.",
        competency: "Crop scouting"
      },
      {
        id: "5-4",
        title: "Field notebook",
        type: "note",
        duration: "03:30",
        status: "locked",
        summary: "Document learnings and sync with advisory desk.",
        competency: "Record keeping"
      },
      {
        id: "5-5",
        title: "Diagnostic quiz",
        type: "quiz",
        duration: "03:10",
        status: "locked",
        summary: "Assess readiness for advanced soil programmes.",
        competency: "Certification"
      }
    ],
    language: ["English", "Hindi", "Telugu"],
    icon: <Droplets className="h-7 w-7" />,
    theme: {
      gradient: "from-green-500/25 via-teal-400/20 to-transparent",
      accent: "text-teal-200",
      badge: "border-teal-300/40 bg-teal-500/15 text-teal-100"
    },
    quiz: { total: 5, passed: 1 }
  }
];

const achievements = [
  {
    title: "First Module Complete",
    description: "You unlocked your Sakhi learning streak and earned your starter badge.",
    icon: <Award className="h-6 w-6" />,
    unlocked: true,
    accent: "from-emerald-500/25 via-emerald-500/10 to-transparent",
  },
  {
    title: "Quiz Master",
    description: "Score 80%+ consistently across knowledge checks to keep this trophy shining.",
    icon: <Trophy className="h-6 w-6" />,
    unlocked: true,
    accent: "from-amber-500/25 via-orange-500/10 to-transparent",
  },
  {
    title: "5 Modules Done",
    description: "Complete five core journeys to unlock advanced agronomy mentorship.",
    icon: <Star className="h-6 w-6" />,
    unlocked: false,
    accent: "from-sky-500/25 via-indigo-500/10 to-transparent",
  },
  {
    title: "Hedging Expert",
    description: "Master risk strategies and publish your own hedge playbook to earn this gem.",
    icon: <Diamond className="h-6 w-6" />,
    unlocked: false,
    accent: "from-fuchsia-500/25 via-purple-500/10 to-transparent",
  },
];

const playlists = [
  {
    title: "Getting started with Sakhi",
    length: "3 lessons",
    icon: <Sparkles className="w-4 h-4" />,
    description: "Personalise Sakhi, record voice notes and sync reminders.",
    cta: "Play intro"
  },
  {
    title: "AI Agronomy Masterclass",
    length: "6 lessons",
    icon: <BookOpen className="w-4 h-4" />,
    description: "Soil nutrition, pest diagnosis and irrigation strategies.",
    cta: "Start course"
  },
  {
    title: "Market resilience toolkit",
    length: "4 lessons",
    icon: <Users className="w-4 h-4" />,
    description: "Pool contracts, hedge together and unlock FPO perks.",
    cta: "View toolkit"
  }
];

const liveSessions = [
  {
    title: "Seasonal hedging clinic",
    date: "Fri, 7 Nov",
    time: "5:00 – 6:00 PM",
    mentor: "Arjun (Risk Analyst)",
    spots: "28 spots left"
  },
  {
    title: "Soil health lab walk-through",
    date: "Wed, 12 Nov",
    time: "4:00 – 5:30 PM",
    mentor: "Dr. Meera (Soil Scientist)",
    spots: "12 spots left"
  }
];

const resources = [
  {
    title: "30-day hedging action plan",
    type: "PDF",
    size: "1.4 MB",
    description: "Templates, checklist and SMS scripts to stay on track."
  },
  {
    title: "Voice training prompts",
    type: "Notion",
    size: "Shared",
    description: "Ready-made farmer prompts to capture high-quality intents."
  },
  {
    title: "Spray window calendar",
    type: "Spreadsheet",
    size: "220 KB",
    description: "Auto-adjusting schedule based on forecast and growth stage."
  }
];

const certificatePath: CertificateMilestone[] = [
  {
    title: "Foundation badge",
    focus: "Complete two core modules & pass quizzes",
    duration: "Week 1",
    status: "completed",
    outcome: "Unlocks community forum access"
  },
  {
    title: "Applied strategist",
    focus: "Finish hedging module labs and submit action plan",
    duration: "Week 2",
    status: "active",
    outcome: "Eligible for FPO premium pricing"
  },
  {
    title: "Field mentor",
    focus: "Host a peer session & score 85% in market forecasting",
    duration: "Week 3",
    status: "upcoming",
    outcome: "Access to beta features & mentor stipend"
  },
  {
    title: "AgriShield Pro certificate",
    focus: "Complete capstone assessment & farm audit",
    duration: "Week 4",
    status: "upcoming",
    outcome: "Certificate shareable with lenders & FPOs"
  }
];

const LESSON_STATUS_LABEL: Record<LessonStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  locked: "Locked",
};

const LESSON_TYPE_LABEL: Record<Lesson["type"], string> = {
  video: "Video lesson",
  case: "Case study",
  quiz: "Knowledge quiz",
  lab: "Practice lab",
  note: "Field note",
};

const LearningCenter: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [focusedLesson, setFocusedLesson] = useState<Lesson | null>(null);

  const modules = useMemo(() => initialModules, []);

  const resumeModule = useMemo(() => {
    return (
      modules.find((module) => module.progress > 0 && module.progress < 100) ??
      modules.find((module) => !module.completed) ??
      modules[0] ?? null
    );
  }, [modules]);

  const activeModule = useMemo(() => {
    if (!selectedModule) return null;
    return modules.find((module) => module.id.toString() === selectedModule) ?? null;
  }, [modules, selectedModule]);

  const nextLesson = useMemo(() => {
    if (!activeModule) return null;
    return (
      activeModule.lessons.find((lesson) => lesson.status !== 'completed') ??
      activeModule.lessons[activeModule.lessons.length - 1] ??
      null
    );
  }, [activeModule]);

  const certificateStats = useMemo(() => {
    const completed = certificatePath.filter((stage) => stage.status === 'completed').length;
    const activeStage = certificatePath.find((stage) => stage.status === 'active');
    return {
      completed,
      total: certificatePath.length,
      activeTitle: activeStage?.title ?? null,
      activeFocus: activeStage?.focus ?? null,
    };
  }, []);

  const handleResumeLearning = () => {
    if (resumeModule) {
      const lesson =
        resumeModule.lessons.find((item) => item.status === 'in-progress') ?? resumeModule.lessons[0] ?? null;
      setSelectedModule(resumeModule.id.toString());
      setFocusedLesson(lesson);
      toast({
        title: `Resuming ${resumeModule.title}`,
        description: lesson ? `Next up: ${lesson.title}` : 'Pick any lesson to continue your journey.',
      });
    } else {
      toast({
        title: 'Learning journey completed',
        description: 'Browse playlists or join a live session to keep the streak alive.',
      });
    }
  };

  const handleViewCertificatePath = () => {
    setCertificateOpen(true);
  };

  const handleContinueModule = (moduleId: number) => {
    const moduleToOpen = modules.find((module) => module.id === moduleId);
    if (!moduleToOpen) return;
    setSelectedModule(moduleId.toString());
    const nextUp =
      moduleToOpen.lessons.find((lesson) => lesson.status !== 'locked') ?? moduleToOpen.lessons[0] ?? null;
    setFocusedLesson(nextUp ?? null);
    toast({
      title: moduleToOpen.completed ? 'Revisiting module' : 'Continuing module',
      description: moduleToOpen.description,
    });
  };

  const handleLaunchLesson = (lesson: Lesson, module: Module) => {
    if (lesson.status === 'locked') {
      toast({
        title: 'Lesson locked',
        description: 'Complete the previous activities to unlock this lesson.',
      });
      return;
    }

    setFocusedLesson(lesson);

    toast({
      title: `Launching ${lesson.title}`,
      description: `Enjoy the ${lesson.type === 'video' ? 'video lesson' : lesson.type === 'case' ? 'case study' : lesson.type === 'lab' ? 'practice lab' : lesson.type === 'note' ? 'field note' : 'quiz'} from ${module.title}.`,
    });
  };

  const handleSaveSeat = (sessionTitle: string) => {
    toast({ title: 'Seat reserved', description: `${sessionTitle} has been added to your learning calendar.` });
  };

  const handleResourceDownload = (resourceTitle: string) => {
    toast({ title: 'Resource opening', description: `${resourceTitle} will open in a new tab.` });
  };

  const handleDownloadCertificatePath = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      journey: certificatePath,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sakhi-certificate-roadmap-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast({ title: 'Certificate roadmap saved', description: 'Review milestones offline or share with your mentor.' });
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-border/40 bg-card p-6 md:p-10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="w-4 h-4" /> Curated for you
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">Grow smarter every season</h1>
              <p className="mt-2 text-muted-foreground">
                Watch micro-lessons, practice with guided labs, and unlock badges that prove your expertise in yield optimisation and price protection.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground/80">
              <span className="inline-flex items-center gap-2"><Clock3 className="w-4 h-4" /> Learn in 10-minute capsules</span>
              <span className="inline-flex items-center gap-2"><Users className="w-4 h-4" /> 2.3k growers active</span>
              <span className="inline-flex items-center gap-2"><Award className="w-4 h-4" /> Badges recognised by FPOs</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={handleResumeLearning}>
                <PlayCircle className="w-5 h-5" /> Resume learning
              </Button>
              <Button variant="outline" size="lg" onClick={handleViewCertificatePath}>
                View certificate path
              </Button>
            </div>
          </div>
          <Card className="bg-primary/5 border-primary/30 w-full md:w-80">
            <CardHeader>
              <CardTitle className="text-base">This week</CardTitle>
              <CardDescription>Keep up the streak and unlock your Pro certificate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Learning streak</span>
                <Badge className="bg-primary text-primary-foreground">4 days</Badge>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Weekly goal</span>
                  <span className="font-medium">60%</span>
                </div>
                <Progress value={60} className="mt-2" />
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success" /> Uploaded first contract practice
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4 text-primary" /> Next live session on Friday
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Modules Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1/5</div>
            <Progress value={20} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Learning Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 hrs</div>
            <p className="text-xs text-muted-foreground">Total time invested</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quiz Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">85%</div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/4</div>
            <p className="text-xs text-muted-foreground">Badges earned</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <div className="space-y-4">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="relative overflow-hidden border border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${module.theme.gradient}`} aria-hidden />
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-inner ${module.theme.accent}`}
                        >
                          {module.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl text-foreground">{module.title}</CardTitle>
                            {module.completed && (
                              <Badge className="bg-success/90 text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm text-foreground/80">{module.description}</CardDescription>
                          <div className="flex flex-wrap gap-2 mt-3 text-xs">
                            <Badge variant="outline" className="border-white/20 bg-white/10 text-foreground/80">
                              {module.lessons.length} lessons
                            </Badge>
                            <Badge variant="outline" className="border-white/20 bg-white/10 text-foreground/80">
                              {module.duration}
                            </Badge>
                            {module.language.map((lang) => (
                              <Badge key={lang} variant="secondary" className={`text-xs ${module.theme.badge}`}>
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        className={`min-w-[112px] border-0 shadow-md transition ${
                          module.completed
                            ? 'bg-success text-success-foreground hover:bg-success/90'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                        onClick={() => handleContinueModule(module.id)}
                      >
                        {module.progress > 0 && !module.completed ? 'Continue' : module.completed ? 'Revisit' : 'Start'}
                      </Button>
                    </div>
                  </CardHeader>
                  {module.progress > 0 && (
                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-foreground/80">
                          <span>Progress</span>
                          <span className="font-semibold text-foreground">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2 bg-black/10" />
                        {module.quiz.total > 0 && (
                          <div className="flex items-center justify-between text-sm text-foreground/80 pt-1">
                            <span>Quiz score</span>
                            <span className="font-medium text-foreground">
                              {module.quiz.passed}/{module.quiz.total} correct
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card
                  className={`relative overflow-hidden border ${
                    achievement.unlocked ? 'border-primary/30' : 'border-border/40 opacity-70'
                  }`}
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${achievement.accent}`} />
                  <CardContent className="relative z-10 pt-6 pb-6 text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-primary shadow-inner">
                      {achievement.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                      <p className="text-xs text-foreground/80 leading-relaxed px-3">{achievement.description}</p>
                    </div>
                    <Badge
                      className={
                        achievement.unlocked
                          ? 'mx-auto bg-success/90 text-white'
                          : 'mx-auto border-white/30 bg-white/10 text-foreground/80'
                      }
                    >
                      {achievement.unlocked ? (
                        <span className="flex items-center gap-2"><CheckCircle className="h-3 w-3" /> Unlocked</span>
                      ) : (
                        <span className="flex items-center gap-2"><Lock className="h-3 w-3" /> Locked</span>
                      )}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Featured playlists</CardTitle>
              <CardDescription>Immersive pathways to level up specific skills.</CardDescription>
            </div>
            <Button variant="ghost" className="gap-2">
              <PlayCircle className="w-4 h-4" /> Browse all
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {playlists.map((playlist) => (
              <div key={playlist.title} className="rounded-xl border border-border/50 bg-card/80 p-4 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {playlist.icon}
                  {playlist.length}
                </div>
                <h3 className="text-lg font-semibold leading-snug">{playlist.title}</h3>
                <p className="text-sm text-muted-foreground">{playlist.description}</p>
                <Button variant="outline" className="w-full">
                  {playlist.cta}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming live sessions</CardTitle>
            <CardDescription>Reserve your seat and join mentors in real time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {liveSessions.map((session) => (
              <div key={session.title} className="rounded-xl border border-border/40 bg-secondary/40 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{session.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {session.spots}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> {session.date}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock3 className="w-4 h-4" /> {session.time}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" /> {session.mentor}
                </p>
                <Button size="sm" className="w-full" onClick={() => handleSaveSeat(session.title)}>Save seat</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Resource library</CardTitle>
            <CardDescription>Downloads, playbooks and community docs kept up to date.</CardDescription>
          </div>
          <Button variant="outline" className="gap-2">
            <BookOpen className="w-4 h-4" /> Submit your resource
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {resources.map((resource) => (
            <div key={resource.title} className="rounded-2xl border border-border/40 bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                <span>{resource.type}</span>
                <span>{resource.size}</span>
              </div>
              <h3 className="text-base font-semibold text-foreground">{resource.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleResourceDownload(resource.title)}>Open</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={!!activeModule}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedModule(null);
            setFocusedLesson(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          {activeModule && (
            <>
              <DialogHeader className="space-y-2">
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">{activeModule.icon}</span>
                  {activeModule.title}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>{activeModule.description}</span>
                  <Badge variant="secondary" className="text-xs">{activeModule.duration}</Badge>
                  <Badge variant="outline" className="text-xs">{activeModule.lessons.length} lessons</Badge>
                  <Badge variant="outline" className="text-xs">{activeModule.language.join(' • ')}</Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5">
                {focusedLesson && (
                  <motion.div
                    key={focusedLesson.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-2xl border border-border/50 bg-card/90 backdrop-blur p-5 flex flex-col gap-5"
                  >
                    <LessonPlayer
                      title={focusedLesson.title}
                      summary={focusedLesson.summary}
                      competency={focusedLesson.competency}
                      duration={focusedLesson.duration}
                      source={
                        focusedLesson.type === 'video' && focusedLesson.videoUrl
                          ? { type: focusedLesson.videoUrl.includes('youtube.com') ? 'youtube' : 'mp4', url: focusedLesson.videoUrl }
                          : undefined
                      }
                      onComplete={() => toast({ title: 'Lesson completed', description: `${focusedLesson.title} marked as done.` })}
                    />
                  </motion.div>
                )}
                {nextLesson && (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-primary">Up next</p>
                      <p className="text-sm font-semibold text-foreground">{nextLesson.title}</p>
                      <p className="text-xs text-muted-foreground">{nextLesson.summary}</p>
                    </div>
                    <Button onClick={() => handleLaunchLesson(nextLesson, activeModule)}>
                      {nextLesson.status === 'completed' ? 'Revisit lesson' : 'Launch lesson'}
                    </Button>
                  </div>
                )}
                <div className="space-y-3">
                  {activeModule.lessons.map((lesson) => {
                    const isActiveLesson = focusedLesson?.id === lesson.id;
                    const isLocked = lesson.status === 'locked';
                    return (
                    <div
                      key={lesson.id}
                      className={`rounded-2xl border p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between transition ${
                        isLocked
                          ? 'border-border/40 bg-muted/20 opacity-70'
                          : isActiveLesson
                          ? 'border-primary/60 bg-primary/10 shadow-lg'
                          : lesson.status === 'completed'
                          ? 'border-success/40 bg-success/10'
                          : 'border-primary/30 bg-card/90'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[11px] uppercase tracking-wide">
                            {lesson.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        </div>
                        <p className="font-semibold text-sm text-foreground">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{lesson.summary}</p>
                        <p className="text-[11px] font-medium text-primary uppercase tracking-[0.2em]">{lesson.competency}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={lesson.status === 'completed' ? 'secondary' : isActiveLesson ? 'default' : 'outline'}
                        className={`mt-2 md:mt-0 ${isActiveLesson ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                        onClick={() => handleLaunchLesson(lesson, activeModule)}
                      >
                        {isActiveLesson
                          ? 'Now playing'
                          : lesson.status === 'completed'
                          ? 'Review'
                          : lesson.status === 'in-progress'
                          ? 'Continue'
                          : 'Unlock lesson'}
                      </Button>
                    </div>
                    );
                  })}
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setSelectedModule(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={certificateOpen} onOpenChange={setCertificateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-primary" /> Certificate journey roadmap
            </DialogTitle>
            <DialogDescription>
              Track your milestones towards the AgriShield Pro credential. Stay on pace to unlock advanced benefits.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary">Progress</p>
                <p className="text-sm text-muted-foreground">
                  {certificateStats.completed}/{certificateStats.total} milestones complete · {certificateStats.activeTitle ? `Current focus: ${certificateStats.activeTitle}` : 'Take on the first milestone to begin'}
                </p>
                {certificateStats.activeFocus && (
                  <p className="text-xs text-primary mt-1">{certificateStats.activeFocus}</p>
                )}
              </div>
              <Button onClick={handleDownloadCertificatePath}>Download plan</Button>
            </div>
            <div className="space-y-3">
              {certificatePath.map((milestone, index) => (
                <div
                  key={milestone.title}
                  className={`rounded-2xl border p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between ${
                    milestone.status === 'completed'
                      ? 'border-success/40 bg-success/10'
                      : milestone.status === 'active'
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border/40 bg-muted/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={milestone.status === 'completed' ? 'secondary' : 'outline'}
                        className="text-[11px] uppercase tracking-wide"
                      >
                        Week {index + 1}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{milestone.duration}</span>
                    </div>
                    <p className="font-semibold text-sm text-foreground">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{milestone.focus}</p>
                    <p className="text-[11px] font-medium text-primary uppercase tracking-[0.2em]">Outcome: {milestone.outcome}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={milestone.status === 'completed' ? 'secondary' : milestone.status === 'active' ? 'default' : 'outline'}
                    className="mt-2 md:mt-0"
                    onClick={() => {
                      toast({
                        title: milestone.status === 'completed' ? 'Milestone unlocked' : 'Milestone details',
                        description: milestone.focus,
                      });
                    }}
                  >
                    {milestone.status === 'completed' ? 'View badge' : milestone.status === 'active' ? 'Work on tasks' : 'Preview tasks'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertificateOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningCenter;
