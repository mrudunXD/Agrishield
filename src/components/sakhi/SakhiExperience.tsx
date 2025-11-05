import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Send, User, Bot, Loader2, Sparkles, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import ConsentModal from "@/components/sakhi/ConsentModal";
import QuickActions from "@/components/sakhi/QuickActions";
import {
  processUserMessage,
  type Message,
  type ConsentRequest,
} from "@/lib/sakhi/messageProcessor";

interface SakhiExperienceProps {
  embedded?: boolean;
}

// Add minimal Web Speech API declarations for browser compatibility
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

const SakhiExperience: React.FC<SakhiExperienceProps> = ({ embedded = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "sakhi",
      text: "Namaste — I'm Sakhi. I can check your field, scan leaves, predict yield, and help lock a good price. What would you like to do?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [consentRequest, setConsentRequest] = useState<any>(null);
  const messagesRef = useRef<Message[]>(messages);
  const lastSubmittedTranscriptRef = useRef<string>("");
  const shouldResumeRecognitionRef = useRef(false);
  const finalTranscriptRef = useRef("");

  // Class name variables (after state so we can reference isListening)
  const userAvatarClass = embedded
    ? "bg-primary text-primary-foreground"
    : "bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-300 text-emerald-950";

  const sakhiAvatarClass = embedded
    ? "bg-muted/70 text-primary"
    : "bg-white/80 text-emerald-600";

  const userBubbleClass = embedded
    ? "bg-primary/95 text-primary-foreground"
    : "bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-300 text-emerald-950";

  const sakhiBubbleClass = embedded
    ? "bg-muted text-foreground"
    : "bg-white/85 text-slate-900";

  const timestampClass = embedded
    ? "text-[11px] text-muted-foreground/80"
    : "text-[11px] uppercase tracking-[0.2em] text-emerald-200/80";

  const composerInputClass = embedded
    ? "flex-1 rounded-xl border-border/40 bg-muted/40 text-sm placeholder:text-muted-foreground"
    : "flex-1 rounded-xl border-white/20 bg-white/15 text-sm text-white placeholder:text-emerald-100 focus:border-emerald-300 focus:ring-emerald-300";

  const composerButtonClass = embedded
    ? "h-11 w-11 rounded-xl bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90"
    : "h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-300 text-emerald-950 shadow-lg transition hover:scale-105";

  const micButtonBaseClass = embedded
    ? "h-11 w-11 rounded-xl border border-border/40 bg-muted/40 text-muted-foreground transition"
    : "h-11 w-11 rounded-xl border border-white/30 bg-white/10 text-white transition";

  const micButtonActiveClass = embedded
    ? "animate-pulse border-primary text-primary"
    : "animate-pulse border-emerald-400 text-emerald-100";

  const micButtonIdleClass = embedded ? "hover:bg-muted/50" : "hover:bg-white/20";

  const micButtonClass = `${micButtonBaseClass} ${isListening ? micButtonActiveClass : micButtonIdleClass}`;

  const messageVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 12, scale: 0.98 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
      exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.2, ease: 'easeInOut' } },
    }),
    []
  );

  const composerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    }),
    []
  );

  const overlayGradients = embedded
    ? "bg-gradient-to-br from-primary/10 via-background to-background"
    : "bg-gradient-to-br from-emerald-500/15 via-emerald-400/10 to-slate-950";

  // Handle consent response
  const handleConsent = useCallback((consent: boolean) => {
    console.log('User consent:', consent);
    setConsentRequest(null);
    // Add your consent handling logic here
  }, []);

  // Handle quick actions
  const handleQuickAction = useCallback((action: string) => {
    console.log('Quick action:', action);
    // Add your quick action logic here
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      synthRef.current = null;
      return;
    }
    synthRef.current = window.speechSynthesis;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (!voiceEnabled || !text.trim() || !synthRef.current) return;

      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => {
        setVoiceEnabled(false);
      };
      utterance.onerror = () => {
        setVoiceEnabled(false);
        toast({
          title: "Voice playback failed",
          description: "Unable to play the voice selection. Try another voice or refresh.",
          variant: "destructive",
        });
      };
      synthRef.current.speak(utterance);
    },
    [toast, voiceEnabled]
  );

  const armVoicePlayback = useCallback(() => {
    if (!synthRef.current) {
      toast({
        title: "Voice playback unavailable",
        description: "Your browser does not support speech synthesis.",
        variant: "destructive",
      });
      return;
    }
    setVoiceEnabled(true);
    toast({
      title: "Voice reply armed",
      description: "Sakhi will speak the next response only.",
    });
  }, [toast]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      const response = await processUserMessage(text.trim(), messagesRef.current);
      setMessages((prev) => [...prev, response.message]);
      if (response.message.sender === "sakhi") {
        speakText(response.message.text);
      }

      if (response.requiresConsent) {
        setConsentRequest(response.consentRequest || null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "I'm having trouble processing that. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [speakText, toast]);

  const initializeRecognition = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser");
      setIsSpeechSupported(false);
      recognitionRef.current = null;
      return null;
    }

    setIsSpeechSupported(true);

    if (recognitionRef.current) {
      shouldResumeRecognitionRef.current = false;
      const existing = recognitionRef.current;
      existing.onstart = null;
      existing.onresult = null;
      existing.onerror = null;
      existing.onend = null;
      try {
        existing.stop();
      } catch (error) {
        console.error("Failed to stop existing recognition instance", error);
      }
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      finalTranscriptRef.current = "";
      lastSubmittedTranscriptRef.current = "";
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalDetected = false;

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";

        if (!transcript.trim()) continue;

        if (result.isFinal) {
          finalTranscriptRef.current = `${finalTranscriptRef.current}${transcript} `;
          finalDetected = true;
        } else {
          interimTranscript += transcript;
        }
      }

      const combinedTranscript = `${finalTranscriptRef.current}${interimTranscript}`.trim();
      if (combinedTranscript) {
        setInputText(combinedTranscript);
      }

      if (finalDetected) {
        const finalText = finalTranscriptRef.current.trim();
        if (finalText && finalText !== lastSubmittedTranscriptRef.current) {
          lastSubmittedTranscriptRef.current = finalText;
          void handleSendMessage(finalText);
        }
        finalTranscriptRef.current = "";
        shouldResumeRecognitionRef.current = false;
        recognition.stop();
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      shouldResumeRecognitionRef.current = false;

      let description = "Could not access your microphone. Please check your permissions.";
      if (event.error === "not-allowed") {
        description = "Microphone access was denied. Please allow microphone access in your browser settings.";
      } else if (event.error === "audio-capture") {
        description = "No microphone was found. Please ensure a microphone is connected.";
      } else if (event.error === "no-speech") {
        description = "I couldn't hear anything. Please try speaking again.";
      }

      toast({
        title: "Voice input error",
        description,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      if (shouldResumeRecognitionRef.current) {
        try {
          recognition.start();
        } catch (error) {
          console.error("Failed to restart recognition:", error);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    return recognition;
  }, [handleSendMessage, toast]);

  useEffect(() => {
    const recognition = initializeRecognition();

    return () => {
      shouldResumeRecognitionRef.current = false;
      if (recognition) {
        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        try {
          recognition.stop();
        } catch (error) {
          console.error("Failed to cleanup speech recognition", error);
        }
      }
      recognitionRef.current = null;
      setIsListening(false);
    };
  }, [initializeRecognition]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop?.();
        } catch (error) {
          console.error("Failed to stop speech recognition on unmount", error);
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const handleMicClick = useCallback(() => {
    if (!isSpeechSupported) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input. Please use a modern browser like Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    const recognition = recognitionRef.current ?? initializeRecognition();
    if (!recognition) {
      toast({
        title: 'Error',
        description: 'Failed to initialize voice input. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (isListening) {
      shouldResumeRecognitionRef.current = false;
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
      setIsListening(false);
      return;
    }

    try {
      shouldResumeRecognitionRef.current = true;
      setInputText('');
      recognition.start();
    } catch (error: any) {
      if (error?.name === 'InvalidStateError') {
        // Already started; ignore
        shouldResumeRecognitionRef.current = true;
        return;
      }
      console.error('Error starting speech recognition:', error);
      shouldResumeRecognitionRef.current = false;
      setIsListening(false);
      toast({
        title: 'Error',
        description: 'Could not start voice input. Please check your microphone permissions.',
        variant: 'destructive',
      });
    }
  }, [initializeRecognition, isListening, isSpeechSupported, toast]);

  const containerClass = embedded
    ? "relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/80 backdrop-blur"
    : "relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-[0_25px_80px_-40px_rgba(16,185,129,0.65)] backdrop-blur-xl";

  return (
    <motion.div
      className={containerClass}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`pointer-events-none absolute inset-0 ${overlayGradients}`} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_65%)]" />

      <div className="relative z-10 flex flex-col h-full">
        <header className="px-5 pt-6 pb-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-200/80">
                <Sparkles className="h-3.5 w-3.5" /> Sakhi Voice Desk
              </span>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Speak naturally, get tailored advice</h2>
                <p className="text-sm text-emerald-100/80">
                  Tap the mic when you need voice input. Sakhi listens only when you ask.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] ${
                  isListening ? "bg-red-500/20 text-red-200" : "bg-emerald-500/15 text-emerald-100"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isListening ? "bg-red-400 animate-pulse" : "bg-emerald-300"}`} />
                {isListening ? "Listening" : "Idle"}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 border-emerald-300 text-emerald-100"
                onClick={armVoicePlayback}
                disabled={voiceEnabled}
              >
                <Volume2 className="h-4 w-4" />
                {voiceEnabled ? "Armed" : "Enable voice reply"}
              </Button>
            </div>
          </div>
        </header>

        <motion.div
          className="flex-1 space-y-5 overflow-y-auto px-5 pb-6 md:px-6"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
        >
          <AnimatePresence initial={false}>
            {messages.map((message) => {
              const isUser = message.sender === "user";
              const avatarClass = isUser ? userAvatarClass : sakhiAvatarClass;
              const bubbleClass = isUser ? userBubbleClass : sakhiBubbleClass;

              return (
                <motion.div
                  key={message.id}
                  layout
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full shadow-lg ring-1 ring-white/10 ${avatarClass}`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`flex max-w-[80%] flex-col gap-2 ${isUser ? "items-end" : ""}`}>
                    <Card className={`border-0 shadow-lg backdrop-blur-xl transition ${bubbleClass}`}>
                      <CardContent className="p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      </CardContent>
                    </Card>
                    {message.quickActions && message.quickActions.length > 0 && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="self-stretch"
                      >
                        <QuickActions actions={message.quickActions} onAction={handleQuickAction} />
                      </motion.div>
                    )}
                    <motion.span
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                      className={timestampClass}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {isProcessing && (
              <motion.div
                key="processing"
                className="flex gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full shadow-lg ring-1 ring-white/10 ${sakhiAvatarClass}`}
                >
                  <Bot className="w-4 h-4" />
                </div>
                <Card className={`border-0 shadow-lg backdrop-blur-xl ${sakhiBubbleClass}`}>
                  <CardContent className="flex items-center gap-2 p-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p className="text-sm">Sakhi is thinking...</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key="composer"
            className={
              embedded
                ? "border-t border-border/40 bg-muted/30 px-5 py-4"
                : "border-t border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl"
            }
            variants={composerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleMicClick}
                  disabled={isProcessing || !isSpeechSupported}
                  className={micButtonClass}
                  title={
                    isSpeechSupported
                      ? isListening
                        ? "Stop voice input"
                        : "Start voice input"
                      : "Voice input not supported in this browser"
                  }
                >
                  {isListening ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      <Mic className="w-5 h-5" />
                    </div>
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <div className="flex flex-1 items-center gap-3">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                  placeholder="Ask Sakhi anything about your farm..."
                  disabled={isProcessing}
                  className={composerInputClass}
                />
                <Button
                  type="button"
                  onClick={() => handleSendMessage(inputText)}
                  disabled={isProcessing || !inputText.trim()}
                  size="icon"
                  className={composerButtonClass}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {consentRequest && (
          <ConsentModal
            isOpen={!!consentRequest}
            onClose={() => setConsentRequest(null)}
            consentRequest={consentRequest}
            onConsent={handleConsent}
          />
        )}
      </div>
    </motion.div>
  );
}

export default SakhiExperience;
