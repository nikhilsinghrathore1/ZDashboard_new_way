"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Activity, Zap } from 'lucide-react';

const CyberpunkVoiceAI = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioLevels, setAudioLevels] = useState(Array(32).fill(0));
  const [voiceInput, setVoiceInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [interimResult, setInterimResult] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const synthRef = useRef(null);
  const animationRef = useRef(null);
  const recognitionRef = useRef(null);

  // Backend API configuration
  const API_BASE_URL = 'https://voice-backend-opal.vercel.app';

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Load voices when they become available
      const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        if (voices.length > 0) {
          console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang, gender: v.name })));
        }
      };
      
      // Voices might load asynchronously
      if (synthRef.current.getVoices().length === 0) {
        synthRef.current.addEventListener('voiceschanged', loadVoices);
      } else {
        loadVoices();
      }
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsRecording(true);
          setError('');
        };

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setInterimResult(interimTranscript);
          
          if (finalTranscript) {
            setVoiceInput(finalTranscript);
            handleUserMessage(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          setError(`Speech recognition error: ${event.error}`);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          setInterimResult('');
        };
      }
    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient]);

  // Audio visualization animation
  useEffect(() => {
    if (!isClient) return;

    if (isSpeaking || isRecording) {
      const animate = () => {
        const newLevels = audioLevels.map((_, index) => {
          if (isSpeaking) {
            // More dynamic animation for speaking
            return Math.sin(Date.now() * 0.01 + index * 0.3) * 50 + Math.random() * 30 + 20;
          } else if (isRecording) {
            // Gentler animation for listening
            return Math.sin(Date.now() * 0.005 + index * 0.2) * 20 + Math.random() * 15 + 10;
          }
          return 0;
        });
        setAudioLevels(newLevels);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      // Gradually fade out the bars
      const fadeOut = () => {
        setAudioLevels(prev => prev.map(level => Math.max(0, level * 0.9)));
        if (audioLevels.some(level => level > 1)) {
          setTimeout(fadeOut, 50);
        }
      };
      fadeOut();
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking, isRecording, isClient, audioLevels]);

  const startListening = () => {
    if (!isClient || !recognitionRef.current) {
      setError('Speech recognition not available');
      return;
    }

    setVoiceInput('');
    setError('');
    try {
      recognitionRef.current.start();
    } catch (err) {
      setError('Failed to start speech recognition');
      console.error('Recognition start error:', err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleUserMessage = async (message) => {
    if (!message.trim()) return;
    
    const userMessage = { type: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError('');

    // Stop listening when processing
    if (isRecording) {
      stopListening();
    }

    try {
      // Send request to backend API
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: message
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.response) {
        const aiMessage = { 
          type: 'ai', 
          content: data.data.response, 
          timestamp: new Date(),
          sessionId: data.data.sessionId
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // Speak the response with female voice
        speakResponse(data.data.response);
      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (error) {
      console.error('API Error:', error);
      setError(`Connection error: ${error.message}`);
      
      // Fallback response
      const fallbackMessage = { 
        type: 'ai', 
        content: "I'm having trouble connecting to the neural network right now. Please try again in a moment.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, fallbackMessage]);
      speakResponse(fallbackMessage.content);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text) => {
    if (!isClient || !synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure for female voice
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('hazel') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.lang.startsWith('en') && voice.name.toLowerCase().includes('google')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Voice settings for a gentle, therapeutic tone
    utterance.rate = 0.8;  // Slightly slower for therapeutic effect
    utterance.pitch = 1.1; // Higher pitch for feminine voice
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (!isClient || !synthRef.current) return;
    
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  // Don't render anything on the server side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-xl">INITIALIZING_NEURAL_INTERFACE...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Neon lines */}
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60" />
        <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
        
        {/* Corner accent lines */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-400 opacity-60" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-purple-500 opacity-60" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-500 opacity-60" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-400 opacity-60" />
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.3); }
          50% { box-shadow: 0 0 40px rgba(56, 189, 248, 0.6); }
        }
      `}</style>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-[110vh]">
        {/* Header */}
        <div className="flex items-center justify-center py-8 border-b border-purple-500/20">
          <div className="flex items-center space-x-4">
            <Activity className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Self help therepist
            </h1>
            <Zap className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        {/* Central Audio Visualizer */}
        <div className="flex-1 flex items-center justify-center relative px-8">
          <div className="w-full max-w-4xl">
            {/* Audio Visualizer Bars */}
            <div className="flex items-end justify-center space-x-2 h-64 mb-8">
              {audioLevels.map((level, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-purple-600 via-cyan-400 to-pink-400 rounded-t transition-all duration-75"
                  style={{
                    width: '8px',
                    height: `${Math.max(4, level)}px`,
                    opacity: level > 5 ? 0.8 + (level / 200) : 0.3,
                    boxShadow: level > 30 ? `0 0 ${level / 10}px currentColor` : 'none'
                  }}
                />
              ))}
            </div>

            {/* Status Display */}
            <div className="text-center mb-8">
              <div className="text-2xl font-mono font-bold mb-4">
                {isLoading && (
                  <span className="text-pink-400 animate-pulse">PROCESSING_NEURAL_DATA...</span>
                )}
                {isSpeaking && (
                  <span className="text-purple-400">TRANSMITTING_RESPONSE</span>
                )}
                {isRecording && (
                  <span className="text-cyan-400">RECEIVING_INPUT</span>
                )}
                {!isLoading && !isSpeaking && !isRecording && (
                  <span className="text-gray-400">NEURAL_INTERFACE_STANDBY</span>
                )}
              </div>
              
              {/* Show current voice input */}
              {(isRecording && (interimResult || voiceInput)) && (
                <div className="mb-4 p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
                  <p className="text-cyan-300 font-mono text-sm">
                    INCOMING: {interimResult || voiceInput}
                    <span className="animate-pulse">|</span>
                  </p>
                </div>
              )}
              
              {/* Frequency Display */}
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-purple-600 to-cyan-400 rounded-full transition-all duration-100"
                    style={{
                      height: `${2 + Math.abs(Math.sin(Date.now() * 0.01 + i * 0.1) * (isSpeaking ? 20 : isRecording ? 10 : 2))}px`,
                      opacity: (isSpeaking || isRecording) ? 0.7 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Voice-Only Control Panel */}
        <div className="px-8 pb-8 border-t border-purple-500/20 bg-black/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            {/* Voice controls */}
            <div className="flex justify-center space-x-12 mb-6">
              <button
                onClick={isRecording ? stopListening : startListening}
                className={`flex flex-col items-center space-y-3 px-8 py-6 rounded-xl border-2 font-mono font-bold transition-all transform hover:scale-105 ${
                  isRecording
                    ? 'bg-red-500/20 border-red-400 text-red-400 hover:bg-red-500/30'
                    : 'bg-cyan-500/20 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30'
                }`}
                style={{
                  animation: isRecording ? 'pulse-glow 1s ease-in-out infinite' : 'none'
                }}
              >
                <div className="p-4 rounded-full bg-current/10">
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </div>
                <span className="text-lg">{isRecording ? 'STOP_INPUT' : 'START_INPUT'}</span>
              </button>
            </div>

            {/* Status indicators */}
            <div className="flex justify-center space-x-12 text-sm font-mono">
              <div className={`flex items-center space-x-3 ${isRecording ? 'text-cyan-400' : 'text-gray-500'}`}>
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-cyan-400 animate-pulse' : 'bg-gray-500'}`}></div>
                <span>VOICE_INPUT_ACTIVE</span>
              </div>
              <div className={`flex items-center space-x-3 ${isSpeaking ? 'text-purple-400' : 'text-gray-500'}`}>
                <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-purple-400 animate-pulse' : 'bg-gray-500'}`}></div>
                <span>VOICE_OUTPUT_ACTIVE</span>
              </div>
              <div className={`flex items-center space-x-3 ${isLoading ? 'text-pink-400' : 'text-gray-500'}`}>
                <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-pink-400 animate-pulse' : 'bg-gray-500'}`}></div>
                <span>NEURAL_PROCESSING</span>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="text-center mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                <p className="text-red-400 font-mono text-sm">
                  ERROR: {error}
                </p>
              </div>
            )}

            {/* Voice Input State Display */}
          

            {/* Instructions */}
            <div className="text-center mt-6 text-cyan-400/70 font-mono text-sm">
              CHIZURU_AI_THERAPIST • VOICE_INTERFACE_CONNECTED_TO_NEURAL_BACKEND
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkVoiceAI;