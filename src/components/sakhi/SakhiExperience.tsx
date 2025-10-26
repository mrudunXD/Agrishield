import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Mic, Send, User, Bot, Loader2, Volume2, VolumeX } from "lucide-react";
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

type VoiceProfile = {
  id: string;
  label: string;
  gender: "female" | "male" | "neutral";
  language: string;
  matchers: RegExp[];
};

const voiceProfiles: VoiceProfile[] = [
  {
    id: "en-female-soft",
    label: "Asha · Warm Female",
    gender: "female",
    language: "en-IN",
    matchers: [/asha/i, /female/i, /india/i, /en-IN/i],
  },
  {
    id: "en-female-clear",
    label: "Meera · Crisp Female",
    gender: "female",
    language: "en-IN",
    matchers: [/meera/i, /female/i, /en-IN/i],
  },
  {
    id: "en-male-calm",
    label: "Arjun · Calm Male",
    gender: "male",
    language: "en-IN",
    matchers: [/arjun/i, /male/i, /en-IN/i],
  },
  {
    id: "en-male-energetic",
    label: "Rohit · Energetic Male",
    gender: "male",
    language: "en-IN",
    matchers: [/rohit/i, /male/i, /en-IN/i],
  },
  {
    id: "en-neutral-global",
    label: "Kai · Neutral Global",
    gender: "neutral",
    language: "en-GB",
    matchers: [/english/i, /neutral/i, /en-GB/i],
  },
];

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

  const micButtonClass = embedded
    ? `h-11 w-11 rounded-xl border border-border/40 bg-muted/40 text-muted-foreground transition ${
        isListening ? "animate-pulse border-primary text-primary" : "hover:bg-muted/50"
      }`
    : `h-11 w-11 rounded-xl border border-white/30 bg-white/10 text-white transition ${
        isListening ? "animate-pulse border-emerald-400 text-emerald-100" : "hover:bg-white/20"
      }`;

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
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(voiceProfiles[0]?.id ?? "");
  const [isSpeaking, setIsSpeaking] = useState(false);
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

    const populateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const matchedVoices = useMemo(() => {
    if (!availableVoices.length) return [];
    const usedVoiceNames = new Set<string>();

    return voiceProfiles.map((profile) => {
      const primaryMatch = availableVoices.find((voice) =>
        profile.matchers.some((matcher) => matcher.test(`${voice.name} ${voice.lang}`))
      );

      const hindiMatch = availableVoices.find((voice) => voice.lang.toLowerCase().startsWith("hi"));

      const regionalMatch = availableVoices.find((voice) => voice.lang.toLowerCase().includes("en-in"));

      const englishMatch = availableVoices.find((voice) => voice.lang.toLowerCase().startsWith("en"));

      const candidateSearchOrder = [primaryMatch, hindiMatch, regionalMatch, englishMatch];

      let chosenVoice: SpeechSynthesisVoice | null = null;
      const fallbackVoice = availableVoices.find((voice) => !usedVoiceNames.has(voice.name));

      for (const candidate of candidateSearchOrder) {
        if (candidate && !usedVoiceNames.has(candidate.name)) {
          chosenVoice = candidate;
          break;
        }
      }

      if (!chosenVoice) {
        chosenVoice = fallbackVoice ?? null;
      }

      if (chosenVoice) {
        usedVoiceNames.add(chosenVoice.name);
      }

      return {
        profile,
        voice: chosenVoice,
      };
    });
  }, [availableVoices]);

  const selectedVoiceEntry = useMemo(() => {
    return matchedVoices.find((entry) => entry.profile.id === selectedVoiceId) ?? null;
  }, [matchedVoices, selectedVoiceId]);

  const selectedVoice = selectedVoiceEntry?.voice ?? null;
  const selectedVoiceProfile = selectedVoiceEntry?.profile ?? null;

  const speakText = useCallback(
    (text: string) => {
      if (!voiceEnabled || !text.trim() || !synthRef.current) return;

      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 1;
      const voiceGender = selectedVoiceProfile?.gender ?? "female";
      utterance.pitch = voiceGender === "male" ? 0.95 : voiceGender === "neutral" ? 1 : 1.05;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Voice playback failed",
          description: "Unable to play the voice selection. Try another voice or refresh.",
          variant: "destructive",
        });
      };
      synthRef.current.speak(utterance);
    },
    [selectedVoice, toast, voiceEnabled]
  );

  const stopSpeaking = useCallback(() => {
    if (!synthRef.current || !synthRef.current.speaking) return;
    synthRef.current.cancel();
    setIsSpeaking(false);
  }, []);

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
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0]?.transcript ?? "")
        .join("")
        .trim();

      if (!transcript) {
        return;
      }

      setInputText(transcript);

      const lastResult = event.results[event.results.length - 1];
      if (lastResult?.isFinal) {
        if (transcript && transcript !== lastSubmittedTranscriptRef.current) {
          lastSubmittedTranscriptRef.current = transcript;
          void handleSendMessage(transcript);
        }
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
      lastSubmittedTranscriptRef.current = "";
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

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
        {messages.map((message) => {
          const isUser = message.sender === "user";
          const avatarClass = isUser ? userAvatarClass : sakhiAvatarClass;
          const bubbleClass = isUser ? userBubbleClass : sakhiBubbleClass;

          return (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full shadow-lg ${avatarClass}`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`flex max-w-[80%] flex-col ${isUser ? "items-end" : ""}`}>
                <Card className={`border-0 shadow-lg backdrop-blur-xl ${bubbleClass}`}>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  </CardContent>
                </Card>
                {message.quickActions && message.quickActions.length > 0 && (
                  <div className="mt-2">
                    <QuickActions actions={message.quickActions} onAction={handleQuickAction} />
                  </div>
                )}
                <p className={timestampClass}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex gap-3">
            <div
              className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full shadow-lg ${sakhiAvatarClass}`}
            >
              <Bot className="w-4 h-4" />
            </div>
            <Card className={`border-0 shadow-lg backdrop-blur-xl ${sakhiBubbleClass}`}>
              <CardContent className="flex items-center gap-2 p-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm">Sakhi is thinking...</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div
        className={
          embedded
            ? "border-t border-border/40 bg-muted/30 px-5 py-4"
            : "border-t border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl"
        }
      >
        <div className="flex gap-3">
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

      {consentRequest && (
        <ConsentModal
          isOpen={!!consentRequest}
          onClose={() => setConsentRequest(null)}
          consentRequest={consentRequest}
          onConsent={handleConsent}
        />
      )}
    </div>
  );
};

export default SakhiExperience;
