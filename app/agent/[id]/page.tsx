"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";


interface Message {
  id: number;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
  isRead?: boolean;
}


interface AgentDetails {
  id: number;
  name: string;
  description: string;
  model: string;
  capabilities: string[];
  createdAt: string;
  updatedAt: string;
}


interface SpeechSettings {
  autoSpeak: boolean;
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
}


interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}


const AgentChatPage: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agentDetails, setAgentDetails] = useState<AgentDetails | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [voicesLoaded, setVoicesLoaded] = useState<boolean>(false);
  const [isLoadingAgent, setIsLoadingAgent] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    autoSpeak: true,
    voice: null,
    rate: 0.85,
    pitch: 1.0,
    volume: 0.9,
  });


  // Initialize speech synthesis with better voice loading
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log(
          "Available voices:",
          voices.map((v) => ({ name: v.name, lang: v.lang }))
        );


        if (voices.length > 0) {
          // Try to find the best female voice
          const preferredVoice =
            voices.find(
              (voice) =>
                voice.name.toLowerCase().includes("zira") ||
                voice.name.toLowerCase().includes("hazel") ||
                voice.name.toLowerCase().includes("aria")
            ) ||
            voices.find((voice) =>
              voice.name.toLowerCase().includes("female")
            ) ||
            voices.find(
              (voice) =>
                voice.lang.startsWith("en") &&
                voice.name.toLowerCase().includes("google")
            ) ||
            voices.find((voice) => voice.lang.startsWith("en-US")) ||
            voices.find((voice) => voice.lang.startsWith("en")) ||
            voices[0];


          console.log("Selected voice:", preferredVoice?.name);


          setSpeechSettings((prev) => ({
            ...prev,
            voice: preferredVoice || null,
          }));
          setVoicesLoaded(true);
        }
      };


      // Load voices immediately if available
      loadVoices();


      // Also listen for the voices changed event
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);


      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, []);


  // Extract agent ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split("/");
    const idFromUrl = pathSegments[pathSegments.length - 1];
    if (idFromUrl && idFromUrl !== "agent") {
      setAgentId(idFromUrl);
    } else {
      // Fallback if no ID in URL
      setAgentId("1");
    }
  }, []);


  // Fetch agent details from API
  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!agentId) return;


      setIsLoadingAgent(true);
      setError("");


      try {
        console.log(`Fetching agent details for ID: ${agentId}`);
        
        const response = await fetch(`https://create-agent-backend.vercel.app/agents/${agentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });


        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Agent not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }


        const responseData = await response.json();
        console.log('Agent details fetched:', responseData);


        if (responseData.success && responseData.data) {
          setAgentDetails(responseData.data);


          // Create a personalized welcome message based on agent data
          const welcomeMessage: Message = {
            id: Date.now(),
            type: "agent",
            content: `>>> NEURAL LINK ESTABLISHED <<<\n\nGreetings, user. I am ${responseData.data.name.toUpperCase()}, ${responseData.data.description}.\n\nMy specialized capabilities include:\n${responseData.data.capabilities.map((cap: string) => `• ${cap.replace('-', ' ').toUpperCase()}`).join('\n')}\n\nPowered by ${responseData.data.model.toUpperCase()} neural architecture, my systems are now online and ready to assist. How may I process your request today?`,
            timestamp: new Date(),
          };


          setMessages([welcomeMessage]);


          // Auto-speak welcome message after voices are loaded
          const speakWelcome = () => {
            if (speechSettings.autoSpeak && voicesLoaded && speechSettings.voice) {
              setTimeout(() => {
                speakMessage(welcomeMessage.id, welcomeMessage.content, true);
              }, 2000);
            }
          };


          if (voicesLoaded) {
            speakWelcome();
          } else {
            // Wait for voices to load
            const checkVoices = setInterval(() => {
              if (voicesLoaded) {
                clearInterval(checkVoices);
                speakWelcome();
              }
            }, 500);
          }
        } else {
          throw new Error('Invalid response format');
        }


      } catch (error: any) {
        console.error('Error fetching agent details:', error);
        setError(error.message || 'Failed to load agent details');
        
        // Fallback agent details
        setAgentDetails({
          id: parseInt(agentId),
          name: `NEURAL-AI-${agentId.slice(-3).toUpperCase()}`,
          description: "AI Assistant temporarily offline",
          model: "gemini-pro",
          capabilities: ["general-assistance"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setIsLoadingAgent(false);
      }
    };


    fetchAgentDetails();
  }, [agentId, speechSettings.autoSpeak, voicesLoaded, speechSettings.voice]);


  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputValue]);


  // Convert messages to chat history format for API
  const buildChatHistory = (messages: Message[]): ChatHistoryItem[] => {
    // Filter out the welcome message and convert to API format
    return messages
      .filter(msg => !msg.content.includes(">>> NEURAL LINK ESTABLISHED <<<"))
      .map(msg => ({
        role: msg.type === "user" ? "user" as const : "assistant" as const,
        content: msg.content
      }));
  };


  // Generate dynamic prompt with chat history context
  const generateDynamicPromptWithHistory = (
    userMessage: string, 
    agentDetails: AgentDetails,
    chatHistory:any
  ): string => {
    const capabilitiesText = agentDetails.capabilities
        .map(cap => cap.replace('-', ' ').toLowerCase())
        .join(', ');
    
    const systemPrompt = `You are ${agentDetails.name}, ${agentDetails.description}.

Specialized capabilities: ${capabilitiesText}
Powered by: ${agentDetails.model} architecture

RESPONSE REQUIREMENTS:
• Keep responses SHORT and CRISP (2-4 sentences max)
• Lead with the most important information
• Use bullet points only when absolutely necessary
• Eliminate redundant words and filler phrases
• Be direct and actionable
• No verbose explanations unless specifically requested
• Maintain conversation context from previous messages

Communication style:
- Professional yet engaging tone
- Technical terminology when appropriate
- Reference capabilities when directly relevant
- Demonstrate expertise through precision, not length
- Prioritize clarity over comprehensiveness
- Build upon previous conversation topics naturally

IMPORTANT: You have access to the conversation history. Use this context to provide relevant, contextual responses that acknowledge previous discussions and avoid repeating information already covered.

Current user query: ${userMessage}

Respond as ${agentDetails.name} with maximum conciseness while maintaining helpfulness, accuracy, and conversation continuity.

and this the history of chats taks this as reference when generating new answers ${chatHistory}
`;

    return systemPrompt;
  };


  // New function to call the actual chat API with history
  const getAgentResponse = async (userMessage: string): Promise<string> => {
    try {
      if (!agentDetails) {
        throw new Error('Agent details not available');
      }

      // Build chat history from current messages
      const chatHistory = buildChatHistory(messages);
      console.log("this is the chat history " , chatHistory)
      const dynamicPrompt = generateDynamicPromptWithHistory(userMessage, agentDetails, JSON.stringify(chatHistory));
      
      console.log('Sending request to chat API with history:', { 
        prompt: dynamicPrompt,
        history: chatHistory
      });



      const requestBody = {
        prompt: dynamicPrompt,
      
      };



      const response = await fetch('https://create-agent-backend.vercel.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Chat API error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Chat API response:', responseData);

      if (responseData.success && responseData.data && responseData.data.response) {
        return responseData.data.response;
      } else {
        throw new Error('Invalid response format from chat API');
      }

    } catch (error: any) {
      console.error('Error calling chat API:', error);
      
      // Fallback response in case of API failure
      return `>>> SYSTEM ERROR <<<\n\nI apologize, but I'm experiencing technical difficulties connecting to my neural networks. This could be due to:\n\n• Network connectivity issues\n• Server maintenance\n• API endpoint unavailable\n\nError details: ${error.message}\n\nPlease try again in a moment. My systems are designed to self-repair and should be back online shortly.`;
    }
  };


  const speakMessage = useCallback(
    (messageId: number, text: string, isAutoSpeak: boolean = false) => {
      if (
        !("speechSynthesis" in window) ||
        !speechSettings.voice ||
        !voicesLoaded
      ) {
        console.log("Speech synthesis not available or voice not loaded");
        return;
      }


      // Stop current speech if any
      window.speechSynthesis.cancel();


      if (speakingMessageId === messageId && !isAutoSpeak) {
        setSpeakingMessageId(null);
        return;
      }


      setSpeakingMessageId(messageId);


      // Clean the text for better speech synthesis
      const cleanText = text
        .replace(/>>>/g, "")
        .replace(/<<</g, "")
        .replace(/\[.*?\]/g, "")
        .replace(/#{1,6}\s/g, "") // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
        .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
        .replace(/`(.*?)`/g, '$1') // Remove inline code
        .replace(/```[\s\S]*?```/g, '[Code block]') // Replace code blocks
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();


      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.voice = speechSettings.voice;
      utterance.rate = speechSettings.rate;
      utterance.pitch = speechSettings.pitch;
      utterance.volume = speechSettings.volume;


      utterance.onstart = () => {
        console.log("Speech started for message:", messageId);
      };


      utterance.onend = () => {
        console.log("Speech ended for message:", messageId);
        setSpeakingMessageId(null);
      };


      utterance.onerror = (event) => {
        console.error("Speech error:", event);
        setSpeakingMessageId(null);
      };


      speechUtteranceRef.current = utterance;


      // Small delay to ensure the speech synthesis is ready
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    },
    [speechSettings, speakingMessageId, voicesLoaded]
  );


  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || isLoading) return;


    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };


    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsTyping(true);


    try {
      // Get actual response from the chat API with conversation history
      const agentResponseText = await getAgentResponse(userMessage.content);
      
      // Simulate realistic typing delay based on response length
      const typingDelay = Math.min(agentResponseText.length * 20 + 1000, 5000);

      setTimeout(() => {
        setIsTyping(false);
        const agentResponse: Message = {
          id: Date.now() + 1,
          type: "agent",
          content: agentResponseText,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, agentResponse]);
        setIsLoading(false);

        // Auto-speak agent response if enabled
        if (speechSettings.autoSpeak && voicesLoaded) {
          setTimeout(() => {
            speakMessage(agentResponse.id, agentResponse.content, true);
          }, 800);
        }
      }, typingDelay);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setIsTyping(false);
      setIsLoading(false);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: "agent",
        content: ">>> CONNECTION ERROR <<<\n\nI apologize, but I'm currently experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };


  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  const toggleAutoSpeak = () => {
    setSpeechSettings((prev) => ({ ...prev, autoSpeak: !prev.autoSpeak }));
    if (speakingMessageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };


  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? "text-green-400" : "text-red-400";
  };


  const getStatusDot = (isOnline: boolean) => {
    return isOnline ? "bg-green-400 shadow-green-400/50" : "bg-red-400 shadow-red-400/50";
  };


  const TypingIndicator: React.FC = () => (
    <div className="flex justify-start">
      <div className="max-w-xs md:max-w-md lg:max-w-lg px-6 py-4 rounded-2xl bg-black/80 backdrop-blur-sm border border-green-500/40 shadow-lg shadow-green-500/20">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.4s",
                }}
              />
            ))}
          </div>
          <span className="text-green-400 text-sm font-mono">
            {agentDetails?.name || 'NEURAL-AI'} is processing...
          </span>
        </div>
      </div>
    </div>
  );


  const LoadingAnimation: React.FC = () => (
    <div className="flex overflow-hidden items-center space-x-2 py-4">
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-8 bg-green-400 rounded-full animate-pulse opacity-60"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
      <div className="text-green-400 text-sm font-mono animate-pulse">
        Loading agent data...
      </div>
    </div>
  );


  if (isLoadingAgent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-black to-green-900/5"></div>
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animation: 'gridMove 20s linear infinite'
              }}
            ></div>
          </div>
        </div>


        <div className="relative z-10 text-center space-y-8">
          {/* Main Loading Animation */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto relative">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-4 border-green-200/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-400 border-t-transparent rounded-full animate-spin shadow-lg shadow-green-400/30"></div>
              
              {/* Middle Ring */}
              <div 
                className="absolute inset-3 border-2 border-green-300/40 border-b-transparent rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
              
              {/* Inner Core */}
              <div className="absolute inset-6 bg-green-400/20 rounded-full animate-pulse shadow-inner">
                <div className="w-full h-full bg-gradient-to-r from-green-400/30 to-green-300/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              </div>


              {/* Orbiting Dots */}
              <div className="absolute inset-0">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full animate-spin shadow-lg shadow-green-400/50"
                    style={{
                      top: '50%',
                      left: '50%',
                      transformOrigin: `${20 + i * 8}px 0`,
                      animationDuration: `${2 + i * 0.5}s`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>


            {/* Pulsing Hexagon */}
            <div className="absolute -top-4 -right-4 w-8 h-8 opacity-60">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-green-400 animate-pulse">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" stroke="currentColor" strokeWidth="2" fill="rgba(34, 197, 94, 0.1)"/>
              </svg>
            </div>
          </div>


          {/* Text Animation */}
          <div className="space-y-4">
            <div className="relative">
              <div className="text-green-400 text-3xl font-mono font-bold tracking-wider animate-pulse">
                NEURAL LINK INITIALIZING
              </div>
              <div className="absolute -inset-1 bg-green-400/20 blur-xl -z-10 animate-pulse"></div>
            </div>
            
            <div className="space-y-2">
              <div className="text-green-300/80 text-sm font-mono animate-pulse" style={{ animationDelay: '0.5s' }}>
                Fetching agent configuration...
              </div>
              <div className="text-green-300/60 text-xs font-mono animate-pulse" style={{ animationDelay: '1s' }}>
                Synchronizing neural pathways...
              </div>
              <div className="text-green-300/40 text-xs font-mono animate-pulse" style={{ animationDelay: '1.5s' }}>
                Agent #{agentId} coming online...
              </div>
              {error && (
                <div className="text-red-400/80 text-xs font-mono animate-pulse" style={{ animationDelay: '2s' }}>
                  Warning: {error}
                </div>
              )}
            </div>


            {/* Progress Bars */}
            <div className="space-y-2 mt-8">
              {['DATABASE', 'NEURAL-NET', 'CAPABILITIES'].map((system, index) => (
                <div key={system} className="flex items-center justify-center space-x-3">
                  <span className="text-green-400/70 text-xs font-mono w-20 text-right">{system}</span>
                  <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full animate-pulse"
                      style={{
                        width: `${60 + (index * 15)}%`,
                        animation: `loadBar ${2 + index * 0.5}s ease-in-out infinite`
                      }}
                    ></div>
                  </div>
                  <span className="text-green-400/50 text-xs font-mono">{60 + (index * 15)}%</span>
                </div>
              ))}
            </div>


            {/* Matrix Code Effect */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16">
              <div className="flex space-x-1 opacity-30">
                {['1', '0', '1', '1', '0', '1', '0'].map((digit, i) => (
                  <span 
                    key={i}
                    className="text-green-400 text-xs font-mono animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>


        <style jsx>{`
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          
          @keyframes loadBar {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }


  if (!agentDetails) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-red-400">
          <div className="text-2xl font-mono mb-4">⚠️ SYSTEM ERROR ⚠️</div>
          <div className="text-lg mb-2">Failed to load agent</div>
          <div className="text-sm opacity-60">{error || "Unknown error occurred"}</div>
        </div>
      </div>
    );
  }


  const isOnline = !error;


  return (
    <div className="h-[90vh] bg-black text-green-400 flex flex-col relative overflow-hidden font-mono">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.05)_0%,transparent_70%)]"></div>
        </div>


        {/* Animated circuit lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-green-500/30 to-transparent animate-pulse"></div>
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-green-500/20 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>


      {/* Header */}
<div className="relative z-10 bg-black/90 backdrop-blur-xl border-b-2 border-green-500/50 shadow-lg shadow-green-500/20">
  <div className="max-w-6xl mx-auto px-6 py-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="p-1 rounded-lg bg-black/80 border-2 border-green-500/50 hover:border-green-400 hover:bg-green-500/10 transition-all duration-300 group"
        >
          <svg
            className="w-5 h-5 text-green-400 group-hover:translate-x-[-2px] transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>


        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg border-2 border-green-400/70 shadow-lg shadow-green-400/30 bg-black/80 flex items-center justify-center">
              <div className="w-5 h-5 bg-green-400 rounded animate-pulse"></div>
            </div>
          </div>


          <div>
            <h1 className="text-lg font-bold text-green-400 tracking-wider">
              {agentDetails.name.toUpperCase()}
            </h1>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-300/70">
                AI Assistant
              </span>
            </div>
          </div>
        </div>
      </div>


      <div className="flex items-center space-x-3">
        {/* Auto-speak toggle */}
        <button
          onClick={toggleAutoSpeak}
          className={`p-2 rounded-lg border-2 transition-all duration-300 ${
            speechSettings.autoSpeak
              ? "bg-green-400/20 border-green-400 text-green-300 shadow-lg shadow-green-400/30"
              : "border-green-500/50 text-green-500 hover:border-green-400 hover:bg-green-400/10"
          }`}
          title="Toggle auto-speak"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.846l3.537-2.816a1 1 0 011.617.816zM16 10a1 1 0 01-.293.707l-2 2a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 011.414-1.414l2 2A1 1 0 0116 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Conversation Context Indicator */}
        <div className="relative inline-block text-xs text-green-200 font-mono bg-black/80 px-3 py-1 rounded-lg border-2 border-green-500/40 overflow-hidden">
          <div className="relative z-10">
            {messages.filter(m => !m.content.includes(">>> NEURAL LINK ESTABLISHED <<<")).length} Messages
          </div>
          <div className="absolute inset-0 bg-green-400/5 animate-pulse"></div>
        </div>

        {/* Capabilities Badge */}
        <div className="relative inline-block text-xs text-green-200 font-mono bg-black/80 px-3 py-1 rounded-lg border-2 border-green-500/40 overflow-hidden">
          <div className="relative z-10">
            {agentDetails.capabilities.length} Capabilities Active
          </div>
          <div className="absolute inset-0 bg-green-400/5 animate-pulse"></div>
        </div>


        <div className="relative inline-block text-xs text-green-200 font-mono bg-black/80 px-4 py-2 rounded-lg border-2 border-green-500/40 overflow-hidden sparkle">
          Powered by Zlag
        </div>


        <style jsx>{`
          .sparkle::before,
          .sparkle::after {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
              circle,
              rgba(0, 255, 128, 0.8) 1px,
              transparent 1px
            );
            background-size: 20px 20px;
            animation: twinkle 6s linear infinite;
            opacity: 0.4;
          }


          .sparkle::after {
            animation-delay: -3s;
            transform: rotate(45deg);
            opacity: 0.6;
          }


          @keyframes twinkle {
            0% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(10px, 10px);
            }
            100% {
              transform: translate(0, 0);
            }
          }
        `}</style>
      </div>
    </div>


    {/* Agent Info Panel */}
    <div className="mt-2 py-2 border-t border-green-500/20">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-green-300/70">
            <strong>Description:</strong> {agentDetails.description}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-green-400/60">Capabilities:</span>
          <div className="flex space-x-1">
            {agentDetails.capabilities.slice(0, 3).map((cap, index) => (
              <span key={index} className="px-2 py-1 bg-green-400/10 text-green-300 rounded-full text-xs">
                {cap.replace('-', ' ')}
              </span>
            ))}
            {agentDetails.capabilities.length > 3 && (
              <span className="px-2 py-1 bg-green-400/10 text-green-300 rounded-full text-xs">
                +{agentDetails.capabilities.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



      {/* Chat Messages */}
      <div className="flex-1 relative z-10 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-green-500/50">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`group relative max-w-xs md:max-w-md lg:max-w-2xl ${
                  message.type === "user" ? "ml-12" : "mr-12"
                }`}
              >
                <div
                  className={`px-6 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] border-2 ${
                    message.type === "user"
                      ? "bg-green-500/10 border-green-400/60 text-green-100 shadow-lg shadow-green-500/20"
                      : "bg-black/80 border-green-500/40 text-green-200 shadow-lg shadow-green-900/30"
                  }`}
                >
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed font-mono whitespace-pre-line">
                        {/* Render markdown-like content with basic formatting */}
                        {message.content.split('\n').map((line, index) => {
                          if (line.startsWith('# ')) {
                            return (
                              <h1 key={index} className="text-lg font-bold text-green-300 mb-2">
                                {line.substring(2)}
                              </h1>
                            );
                          } else if (line.startsWith('## ')) {
                            return (
                              <h2 key={index} className="text-base font-bold text-green-300 mb-1">
                                {line.substring(3)}
                              </h2>
                            );
                          } else if (line.startsWith('>>> ') || line.startsWith('<<< ')) {
                            return (
                              <div key={index} className="text-green-400 font-bold mb-1">
                                {line}
                              </div>
                            );
                          } else if (line.startsWith('• ') || line.startsWith('- ')) {
                            return (
                              <div key={index} className="ml-4 text-green-200 mb-1">
                                {line}
                              </div>
                            );
                          } else if (line.trim() === '') {
                            return <br key={index} />;
                          } else {
                            return (
                              <div key={index} className="mb-1">
                                {line}
                              </div>
                            );
                          }
                        })}
                      </div>
                      <div className="mt-3 text-xs text-green-400/60 font-mono">
                        [
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                        ]
                      </div>
                    </div>


                    {message.type === "agent" && (
                      <button
                        onClick={() =>
                          speakMessage(message.id, message.content)
                        }
                        className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 border ${
                          speakingMessageId === message.id
                            ? "bg-green-400/30 text-green-200 border-green-400 shadow-lg shadow-green-400/30 scale-110"
                            : "text-green-500 border-green-500/50 hover:text-green-400 hover:border-green-400 hover:bg-green-400/10 hover:scale-105"
                        }`}
                        title="Toggle speech"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.846l3.537-2.816a1 1 0 011.617.816zM16 10a1 1 0 01-.293.707l-2 2a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 011.414-1.414l2 2A1 1 0 0116 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}


          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>


      {/* Input Section */}
      <div className="relative z-10 bg-black/90 backdrop-blur-xl border-t-2 border-green-500/50 shadow-2xl">
        <div className="max-w-4xl mx-auto p-5">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setInputValue(e.target.value)
                }
                onKeyPress={handleKeyPress}
                placeholder=">>> ENTER YOUR QUERY..."
                rows={1}
                className="w-full px-6 py-4 bg-black/80 border-2 border-green-500/50 rounded-2xl text-green-300 placeholder-green-500/60 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 focus:outline-none transition-all duration-300 resize-none backdrop-blur-sm shadow-inner font-mono"
                style={{ minHeight: "56px", maxHeight: "140px" }}
                disabled={isLoading || !isOnline}
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: "1.4s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>


            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !isOnline}
              className="p-4 bg-green-500/80 text-black rounded-2xl hover:bg-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/40 focus:outline-none focus:ring-4 focus:ring-green-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none group transform hover:scale-105 active:scale-95 shadow-lg border-2 border-green-400/50"
            >
              <svg
                className="w-6 h-6 font-bold transform group-hover:translate-x-0.5 transition-transform duration-200"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>

          {/* Status indicator */}
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusDot(isOnline)} animate-pulse`}></div>
                <span className={`font-mono ${getStatusColor(isOnline)}`}>
                  {isOnline ? 'Neural networks online' : 'Connection interrupted'}
                </span>
              </div>
              
              {/* Conversation Context Status */}
              {messages.length > 1 && (
                <div className="text-green-400/60 font-mono">
                  📖 Context: {messages.filter(m => !m.content.includes(">>> NEURAL LINK ESTABLISHED <<<")).length} exchanges
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {speechSettings.autoSpeak && (
                <div className="text-green-400/60 font-mono">
                  🔊 Auto-speak enabled
                </div>
              )}
              
              {/* History Status */}
              <div className="text-green-400/40 font-mono text-xs">
                🧠 Memory active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AgentChatPage;