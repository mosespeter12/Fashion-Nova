import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Dumbbell,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Phone,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Edit3,
  Check
} from 'lucide-react';

interface VoiceSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  audioUrl?: string | null;
  timestamp: string;
  topic?: 'pricing' | 'hours' | 'location' | 'programs' | 'booking' | 'general';
}

export const VoiceSupportModal: React.FC<VoiceSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello! I am FASHION NOVA AI Voice Support Assistant for IronCore Gym — a serious gym for real results. How can I help you today? You can ask about our membership pricing, opening hours, location at 123 Fitness Blvd, or training programs.",
      timestamp: 'Just now',
      topic: 'general',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceStatusNotice, setVoiceStatusNotice] = useState<string | null>(null);

  // Booking Flow States
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    program: 'Personal Training',
    timeSlot: 'Tomorrow at 10:00 AM',
  });

  // Dedicated Confirmation Modal States (does NOT close automatically; stays visible until Confirm, Edit, or Cancel)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isEditingConfirmation, setIsEditingConfirmation] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState({
    firstName: '',
    fitnessGoal: '',
    experience: '',
    visitDay: '',
    timeOfDay: '',
    program: 'Personal Training',
    phone: '',
  });

  // 5-step intake questionnaire state for visitor intent to join/book
  interface IntakeState {
    step: number; // 0 = idle; 1 = waiting name; 2 = waiting goal; 3 = waiting experience; 4 = waiting day; 5 = waiting time; 6 = completed
    firstName: string;
    fitnessGoal: string;
    experience: string;
    visitDay: string;
    timeOfDay: string;
  }

  const [intakeState, setIntakeState] = useState<IntakeState>({
    step: 0,
    firstName: '',
    fitnessGoal: '',
    experience: '',
    visitDay: '',
    timeOfDay: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, showBookingForm]);

  // Initialize speech synthesis voices and cleanup on mount/unmount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    return () => {
      stopAllAudio();
      stopListening();
    };
  }, []);

  // Voice output function: Speaks AI reply out loud using speechSynthesis
  const speakResponse = (text: string) => {
    if (!voiceEnabled) return;

    // Rule 4: Pause microphone while assistant is speaking so it doesn't hear itself
    stopListening();

    if (!('speechSynthesis' in window)) {
      setVoiceStatusNotice('Speech synthesis is not supported on this browser. Text response is displayed in chat.');
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Daniel') ||
              v.name.includes('Alex') ||
              v.name.includes('Karen'))
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis call failed:', err);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    }
  };

  const stopAllAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    currentUtteranceRef.current = null;
    setIsSpeaking(false);
  };

  const [showMicGuide, setShowMicGuide] = useState(false);

  // Stop listening helper
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const startRecognitionInstance = (SpeechRecognitionClass: any) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let accumulated = '';
        if (event.results && event.results.length > 0) {
          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i] && event.results[i][0]) {
              accumulated += event.results[i][0].transcript + ' ';
            }
          }
        }
        const cleaned = accumulated.trim();
        transcriptRef.current = cleaned;
        if (cleaned) {
          setInputText(cleaned);
        }
      };

      // Rule 5: Handle microphone errors with clear fix guidance
      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceStatusNotice(
            'Microphone access is blocked. To fix this: Click the lock or camera/mic icon in your browser address bar, set Microphone permission to "Allow", and try again.'
          );
          setShowMicGuide(true);
        } else if (event.error === 'service-not-allowed') {
          setVoiceStatusNotice(
            'Microphone speech service is not allowed by your browser or operating system settings. Please enable microphone permissions in your device settings.'
          );
          setShowMicGuide(true);
        } else if (event.error === 'audio-capture') {
          setVoiceStatusNotice(
            'No microphone detected. Please connect a microphone or verify your device sound input settings, then try again.'
          );
        } else if (event.error === 'no-speech') {
          setVoiceStatusNotice(
            'No speech was detected. Please click the microphone button and speak clearly.'
          );
        } else if (event.error === 'network') {
          setVoiceStatusNotice(
            'Speech recognition network error. Please check your internet connection or type your question below.'
          );
        } else {
          setVoiceStatusNotice(`Speech recognition notice: ${event.error}. Please try again or type below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Rule 2: When finished speaking and final transcript is ready, automatically send to AI
        const spokenText = transcriptRef.current.trim();
        transcriptRef.current = '';
        if (spokenText) {
          handleSendMessage(spokenText);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start SpeechRecognition:', err);
      setIsListening(false);
      setVoiceStatusNotice(
        'Unable to access microphone. Please check browser microphone permissions or type your question below.'
      );
      setShowMicGuide(true);
    }
  };

  // Start listening with SpeechRecognition API (fallback to webkitSpeechRecognition)
  const startListening = async () => {
    // Rule 4: Stop any speech in progress if user starts talking again
    stopAllAudio();
    setVoiceStatusNotice(null);
    transcriptRef.current = '';

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    // Rule 5: Show clear error message if not supported
    if (!SpeechRecognitionClass) {
      setVoiceStatusNotice(
        'Speech recognition is not supported in this browser. To use voice input, please use Google Chrome, Apple Safari, or Microsoft Edge, or type your question below.'
      );
      return;
    }

    // Attempt native browser permission prompt via getUserMedia if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (mediaErr: any) {
        console.warn('getUserMedia permission test error:', mediaErr);
        if (mediaErr.name === 'NotAllowedError' || mediaErr.name === 'PermissionDeniedError') {
          setVoiceStatusNotice(
            'Microphone access is blocked. To fix this: Click the lock or camera/mic icon in your browser address bar, set Microphone permission to "Allow", and try again.'
          );
          setShowMicGuide(true);
          return;
        }
      }
    }

    startRecognitionInstance(SpeechRecognitionClass);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const checkIntentToJoinOrBook = (text: string) => {
    const lower = text.toLowerCase();

    // If asking about general pricing, hours, location or programs, don't trigger the intake loop prematurely
    const isAskingGeneralInfo =
      lower.includes('how much') ||
      lower.includes('cost') ||
      lower.includes('pricing') ||
      lower.includes('prices') ||
      lower.includes('fee') ||
      lower.includes('what time') ||
      lower.includes('hours') ||
      lower.includes('where is') ||
      lower.includes('location') ||
      lower.includes('address') ||
      lower.includes('what programs') ||
      lower.includes('what classes') ||
      lower.includes('who founded') ||
      lower.includes('tell me about');

    if (isAskingGeneralInfo) return false;

    return (
      lower.includes('join') ||
      lower.includes('sign up') ||
      lower.includes('signup') ||
      lower.includes('book') ||
      lower.includes('free session') ||
      lower.includes('free trial') ||
      lower.includes('trial pass') ||
      lower.includes('trial session') ||
      lower.includes('start training') ||
      lower.includes('get started') ||
      lower.includes('schedule') ||
      lower.includes('reserve') ||
      lower.includes('free pass') ||
      lower.includes('enroll') ||
      lower.includes('membership')
    );
  };

  const handleSendMessage = async (userText: string, specificTopic?: string) => {
    if (!userText.trim()) return;

    // Rule 4: Stop any speech in progress
    stopAllAudio();
    stopListening();

    const newMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    const trimmed = userText.trim();

    // Check if we are in the 5-step intake questionnaire or initiating it
    if (intakeState.step === 1) {
      // 1) First name received -> Ask 2) Main fitness goal
      const extractedName =
        trimmed.replace(/^(my name is|i am|i'm|it's|call me|this is)\s+/i, '').replace(/[.,!]/g, '').trim() || trimmed;
      const nextState = { ...intakeState, step: 2, firstName: extractedName };
      setIntakeState(nextState);

      const replyText = `Nice to meet you, ${extractedName}! What is your main fitness goal?`;
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakResponse(replyText);
      return;
    }

    if (intakeState.step === 2) {
      // 2) Main fitness goal received -> Ask 3) Beginner or experienced
      const nextState = { ...intakeState, step: 3, fitnessGoal: trimmed };
      setIntakeState(nextState);

      const replyText = "Got it! Are you a beginner or experienced with gym training?";
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakResponse(replyText);
      return;
    }

    if (intakeState.step === 3) {
      // 3) Beginner or experienced received -> Ask 4) Preferred visit day
      const nextState = { ...intakeState, step: 4, experience: trimmed };
      setIntakeState(nextState);

      const replyText = "Understood! What day of the week would you prefer to visit us at 123 Fitness Blvd?";
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakResponse(replyText);
      return;
    }

    if (intakeState.step === 4) {
      // 4) Preferred visit day received -> Ask 5) Morning or evening
      const nextState = { ...intakeState, step: 5, visitDay: trimmed };
      setIntakeState(nextState);

      const replyText = "Great! Do you prefer a morning or evening time slot?";
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakResponse(replyText);
      return;
    }

    if (intakeState.step === 5) {
      // 5) Morning or evening received -> Open Confirmation Modal
      const finalTimeOfDay = trimmed;
      const completedState = { ...intakeState, step: 6, timeOfDay: finalTimeOfDay };
      setIntakeState(completedState);

      // Select matching program based on user goal & experience
      let matchedProgram = 'Personal Training';
      const goalLower = (completedState.fitnessGoal + ' ' + completedState.experience).toLowerCase();
      if (goalLower.includes('fat loss') || goalLower.includes('weight loss') || goalLower.includes('lose weight')) {
        matchedProgram = 'Fat Loss Programs';
      } else if (goalLower.includes('strength') || goalLower.includes('muscle') || goalLower.includes('power')) {
        matchedProgram = 'Strength & Conditioning';
      } else if (goalLower.includes('group') || goalLower.includes('class')) {
        matchedProgram = 'Group Fitness';
      } else if (goalLower.includes('beginner') || goalLower.includes('foundation') || goalLower.includes('new')) {
        matchedProgram = 'Beginner Foundations';
      }

      setConfirmationDetails({
        firstName: completedState.firstName,
        fitnessGoal: completedState.fitnessGoal,
        experience: completedState.experience,
        visitDay: completedState.visitDay,
        timeOfDay: finalTimeOfDay,
        program: matchedProgram,
        phone: bookingData.phone || '',
      });

      // Show confirmation modal that does NOT close automatically.
      // Stays visible until the user clicks: Confirm, Edit, or Cancel.
      setShowConfirmationModal(true);
      setIsEditingConfirmation(false);

      // Exact phrase requested:
      // “Please review your details on the screen. If everything looks correct, click Confirm to submit your request.”
      const reviewPromptText = "Please review your details on the screen. If everything looks correct, click Confirm to submit your request.";

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reviewPromptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: 'booking',
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakResponse(reviewPromptText);
      return;
    }

    if (intakeState.step === 0 && (specificTopic === 'booking' || checkIntentToJoinOrBook(trimmed))) {
      // Visitor shows intent to join or book -> Ask question 1 (First name)
      setIntakeState({
        step: 1,
        firstName: '',
        fitnessGoal: '',
        experience: '',
        visitDay: '',
        timeOfDay: '',
      });

      const replyText = "Awesome! Let's get you set up for your free trial session. What is your first name?";
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakResponse(replyText);
      return;
    }

    // General queries (Pricing, Hours, Location, Programs, etc.)
    setIsLoading(true);

    try {
      const response = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          topic: specificTopic,
          history: messages,
          intakeState,
        }),
      });

      const data = await response.json();
      const replyText = data.text || "I'm available to help with pricing, hours, location, programs, or booking a free session.";

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        audioUrl: data.audio,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);

      // Rule 3: Speak the AI's reply out loud using speechSynthesis
      speakResponse(replyText);
    } catch (error) {
      console.error('Failed to get voice assistant response:', error);
      setIsLoading(false);

      const fallbackText = "Our Day Pass is $15, Monthly membership is $49, and Personal Training is $240. We're open Mon–Fri 5am–11pm and Sat–Sun 7am–9pm at 123 Fitness Blvd. You can book a free session or call us at +2348163976633.";
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakResponse(fallbackText);
    }
  };

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.name) return;

    // Open confirmation modal (do not auto-submit, do not auto-confirm)
    setConfirmationDetails({
      firstName: bookingData.name,
      fitnessGoal: 'General Fitness & Muscle Tone',
      experience: 'Beginner Foundations',
      visitDay: bookingData.timeSlot.split(' ')[0] || 'Tomorrow',
      timeOfDay: bookingData.timeSlot.includes('PM') ? 'Evening' : 'Morning',
      program: bookingData.program,
      phone: bookingData.phone || '',
    });
    setShowBookingForm(false);
    setShowConfirmationModal(true);
    setIsEditingConfirmation(false);

    const reviewPromptText = "Please review your details on the screen. If everything looks correct, click Confirm to submit your request.";
    const assistantMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: reviewPromptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: 'booking',
    };
    setMessages((prev) => [...prev, assistantMsg]);
    speakResponse(reviewPromptText);
  };

  const handleConfirmBooking = async () => {
    setIsConfirming(true);
    try {
      const res = await fetch('/api/book-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: confirmationDetails.firstName,
          phone: confirmationDetails.phone || '+2348163976633',
          program: confirmationDetails.program,
          timeSlot: `${confirmationDetails.visitDay} (${confirmationDetails.timeOfDay})`,
          fitnessGoal: confirmationDetails.fitnessGoal,
          experience: confirmationDetails.experience,
        }),
      });
      const data = await res.json();
      setBookingConfirmed(data.bookingId);
      setShowConfirmationModal(false);
      setIsConfirming(false);

      const confText = `Great news, ${confirmationDetails.firstName}! Your free trial session for ${confirmationDetails.program} is confirmed with Pass #${data.bookingId}. We look forward to seeing you at 123 Fitness Blvd! You can also call us at +2348163976633.`;

      const confMsg: Message = {
        id: `book-${Date.now()}`,
        sender: 'assistant',
        text: confText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: 'booking',
      };

      setMessages((prev) => [...prev, confMsg]);
      speakResponse(confText);
    } catch (err) {
      console.error('Booking confirmation submission error:', err);
      setIsConfirming(false);
    }
  };

  const handleEditBooking = () => {
    setIsEditingConfirmation((prev) => !prev);
  };

  const handleCancelBooking = () => {
    setShowConfirmationModal(false);
    setIsEditingConfirmation(false);

    const cancelMsgText = "Booking request cancelled. Feel free to ask any other questions or start a new booking whenever you're ready!";
    const cancelMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: cancelMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: 'booking',
    };
    setMessages((prev) => [...prev, cancelMsg]);
    speakResponse(cancelMsgText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      {/* Dark + Red Container */}
      <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-red-600/40 rounded-2xl shadow-[0_0_35px_rgba(220,38,38,0.22)] overflow-hidden flex flex-col h-[650px] max-h-[92vh] text-white">
        
        {/* TOP BAR / HEADER (Dark + Red Brand Style) */}
        <div className="p-4 sm:px-6 sm:py-4.5 bg-[#121212] border-b border-red-600/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Red Pulsing Voice Assistant Badge */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-red-600/20 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <Mic className={`w-5 h-5 text-red-500 ${isSpeaking ? 'animate-pulse' : ''}`} />
              {isSpeaking && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full ring-2 ring-[#0D0D0D] animate-ping" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm sm:text-base font-bold tracking-wider uppercase text-white">
                  AI Voice Support
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-red-600/20 text-red-400 border border-red-500/30 rounded">
                  Live Voice
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {isSpeaking ? 'Speaking response...' : isListening ? 'Listening to your voice...' : 'Online & ready for gym inquiries'}
              </p>
            </div>
          </div>

          {/* Header Controls: Call Gym, Mute/Unmute & Close */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+2348163976633"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 hover:text-white hover:bg-red-600/30 text-xs transition-colors"
              title="Call IronCore Gym: +2348163976633"
              aria-label="Call IronCore Gym at +2348163976633"
            >
              <Phone className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline font-mono font-medium">+2348163976633</span>
            </a>

            <button
              onClick={() => {
                if (voiceEnabled) {
                  stopAllAudio();
                  setVoiceEnabled(false);
                } else {
                  setVoiceEnabled(true);
                }
              }}
              className={`p-2 rounded-lg border transition-colors ${
                voiceEnabled
                  ? 'bg-red-600/20 border-red-500/40 text-red-400 hover:bg-red-600/30'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
              title={voiceEnabled ? 'Mute Voice' : 'Unmute Voice'}
              aria-label={voiceEnabled ? 'Mute voice audio' : 'Unmute voice audio'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                stopAllAudio();
                onClose();
              }}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              aria-label="Close voice assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VOICE WAVE VISUALIZER STRIP (Dark + Red Animated Waveform) */}
        <div className="bg-[#0A0A0A] border-b border-zinc-900 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-3 bg-red-500 rounded-full transition-all ${isSpeaking ? 'animate-bounce delay-75 h-5' : 'opacity-40'}`} />
            <div className={`w-1.5 h-4 bg-red-500 rounded-full transition-all ${isSpeaking ? 'animate-bounce delay-150 h-6' : 'opacity-40'}`} />
            <div className={`w-1.5 h-2 bg-red-500 rounded-full transition-all ${isSpeaking ? 'animate-bounce delay-200 h-4' : 'opacity-40'}`} />
            <div className={`w-1.5 h-5 bg-red-500 rounded-full transition-all ${isSpeaking ? 'animate-bounce delay-100 h-7' : 'opacity-40'}`} />
            <div className={`w-1.5 h-3 bg-red-500 rounded-full transition-all ${isSpeaking ? 'animate-bounce delay-300 h-5' : 'opacity-40'}`} />
            <span className="text-[11px] text-zinc-400 ml-2 font-mono tracking-wider">
              {isListening ? 'LISTENING... SPEAK NOW' : isSpeaking ? 'VOICE SYNTHESIZER ACTIVE' : 'VOICE ENGINE READY'}
            </span>
          </div>

          {isSpeaking && (
            <button
              onClick={stopAllAudio}
              className="text-[10px] text-red-400 hover:text-red-300 font-semibold tracking-wider uppercase underline"
            >
              Stop Voice
            </button>
          )}
        </div>

        {/* NOTIFICATION FALLBACK BANNER IF APPLICABLE */}
        {voiceStatusNotice && (
          <div className="bg-red-950/70 border-b border-red-800/60 px-4 py-2.5 text-xs text-red-200 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{voiceStatusNotice}</span>
              </div>
              <button
                onClick={() => setVoiceStatusNotice(null)}
                className="text-red-400 hover:text-white ml-2 text-sm px-1 leading-none"
                aria-label="Dismiss notice"
              >
                ×
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pl-6">
              <button
                onClick={() => setShowMicGuide(!showMicGuide)}
                className="px-2.5 py-1 rounded bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-[11px] font-semibold text-white flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-red-400" />
                <span>{showMicGuide ? 'Hide Instructions' : 'How to Fix / Unblock'}</span>
              </button>
              <button
                onClick={startListening}
                className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-[11px] font-semibold text-white transition-colors flex items-center gap-1 shadow-sm"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try Again Now</span>
              </button>
              {typeof window !== 'undefined' && window.self !== window.top && (
                <button
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                  title="Open app in a full browser tab"
                >
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                  <span>Open in Full Tab</span>
                </button>
              )}
            </div>

            {/* STEP-BY-STEP UNBLOCK GUIDE CARD */}
            {showMicGuide && (
              <div className="mt-1 p-3 bg-[#141414] border border-red-600/40 rounded-xl space-y-2 text-[11px] text-zinc-300">
                <div className="font-semibold text-white flex items-center gap-1.5 pb-1 border-b border-zinc-800">
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  <span>How to Unblock Your Microphone in 3 Steps:</span>
                </div>

                <div className="space-y-1.5 pl-1">
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-600/30 border border-red-500/50 text-[10px] text-red-300 font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span><strong>Look at your browser's address bar</strong>: At the far left (next to the website URL), click the <strong>Tune/Sliders 🎛️</strong> or <strong>Lock 🔒</strong> icon.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-600/30 border border-red-500/50 text-[10px] text-red-300 font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Find <strong>Microphone</strong> and switch it from <em>Block</em> to <strong>Allow</strong>.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-600/30 border border-red-500/50 text-[10px] text-red-300 font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Click the <strong>Try Again Now</strong> button above or click the red microphone icon.</span>
                  </div>
                </div>

                <div className="pt-1 text-[10px] text-zinc-400 border-t border-zinc-800/80">
                  💡 <em>Tip: You can also use the text chat input at the bottom anytime — the assistant will still speak answers aloud!</em>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUICK QUESTION TOPIC BUTTONS (Pricing, Hours, Location, Programs, Book Free Session) */}
        <div className="bg-[#101010] p-3 border-b border-zinc-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
          <button
            onClick={() => handleSendMessage("What are your gym membership pricing options?", 'pricing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-red-600/20 text-zinc-300 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 text-xs whitespace-nowrap transition-all"
          >
            <DollarSign className="w-3.5 h-3.5 text-red-500" />
            <span>Pricing</span>
          </button>

          <button
            onClick={() => handleSendMessage("What are your gym opening hours and schedule?", 'hours')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-red-600/20 text-zinc-300 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 text-xs whitespace-nowrap transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span>Opening Hours</span>
          </button>

          <button
            onClick={() => handleSendMessage("Where is your gym located and what about parking?", 'location')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-red-600/20 text-zinc-300 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 text-xs whitespace-nowrap transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>Location</span>
          </button>

          <button
            onClick={() => handleSendMessage("What workout programs, classes, and training do you offer?", 'programs')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-red-600/20 text-zinc-300 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 text-xs whitespace-nowrap transition-all"
          >
            <Dumbbell className="w-3.5 h-3.5 text-red-500" />
            <span>Programs</span>
          </button>

          <button
            onClick={() => {
              setShowBookingForm(true);
              handleSendMessage("I'd like to book a complimentary free trial session.", 'booking');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-900/40 text-xs whitespace-nowrap transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Free Session</span>
          </button>
        </div>

        {/* CHAT LOG / CONVERSATION VIEW */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-[#0D0D0D] via-[#0F0F0F] to-[#0D0D0D]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-red-600 text-white rounded-tr-none shadow-md shadow-red-900/30'
                    : 'bg-[#181818] border border-zinc-800 text-zinc-200 rounded-tl-none shadow-lg'
                }`}
              >
                {/* Voice Replay Button for Assistant Messages */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1 text-red-400 font-semibold">
                      <Sparkles className="w-3 h-3 text-red-500" />
                      Voice Assistant
                    </span>
                    <button
                      onClick={() => speakResponse(msg.text)}
                      className="p-1 hover:text-red-400 transition-colors flex items-center gap-1 text-[10px]"
                      title="Replay Voice Response"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Replay Voice</span>
                    </button>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                <div className={`mt-1.5 text-[10px] text-right ${msg.sender === 'user' ? 'text-red-200' : 'text-zinc-500'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-[#181818] rounded-xl max-w-xs border border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs text-zinc-400">Synthesizing voice response...</span>
            </div>
          )}

          {/* Embedded Free Session Booking Form */}
          {showBookingForm && !bookingConfirmed && (
            <div className="bg-[#161616] border border-red-600/40 rounded-xl p-4 sm:p-5 text-xs space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <h4 className="font-heading font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
                    Book Your Complimentary 1-on-1 Free Session
                  </h4>
                </div>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBookSession} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Hayes"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +2348163976633"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Selected Program</label>
                    <select
                      value={bookingData.program}
                      onChange={(e) => setBookingData({ ...bookingData, program: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Personal Training">Personal Training</option>
                      <option value="Group Fitness">Group Fitness</option>
                      <option value="Strength & Conditioning">Strength & Conditioning</option>
                      <option value="Fat Loss Programs">Fat Loss Programs</option>
                      <option value="Beginner Foundations">Beginner Foundations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Preferred Time Slot</label>
                    <select
                      value={bookingData.timeSlot}
                      onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Tomorrow at 07:00 AM">Tomorrow at 07:00 AM</option>
                      <option value="Tomorrow at 10:00 AM">Tomorrow at 10:00 AM</option>
                      <option value="Tomorrow at 02:00 PM">Tomorrow at 02:00 PM</option>
                      <option value="Tomorrow at 06:00 PM">Tomorrow at 06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md shadow-red-900/40"
                  >
                    Confirm Free Pass
                  </button>
                </div>
              </form>
            </div>
          )}

          {bookingConfirmed && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-600/40 rounded-xl text-xs space-y-1 text-emerald-200">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Free Trial Pass Confirmed: #{bookingConfirmed}</span>
              </div>
              <p>Your session is registered for {bookingData.timeSlot} at 123 Fitness Blvd, Downtown District. Need help? Call us at +2348163976633.</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* BOTTOM INPUT & VOICE CONTROLS */}
        <div className="p-3 sm:p-4 bg-[#111111] border-t border-red-600/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            {/* Big Red Mic Button for Voice Interaction */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-red-600 text-white ring-4 ring-red-600/50 animate-pulse'
                  : 'bg-zinc-900 hover:bg-red-600 text-zinc-300 hover:text-white border border-red-500/40 shadow-sm'
              }`}
              title={isListening ? 'Listening... Click to stop' : 'Click to Speak'}
              aria-label={isListening ? 'Listening. Click to stop' : 'Start microphone voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-red-500 hover:text-white" />}
            </button>

            {/* Text Input Fallback */}
            <input
              type="text"
              placeholder={isListening ? "Listening... speak now" : "Ask about pricing, hours, location, programs..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold text-xs tracking-wider uppercase transition-all shrink-0 flex items-center gap-1.5 shadow-md shadow-red-900/30"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>

          <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-500">
            <span>Voice synthesis + speech recognition enabled</span>
            <span className="text-red-400/80">Press microphone to speak</span>
          </div>
        </div>

        {/* CONFIRMATION MODAL (DOES NOT CLOSE AUTOMATICALLY - STAYS VISIBLE UNTIL CONFIRM, EDIT, OR CANCEL IS CLICKED) */}
        {showConfirmationModal && (
          <div className="absolute inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <div className="w-full max-w-lg bg-[#141414] border-2 border-red-600/70 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.4)] flex flex-col max-h-[94%] overflow-y-auto text-white">
              
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-red-600/30 bg-[#181818] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm sm:text-base tracking-wider uppercase text-white">
                      Review Your Booking Details
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Please review carefully before confirming your request
                    </p>
                  </div>
                </div>
              </div>

              {/* Exact Assistant Spoken Prompt Banner */}
              <div className="px-4 py-3 bg-red-950/40 border-b border-red-800/40 text-xs text-red-200 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
                <span className="italic leading-relaxed font-medium">
                  “Please review your details on the screen. If everything looks correct, click Confirm to submit your request.”
                </span>
              </div>

              {/* Booking Details or Edit Mode */}
              <div className="p-4 sm:p-5 space-y-3 flex-1">
                {!isEditingConfirmation ? (
                  /* Review Summary Details Card */
                  <div className="space-y-2.5 bg-[#181818] border border-zinc-800/90 rounded-xl p-4 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">First Name:</span>
                      <span className="font-semibold text-white text-sm">{confirmationDetails.firstName || 'Athlete'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Main Fitness Goal:</span>
                      <span className="font-medium text-white">{confirmationDetails.fitnessGoal || 'General Fitness'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Experience Level:</span>
                      <span className="font-medium text-white">{confirmationDetails.experience || 'Beginner'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Preferred Visit Day:</span>
                      <span className="font-medium text-white">{confirmationDetails.visitDay || 'This Week'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Time of Day:</span>
                      <span className="font-medium text-white">{confirmationDetails.timeOfDay || 'Morning'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Selected Program:</span>
                      <span className="font-semibold text-red-400">{confirmationDetails.program}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                      <span className="text-zinc-400">Gym Location:</span>
                      <span className="font-medium text-zinc-300">123 Fitness Blvd, Downtown District</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-zinc-400">Phone Number:</span>
                      <span className="font-mono text-zinc-300">{confirmationDetails.phone || '+2348163976633 (or provided at desk)'}</span>
                    </div>
                  </div>
                ) : (
                  /* Editable Mode */
                  <div className="space-y-3 bg-[#181818] border border-red-500/40 rounded-xl p-4 text-xs">
                    <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider pb-1 border-b border-zinc-800">
                      Edit Your Information
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">First Name</label>
                        <input
                          type="text"
                          value={confirmationDetails.firstName}
                          onChange={(e) => setConfirmationDetails({ ...confirmationDetails, firstName: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={confirmationDetails.phone}
                          onChange={(e) => setConfirmationDetails({ ...confirmationDetails, phone: e.target.value })}
                          placeholder="e.g. +2348163976633"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Main Fitness Goal</label>
                        <input
                          type="text"
                          value={confirmationDetails.fitnessGoal}
                          onChange={(e) => setConfirmationDetails({ ...confirmationDetails, fitnessGoal: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Experience Level</label>
                        <select
                          value={confirmationDetails.experience}
                          onChange={(e) => setConfirmationDetails({ ...confirmationDetails, experience: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Experienced">Experienced</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Preferred Visit Day</label>
                        <input
                          type="text"
                          value={confirmationDetails.visitDay}
                          onChange={(e) => setConfirmationDetails({ ...confirmationDetails, visitDay: e.target.value })}
                          placeholder="e.g. Monday, Saturday"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Time of Day</label>
                        <select
                          value={confirmationDetails.timeOfDay}
                          onChange={(e) => setConfirmationDetails({ ...confirmationDetails, timeOfDay: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                        >
                          <option value="Morning">Morning</option>
                          <option value="Evening">Evening</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Program</label>
                      <select
                        value={confirmationDetails.program}
                        onChange={(e) => setConfirmationDetails({ ...confirmationDetails, program: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Personal Training">Personal Training</option>
                        <option value="Group Fitness">Group Fitness</option>
                        <option value="Strength & Conditioning">Strength & Conditioning</option>
                        <option value="Fat Loss Programs">Fat Loss Programs</option>
                        <option value="Beginner Foundations">Beginner Foundations</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingConfirmation(false)}
                      className="w-full mt-1 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                    >
                      Save Changes & View Summary
                    </button>
                  </div>
                )}
              </div>

              {/* THREE REQUIRED ACTION BUTTONS: CONFIRM • EDIT • CANCEL */}
              <div className="p-4 sm:p-5 border-t border-zinc-800 bg-[#161616] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors order-3 sm:order-1 flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>

                <div className="w-full sm:w-auto flex items-center gap-2.5 order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={handleEditBooking}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-zinc-300" />
                    <span>{isEditingConfirmation ? 'View Summary' : 'Edit'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isConfirming}
                    onClick={handleConfirmBooking}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isConfirming ? 'Submitting...' : 'Confirm'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
