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

interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

const AgentChatPage: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agentDetails, setAgentDetails] = useState<AgentDetails | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoadingAgent, setIsLoadingAgent] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  // Rate limiting states
  const [requestCount, setRequestCount] = useState<number>(0);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string>("");

  // Check rate limit on component mount
  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem('agentChatRequestCount') || '0');
    const requestTimestamp = localStorage.getItem('agentChatRequestTimestamp');
    
    if (requestTimestamp) {
      const now = new Date().getTime();
      const requestTime = parseInt(requestTimestamp);
      const timeDiff = now - requestTime;
      
      // Reset after 24 hours (86400000 ms)
      const RESET_DURATION = 24 * 60 * 60 * 1000; // 24 hours
      
      if (timeDiff < RESET_DURATION) {
        if (storedCount >= 10) {
          setIsRateLimited(true);
          setRequestCount(storedCount);
          const remainingTime = Math.ceil((RESET_DURATION - timeDiff) / (60 * 60 * 1000)); // in hours
          setRateLimitMessage(`Rate limit exceeded (${storedCount}/10). Try again in ${remainingTime} hours.`);
        } else {
          setRequestCount(storedCount);
        }
      } else {
        // Reset if 24 hours have passed
        localStorage.removeItem('agentChatRequestCount');
        localStorage.removeItem('agentChatRequestTimestamp');
        setRequestCount(0);
        setIsRateLimited(false);
      }
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

        const response = await fetch(
          `https://create-agent-backend.vercel.app/agents/${agentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Agent not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Agent details fetched:", responseData);

        if (responseData.success && responseData.data) {
          setAgentDetails(responseData.data);

          // Create a personalized welcome message based on agent data
          const welcomeMessage: Message = {
            id: Date.now(),
            type: "agent",
            content: `>>> NEURAL LINK ESTABLISHED <<<\n\nGreetings, user. I am ${responseData.data.name.toUpperCase()}, ${
              responseData.data.description
            }.\n\nMy specialized capabilities include:\n${responseData.data.capabilities
              .map((cap: string) => `• ${cap.replace("-", " ").toUpperCase()}`)
              .join(
                "\n"
              )}\n\nPowered by ${responseData.data.model.toUpperCase()} neural architecture, my systems are now online and ready to assist. How may I process your request today?`,
            timestamp: new Date(),
          };

          setMessages([welcomeMessage]);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        console.error("Error fetching agent details:", error);
        setError(error.message || "Failed to load agent details");

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
  }, [agentId]);

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
      .filter((msg) => !msg.content.includes(">>> NEURAL LINK ESTABLISHED <<<"))
      .map((msg) => ({
        role: msg.type === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      }));
  };

  // Generate dynamic prompt with chat history context
  const generateDynamicPromptWithHistory = (
    userMessage: string,
    agentDetails: AgentDetails,
    chatHistory: any
  ): string => {
    const capabilitiesText = agentDetails.capabilities
      .map((cap) => cap.replace("-", " ").toLowerCase())
      .join(", ");

    const systemPrompt = `You are ${agentDetails.name}, ${agentDetails.description}.

Specialized capabilities: ${capabilitiesText}

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
`;

    return systemPrompt;
  };

  // New function to call the actual chat API with history
  const getAgentResponse = async (userMessage: string): Promise<string> => {
    try {
      if (!agentDetails) {
        throw new Error("Agent details not available");
      }

      // Build chat history from current messages
      const chatHistory = buildChatHistory(messages);
      console.log("this is the chat history ", chatHistory);
      const dynamicPrompt = generateDynamicPromptWithHistory(
        userMessage,
        agentDetails,
        JSON.stringify(chatHistory)
      );

      console.log("Sending request to chat API with history:", {
        prompt: dynamicPrompt,
        history: chatHistory,
      });

      const requestBody = {
        prompt: dynamicPrompt,
      };

      const response = await fetch(
        "https://create-agent-backend.vercel.app/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Chat API error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Chat API response:", responseData);

      if (
        responseData.success &&
        responseData.data &&
        responseData.data.response
      ) {
        return responseData.data.response;
      } else {
        throw new Error("Invalid response format from chat API");
      }
    } catch (error: any) {
      console.error("Error calling chat API:", error);

      // Fallback response in case of API failure
      return `>>> SYSTEM ERROR <<<\n\nI apologize, but I'm experiencing technical difficulties connecting to my neural networks. This could be due to:\n\n• Network connectivity issues\n• Server maintenance\n• API endpoint unavailable\n\nError details: ${error.message}\n\nPlease try again in a moment. My systems are designed to self-repair and should be back online shortly.`;
    }
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || isLoading || isRateLimited) return;

    // Check rate limit before sending
    if (requestCount >= 10) {
      setIsRateLimited(true);
      setRateLimitMessage(`Rate limit exceeded (${requestCount}/10). Try again in 24 hours.`);
      return;
    }

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

      // Update request count and store in localStorage
      const newCount = requestCount + 1;
      setRequestCount(newCount);
      localStorage.setItem('agentChatRequestCount', newCount.toString());
      localStorage.setItem('agentChatRequestTimestamp', new Date().getTime().toString());

      // Check if we've hit the limit
      if (newCount >= 10) {
        setIsRateLimited(true);
        setRateLimitMessage(`Rate limit reached (${newCount}/10). You can chat again in 24 hours.`);
      }

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
      }, typingDelay);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setIsTyping(false);
      setIsLoading(false);

      // Add error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: "agent",
        content:
          ">>> CONNECTION ERROR <<<\n\nI apologize, but I'm currently experiencing technical difficulties. Please try again in a moment.",
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

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? "text-purple-400" : "text-red-400";
  };

  const getStatusDot = (isOnline: boolean) => {
    return isOnline
      ? "bg-purple-400 shadow-purple-400/50"
      : "bg-red-400 shadow-red-400/50";
  };

  const TypingIndicator: React.FC = () => (
    <div className="flex justify-start">
      <div className="max-w-xs md:max-w-md lg:max-w-lg px-6 py-4 rounded-2xl bg-black/80 backdrop-blur-sm border border-purple-500/40 shadow-lg shadow-purple-500/20">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.4s",
                }}
              />
            ))}
          </div>
          <span className="text-purple-400 text-sm font-mono">
            {agentDetails?.name || "NEURAL-AI"} is processing...
          </span>
        </div>
      </div>
    </div>
  );

  // Minimalistic Loading Screen
  if (isLoadingAgent) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Simple loading animation */}
          <div className="relative">
            <div className="w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-2 border-purple-200/10 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-purple-400 border-t-transparent rounded-full animate-spin shadow-lg shadow-purple-400/30"></div>
            </div>
          </div>

          {/* Simple text */}
          <div className="space-y-2">
            <div className="text-purple-400 text-xl font-mono font-medium">
              Loading Agent
            </div>
            {error && (
              <div className="text-red-400/80 text-sm font-mono">{error}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!agentDetails) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-red-400">
          <div className="text-2xl font-mono mb-4">⚠️ SYSTEM ERROR ⚠️</div>
          <div className="text-lg mb-2">Failed to load agent</div>
          <div className="text-sm opacity-60">
            {error || "Unknown error occurred"}
          </div>
        </div>
      </div>
    );
  }

  const isOnline = !error;

  return (
    <div className="h-[90vh] bg-black text-purple-400 flex flex-col relative overflow-hidden font-mono">
      {/* Minimalistic Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute inset-0 bg-black z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.03)_0%,transparent_70%)]"></div>
        </div>
      </div>

      {/* Small rate limit notification */}
      {isRateLimited && (
        <div className="relative z-20 text-center py-2">
          <span className="text-red-400 text-xs bg-red-900/30 px-3 py-1 rounded-full border border-red-500/30">
            ⚠️ {rateLimitMessage}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 bg-black/90 backdrop-blur-xl border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg bg-black/80 border border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 text-purple-400 group-hover:translate-x-[-2px] transition-transform duration-200"
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
                  <div className="w-10 h-10 rounded-lg border border-purple-400/70 shadow-lg shadow-purple-400/20 bg-black/80 flex items-center justify-center hover:shadow-purple-400/40 transition-all duration-300">
                    <div className="w-5 h-5 bg-purple-400 rounded animate-pulse"></div>
                  </div>
                </div>

                <div>
                  <h1 className="text-lg font-bold text-purple-400 tracking-wider">
                    {agentDetails.name.toUpperCase()}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-purple-300/70">AI Assistant</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Request Counter */}
              <div className="relative inline-block text-xs text-purple-200 font-mono bg-black/80 px-3 py-1 rounded-lg border border-purple-500/40 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                <div className="relative z-10">
                  {requestCount}/10 Requests Used
                </div>
              </div>

              {/* Conversation Context Indicator */}
              <div className="relative inline-block text-xs text-purple-200 font-mono bg-black/80 px-3 py-1 rounded-lg border border-purple-500/40 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                <div className="relative z-10">
                  {
                    messages.filter(
                      (m) =>
                        !m.content.includes(">>> NEURAL LINK ESTABLISHED <<<")
                    ).length
                  }{" "}
                  Messages
                </div>
              </div>

              {/* Capabilities Badge */}
              <div className="relative inline-block text-xs text-purple-200 font-mono bg-black/80 px-3 py-1 rounded-lg border border-purple-500/40 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                <div className="relative z-10">
                  {agentDetails.capabilities.length} Capabilities Active
                </div>
              </div>

              <div className="relative inline-block text-xs text-purple-200 font-mono bg-black/80 px-4 py-2 rounded-lg border border-purple-500/40 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                Powered by Zlag
              </div>
            </div>
          </div>

          {/* Agent Info Panel */}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 relative z-10 overflow-y-auto px-4 py-6 scrollbar-thin scroearllbar-track-gray-900 scrollbar-thumb-purple-500/50">
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
                  className={`px-6 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] border ${
                    message.type === "user"
                      ? "bg-purple-500/10 border-purple-400/60 text-purple-100 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                      : "bg-black/80 border-purple-500/40 text-purple-200 shadow-lg shadow-purple-900/30 hover:border-purple-400 hover:shadow-purple-500/20"
                  }`}
                >
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed font-mono whitespace-pre-line">
                        {/* Render markdown-like content with basic formatting */}
                        {message.content.split("\n").map((line, index) => {
                          if (line.startsWith("# ")) {
                            return (
                              <h1
                                key={index}
                                className="text-lg font-bold text-purple-300 mb-2"
                              >
                                {line.substring(2)}
                              </h1>
                            );
                          } else if (line.startsWith("## ")) {
                            return (
                              <h2
                                key={index}
                                className="text-base font-bold text-purple-300 mb-1"
                              >
                                {line.substring(3)}
                              </h2>
                            );
                          } else if (
                            line.startsWith(">>> ") ||
                            line.startsWith("<<< ")
                          ) {
                            return (
                              <div
                                key={index}
                                className="text-purple-400 font-bold mb-1"
                              >
                                {line}
                              </div>
                            );
                          } else if (
                            line.startsWith("• ") ||
                            line.startsWith("- ")
                          ) {
                            return (
                              <div
                                key={index}
                                className="ml-4 text-purple-200 mb-1"
                              >
                                {line}
                              </div>
                            );
                          } else if (line.trim() === "") {
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
                      <div className="mt-3 text-xs text-purple-400/60 font-mono">
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
      <div className="relative z-10 bg-black/90 backdrop-blur-xl border-t border-purple-500/30">
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
                placeholder={isRateLimited ? ">>> RATE LIMIT EXCEEDED..." : ">>> ENTER YOUR QUERY..."}
                rows={1}
                className="w-full px-6 py-4 bg-black/80 border border-purple-500/50 rounded-2xl text-purple-300 placeholder-purple-500/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 resize-none backdrop-blur-sm shadow-inner font-mono hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20"
                style={{ minHeight: "56px", maxHeight: "140px" }}
                disabled={isLoading || !isOnline || isRateLimited}
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
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
              disabled={!inputValue.trim() || isLoading || !isOnline || isRateLimited}
              className="p-4 bg-purple-500/80 text-white rounded-2xl hover:bg-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/40 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none group transform hover:scale-105 active:scale-95 shadow-lg border border-purple-400/50"
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
                <div
                  className={`w-2 h-2 rounded-full ${getStatusDot(
                    isOnline && !isRateLimited
                  )} animate-pulse`}
                ></div>
                <span className={`font-mono ${getStatusColor(isOnline && !isRateLimited)}`}>
                  {isRateLimited 
                    ? "Rate limited" 
                    : isOnline
                    ? "Neural networks online"
                    : "Connection interrupted"}
                </span>
              </div>

              {/* Conversation Context Status */}
              {messages.length > 1 && (
                <div className="text-purple-400/60 font-mono">
                  📖 Context:{" "}
                  {
                    messages.filter(
                      (m) =>
                        !m.content.includes(">>> NEURAL LINK ESTABLISHED <<<")
                    ).length
                  }{" "}
                  exchanges
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Request Counter */}
              <div className="text-purple-400/40 font-mono text-xs">
                🔢 {requestCount}/10 requests used
              </div>

              {/* History Status */}
              <div className="text-purple-400/40 font-mono text-xs">
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