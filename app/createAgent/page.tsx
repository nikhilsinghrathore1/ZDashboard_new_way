"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { ethers } from "ethers";

// --- IMPORT YOUR CONTRACT INFO ---
import AgentPlatformABI from "../contracts/AgentPlatform.json";
import ERC20ABI from "../contracts/erc20_abi.json";
import { agentPlatformAddress, yourTokenAddress } from "../contracts/addresses";

// ADD THIS TYPE DEFINITION HERE
type DeploymentStatus = "idle" | "approving" | "deploying" | "saving";

// A constant for the deployment fee. You can get this from your backend or set it here.
const DEPLOYMENT_FEE = "10"; // Example: 10 ZLAG tokens

const AgentCreationPage = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deploymentStatus, setDeploymentStatus] =
    useState<DeploymentStatus>("idle");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    personality: "professional",
    responseStyle: "detailed",
    price: 10, // Fixed price - always 10 ZLAG
    isForSale: true, // Always true - all agents are buyable
  });

  // --- WAGMI HOOKS FOR DEPLOYMENT PAYMENT ---
  const {
    data: approveHash,
    writeContractAsync: approveTokens,
    isPending: isApproving,
    reset: resetApprove,
  } = useWriteContract();
  const {
    data: deployHash,
    writeContractAsync: deployAgent,
    isPending: isDeploying,
    reset: resetDeploy,
  } = useWriteContract();

  const { isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  const { isSuccess: isDeployConfirmed, isLoading: isConfirmingDeploy } =
    useWaitForTransactionReceipt({ hash: deployHash });

  // Combine all blockchain processing states
  const isBlockchainProcessing =
    isApproving || isDeploying || isConfirmingDeploy;

  // --- This useEffect triggers the deployAgent call AFTER the approval is confirmed ---
  useEffect(() => {
    if (isApprovalConfirmed) {
      setDeploymentStatus("deploying"); // ADDED this line
      console.log("✅ Approval confirmed! Now calling deployAgent...");
      const feeInWei = ethers.parseUnits(DEPLOYMENT_FEE, 18);

      //  @ts-ignore
      deployAgent({
        address: agentPlatformAddress,
        abi: AgentPlatformABI.abi,
        functionName: "deployAgent",
        args: [feeInWei],
      }).catch((err) => {
        console.error("❌ Deploy agent call failed after approval", err);
        setError("Payment failed at the deployment step. Please try again.");
        setDeploymentStatus("idle"); // CHANGED from setIsLoading(false)
      });
    }
  }, [isApprovalConfirmed, deployAgent]);

  // --- This useWatchContractEvent listens for the final success signal from the blockchain ---
  useWatchContractEvent({
    address: agentPlatformAddress,
    abi: AgentPlatformABI.abi,
    eventName: "AgentDeployed",
    onLogs(logs) {
      // Find the event log relevant to the current user
      //  @ts-ignore
      const userLog = logs.find((log) => log.args.deployer === address);
      if (userLog) {
        //  @ts-ignore
        const { agentId } = userLog.args;
        console.log(
          `✅ Event: AgentDeployed! New Agent ID: ${agentId.toString()}`
        );

        // Now that payment is fully confirmed and we have the agentId, call the backend
        handleSaveToBackend(agentId.toString());
      }
    },
  });

  // --- This function starts the blockchain payment process ---
  const handleDeployClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      setError("Please connect your wallet before creating an agent");
      return;
    }
    if (!formData.name || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    setDeploymentStatus("approving"); // CHANGED from setIsLoading(true)
    setError("");
    resetApprove();
    resetDeploy();

    try {
      console.log("1️⃣ Requesting token approval for deployment fee...");
      const feeInWei = ethers.parseUnits(DEPLOYMENT_FEE, 18);
      //  @ts-ignore
      await approveTokens({
        address: yourTokenAddress,
        abi: ERC20ABI,
        functionName: "approve",
        args: [agentPlatformAddress, feeInWei],
      });
      console.log("⏳ Approval transaction sent, waiting for confirmation...");
    } catch (err) {
      console.error("❌ Approval transaction failed to send:", err);
      setError(
        "Failed to initiate payment. Please check your wallet and try again."
      );
      setDeploymentStatus("idle"); // CHANGED from setIsLoading(false)
    }
  };

  // --- This function sends the data to your backend AFTER payment is successful ---
  const handleSaveToBackend = async (onChainAgentId: string) => {
    setDeploymentStatus("saving"); // Keep the loader active with the "saving" message
    console.log(
      `2️⃣ Saving agent (ON-CHAIN ID: ${onChainAgentId}) to backend...`
    );
    try {
      // Updated payload with agentId field name to match your expected format
      const payload = {
        name: formData.name,
        description: formData.description,
        model: "GPT-4",
        capabilities: getCapabilities(
          formData.personality,
          formData.responseStyle
        ),
        price: 10, // Fixed price - always 10 ZLAG
        isForSale: true, // Always true - all agents are buyable
        creatorWalletAddress: address,
        // Changed from onChainAgentId to agentId to match your expected format
        agentId: parseInt(onChainAgentId, 10),
      };

      const response = await fetch(
        "https://zlag-ownable-service.vercel.app/api/agents",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Backend failed to save the agent.");

      const responseData = await response.json();
      console.log("✅ Agent saved successfully to backend:", responseData);

      // Redirect using the database ID from the response
      const databaseId = responseData.agent.id;
      router.push(`/agent/${databaseId}`);
    } catch (err: any) {
      console.error("Error saving agent to backend:", err);
      setError(
        err.message ||
          "Payment succeeded, but failed to save agent data. Please contact support."
      );
      setDeploymentStatus("idle"); // CHANGED from setIsLoading(false)
    }
  };

  const personalityOptions = [
    { value: "professional", label: "Professional & Direct" },
    { value: "analytical", label: "Analytical & Logical" },
    { value: "creative", label: "Creative & Innovative" },
    { value: "supportive", label: "Supportive & Encouraging" },
    { value: "consultative", label: "Consultative & Advisory" },
    { value: "technical", label: "Technical & Precise" },
  ];

  const responseStyleOptions = [
    { value: "concise", label: "Concise & Brief" },
    { value: "detailed", label: "Detailed & Comprehensive" },
    { value: "structured", label: "Structured & Organized" },
    { value: "conversational", label: "Conversational & Engaging" },
  ];

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Function to map personality and response style to capabilities
  const getCapabilities = (personality: string, responseStyle: string) => {
    const capabilityMap: { [key: string]: string[] } = {
      professional: [
        "business-analysis",
        "strategic-planning",
        "communication",
      ],
      analytical: ["data-analysis", "research", "problem-solving"],
      creative: ["content-creation", "brainstorming", "design-thinking"],
      supportive: ["mentoring", "guidance", "motivation"],
      consultative: ["advisory", "consultation", "recommendations"],
      technical: ["coding", "debugging", "technical-documentation"],
    };

    const styleMap: { [key: string]: string[] } = {
      concise: ["summarization"],
      detailed: ["comprehensive-analysis"],
      structured: ["organization", "planning"],
      conversational: ["communication", "engagement"],
    };

    const personalityCapabilities = capabilityMap[personality] || [];
    const styleCapabilities = styleMap[responseStyle] || [];

    // Combine and deduplicate capabilities
    return Array.from(
      new Set([...personalityCapabilities, ...styleCapabilities])
    );
  };

  // const handleCreateAgent = async (e: any) => {
  //   e.preventDefault();

  //   // Check if wallet is connected
  //   if (!isConnected || !address) {
  //     setError('Please connect your wallet before creating an agent');
  //     return;
  //   }

  //   if (!formData.name || !formData.description) {
  //     setError('Please fill in all required fields');
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError('');

  //   try {
  //     // Prepare the payload according to backend expectations
  //     const payload = {
  //       name: formData.name,
  //       description: formData.description,
  //       model: "GPT-4",
  //       capabilities: getCapabilities(formData.personality, formData.responseStyle),
  //       price: 10, // Fixed price - always 10 ZLAG
  //       isForSale: true, // Always true - all agents are buyable
  //       creatorWalletAddress: address
  //     };

  //     console.log("this is the payload: ", payload);
  //     console.log('Sending payload:', payload);

  //     const response = await fetch('https://zlag-ownable-service.vercel.app/api/agents', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload)
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  //     }

  //     const responseData = await response.json();
  //     console.log('Agent created successfully:', responseData);

  //     // Handle the response structure based on the API response format
  //     // Response structure: { success: true, agent: { id: 1, ... } }
  //     if (responseData.success && responseData.agent) {
  //       const agentId = responseData.agent.id;

  //       if (agentId) {
  //         // Close modal and reset form
  //         setIsModalOpen(false);
  //         setFormData({
  //           name: '',
  //           description: '',
  //           personality: 'professional',
  //           responseStyle: 'detailed',
  //           price: 10, // Fixed price
  //           isForSale: true // Always true
  //         });

  //         // Redirect to the agent page
  //         router.push(`/agent/${agentId}`);
  //       } else {
  //         console.warn('No agent ID returned from backend');
  //         setError('Agent created but no ID returned. Please check the agents list.');
  //         setIsLoading(false);
  //       }
  //     } else {
  //       console.warn('Unexpected response format:', responseData);
  //       setError('Agent may have been created but response format was unexpected.');
  //       setIsLoading(false);
  //     }

  //   } catch (error: any) {
  //     console.error('Error creating agent:', error);
  //     setError(error.message || 'Failed to create agent. Please try again.');
  //     setIsLoading(false);
  //   }
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setError('');
  //   setFormData({
  //     name: '',
  //     description: '',
  //     personality: 'professional',
  //     responseStyle: 'detailed',
  //     price: 10, // Fixed price
  //     isForSale: true // Always true
  //   });
  // };

  // This condition now checks if you are in ANY loading state, not just 'idle'
  if (deploymentStatus !== "idle") {
    const statusMessages: { [key: string]: string } = {
      approving: "Step 1/3: Awaiting approval in your wallet...",
      deploying:
        "Step 2/3: Deploying agent to the blockchain... (This may take a moment)",
      saving: "Step 3/3: Finalizing and saving agent...",
    };

    const blockExplorerUrl = "https://sepolia.etherscan.io/tx/"; // Change if you use a different network

    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="text-center relative z-10 p-4">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto border-4 border-purple-400 border-t-transparent rounded-full animate-spin shadow-lg shadow-purple-400/50"></div>
            <div
              className="absolute inset-0 w-32 h-32 mx-auto border-2 border-purple-300 border-b-transparent rounded-full animate-spin"
              style={{ animationDelay: "150ms", animationDuration: "1.5s" }}
            ></div>
          </div>
          <div className="text-purple-300 text-xl font-medium mb-4 animate-pulse">
            {statusMessages[deploymentStatus] || "Processing..."}
          </div>
          <div className="text-purple-400 text-sm opacity-70 mt-8 space-y-2">
            {/* Show link to track the approval transaction */}
            {approveHash && (
              <div>
                <a
                  href={`${blockExplorerUrl}${approveHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Track Approval Transaction
                </a>
              </div>
            )}
            {/* Show link to track the deployment transaction */}
            {deployHash && (
              <div>
                <a
                  href={`${blockExplorerUrl}${deployHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Track Deployment Transaction
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden starfield">
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-3 bg-purple-600/20 border border-purple-400/40 rounded-full text-purple-300 text-sm font-medium mb-8">
            AI Agent Deployment System <span className="text-green-300">Beta version</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light mb-8 text-white tracking-wide">
            Autonomous Agent
            <span className="block text-purple-400 font-semibold">
              Architecture
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Deploy sophisticated AI agents with advanced AI, contextual memory,
            and adaptive learning capabilities through our
            infrastructure — currently in beta.
          </p>
        </div>

        <div className="w-full h-fit flex flex-col items-center justify-center mb-20">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-semibold text-white bg-purple-600 rounded-2xl transition-all duration-300 hover:bg-purple-500 hover:shadow-2xl hover:shadow-purple-600/30 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/20"
          >
            <span className="relative z-10 flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Initialize Agent Deployment
            </span>
          </button>

          {/* Wallet connection status */}
          {!isConnected && (
            <div className="mt-4 text-yellow-400 text-sm">
              ⚠️ Please connect your wallet to create agents
            </div>
          )}
          {isConnected && (
            <div className="mt-4 text-green-400 text-sm">
              ✅ Wallet connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          )}
        </div>

        {/* Workflow Diagram */}
        <div className="relative max-w-7xl mx-auto mb-24">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#a855f7", stopOpacity: 0.3 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#a855f7", stopOpacity: 0.8 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#a855f7", stopOpacity: 0.3 }}
                />
              </linearGradient>
            </defs>
            {/* Flow lines */}
            <path
              d="M 150 200 Q 250 150 350 200"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M 450 200 Q 550 150 650 200"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            {/* Data flow particles */}
            <circle r="3" fill="#a855f7">
              <animateMotion dur="3s" repeatCount="indefinite">
                <path d="M 150 200 Q 250 150 350 200" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#a855f7">
              <animateMotion dur="3s" repeatCount="indefinite" begin="1.5s">
                <path d="M 450 200 Q 550 150 650 200" />
              </animateMotion>
            </circle>
          </svg>

          {/* Process Nodes */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
            {[
              {
                phase: "INIT",
                title: "Neural Architecture",
                subtitle: "Configuration",
                description:
                  "Define cognitive models, behavioral patterns, and knowledge domains through advanced parameter tuning",
                metrics: [
                  "Synaptic Weight Mapping",
                  "Contextual Memory Allocation",
                  "Response Pattern Analysis",
                ],
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                ),
              },
              {
                phase: "PROC",
                title: "Personality Matrix",
                subtitle: "Calibration",
                description:
                  "Engineer behavioral algorithms with multi-dimensional personality vectors and adaptive response mechanisms",
                metrics: [
                  "Emotional Intelligence Mapping",
                  "Communication Protocol Setup",
                  "Adaptive Learning Parameters",
                ],
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
              },
              {
                phase: "DEPLOY",
                title: "System Integration",
                subtitle: "Activation",
                description:
                  "Initialize agent deployment with real-time monitoring, performance analytics, and continuous optimization loops",
                metrics: [
                  "Real-time Performance Monitoring",
                  "Conversational Flow Analytics",
                  "Adaptive Optimization Cycles",
                ],
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
              },
            ].map((node, index) => (
              <div key={index} className="relative group">
                <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 h-full transition-all duration-500 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-600/20 hover:transform hover:scale-[1.02]">
                  {/* Phase Indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-4 py-2 bg-purple-600/20 border border-purple-400/40 rounded-full">
                      <span className="text-purple-300 text-xs font-semibold">
                        {node.phase}
                      </span>
                    </div>
                    <div className="text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      {node.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {node.title}
                  </h3>
                  <div className="text-purple-300 text-sm font-medium mb-6 opacity-80">
                    {node.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-8">
                    {node.description}
                  </p>

                  {/* Metrics */}
                  <div className="space-y-3">
                    {node.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-xs text-gray-400"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-60"></div>
                        {metric}
                      </div>
                    ))}
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-8 pt-6 border-t border-purple-500/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Processing Stage</span>
                      <span className="text-purple-400 font-medium">
                        {String(index + 1).padStart(2, "0")}/03
                      </span>
                    </div>
                    <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${((index + 1) / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced CTA Section */}
        <div className="text-center">
          {/* Technical Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
            {[
              { label: "Response Time", value: "<50ms" },
              { label: "Accuracy Rate", value: "99.7%" },
              { label: "Neural Paths", value: "10M+" },
              { label: "Uptime SLA", value: "99.9%" },
            ].map((spec, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
              >
                <div className="text-purple-400 text-2xl font-bold">
                  {spec.value}
                </div>
                <div className="text-gray-400 text-sm mt-2">{spec.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-gray-900/90 border border-purple-500/50 rounded-2xl shadow-2xl shadow-purple-600/20 w-full max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur-sm">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-purple-400">
                  Neural Configuration
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-purple-400 text-3xl transition-colors duration-200"
                >
                  ×
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleDeployClick} className="space-y-8">
                {/* Agent Identity */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Agent Designation *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-black/50 border border-purple-500/50 rounded-xl text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200"
                      placeholder="Enter agent designation"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Core Function & Purpose *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-4 bg-black/50 border border-purple-500/50 rounded-xl text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200 resize-none"
                      placeholder="Define the agent's primary function, role, and operational scope..."
                      required
                    />
                  </div>

                  {/* Fixed Price Display */}
                  <div className="p-4 bg-purple-600/10 border border-purple-500/30 rounded-xl">
                    <div className="text-sm font-medium text-purple-300 mb-2">
                      Agent Price:
                    </div>
                    <div className="text-2xl font-bold text-white">10 ZLAG</div>
                    <div className="text-xs text-gray-400">
                      Fixed pricing - all agents are available for purchase
                    </div>
                  </div>
                </div>

                {/* Behavioral Parameters */}
                <div className="space-y-6">
                  <div className="text-sm font-medium text-purple-300 uppercase tracking-wide">
                    Behavioral Parameters
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Communication Protocol
                    </label>
                    <select
                      name="personality"
                      value={formData.personality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-black/50 border border-purple-500/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200"
                    >
                      {personalityOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-black"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Response Architecture
                    </label>
                    <select
                      name="responseStyle"
                      value={formData.responseStyle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-black/50 border border-purple-500/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200"
                    >
                      {responseStyleOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-black"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preview of selected capabilities */}
                <div className="p-6 bg-purple-600/10 border border-purple-500/30 rounded-xl">
                  <div className="text-sm font-medium text-purple-300 mb-4">
                    Generated Capabilities:
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {getCapabilities(
                      formData.personality,
                      formData.responseStyle
                    ).map((capability, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="p-6 bg-gray-800/50 border border-gray-600/30 rounded-xl">
                  <div className="text-sm font-medium text-gray-300 mb-2">
                    Creator Wallet:
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {isConnected ? address : "Please connect wallet"}
                  </div>
                </div>

                <div className="pt-8 border-t border-purple-500/30">
                  <button
                    type="submit"
                    // The button is disabled if the process has started, or if the form is incomplete, or wallet not connected.
                    disabled={
                      deploymentStatus !== "idle" ||
                      !formData.name ||
                      !formData.description ||
                      !isConnected
                    }
                    className="w-full px-8 py-5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-600/30 focus:outline-none focus:ring-4 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                  >
                    {/* @ts-ignore */}
                    {deploymentStatus === "approving" ||deploymentStatus === "deploying" ? (
                      <>
                        <div className="w-6 h-6 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Payment...
                      </>
                    ) : // @ts-ignore
                    deploymentStatus === "saving" ? (
                      <>
                        <div className="w-6 h-6 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving to Backend...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Deploy Neural Agent
                      </>
                    )}
                  </button>

                  <div className="mt-6 text-center">
                    <div className="text-xs text-gray-500">
                      Agent will be initialized with enterprise-grade security
                      protocols
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CSS for starfield */}
      <style jsx>{`
        /* Starfield CSS */
        .starfield::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
              2px 2px at 20px 30px,
              #fff,
              transparent
            ),
            radial-gradient(
              2px 2px at 40px 70px,
              rgba(255, 255, 255, 0.8),
              transparent
            ),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(
              1px 1px at 130px 80px,
              rgba(255, 255, 255, 0.6),
              transparent
            ),
            radial-gradient(2px 2px at 160px 30px, #fff, transparent),
            radial-gradient(
              1px 1px at 200px 90px,
              rgba(255, 255, 255, 0.7),
              transparent
            ),
            radial-gradient(2px 2px at 240px 50px, #fff, transparent),
            radial-gradient(
              1px 1px at 280px 120px,
              rgba(255, 255, 255, 0.8),
              transparent
            ),
            radial-gradient(1px 1px at 320px 20px, #fff, transparent),
            radial-gradient(
              2px 2px at 360px 100px,
              rgba(255, 255, 255, 0.6),
              transparent
            ),
            radial-gradient(1px 1px at 400px 60px, #fff, transparent),
            radial-gradient(
              2px 2px at 440px 140px,
              rgba(255, 255, 255, 0.9),
              transparent
            ),
            radial-gradient(1px 1px at 480px 80px, #fff, transparent),
            radial-gradient(
              2px 2px at 520px 30px,
              rgba(255, 255, 255, 0.7),
              transparent
            ),
            radial-gradient(1px 1px at 560px 110px, #fff, transparent),
            radial-gradient(
              2px 2px at 600px 70px,
              rgba(255, 255, 255, 0.8),
              transparent
            );
          background-repeat: repeat;
          background-size: 640px 160px;
          animation: twinkle 0.8s infinite alternate;
        }

        .starfield::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
              3px 3px at 30px 50px,
              #a855f7,
              transparent
            ),
            radial-gradient(
              2px 2px at 80px 100px,
              rgba(168, 85, 247, 0.6),
              transparent
            ),
            radial-gradient(3px 3px at 150px 25px, #a855f7, transparent),
            radial-gradient(
              2px 2px at 220px 90px,
              rgba(168, 85, 247, 0.8),
              transparent
            ),
            radial-gradient(3px 3px at 290px 140px, #a855f7, transparent),
            radial-gradient(
              2px 2px at 350px 40px,
              rgba(168, 85, 247, 0.7),
              transparent
            ),
            radial-gradient(3px 3px at 420px 110px, #a855f7, transparent),
            radial-gradient(
              2px 2px at 480px 20px,
              rgba(168, 85, 247, 0.9),
              transparent
            ),
            radial-gradient(3px 3px at 540px 80px, #a855f7, transparent),
            radial-gradient(
              2px 2px at 600px 130px,
              rgba(168, 85, 247, 0.6),
              transparent
            );
          background-repeat: repeat;
          background-size: 640px 160px;
          animation: twinkle 1.2s infinite alternate;
          animation-delay: 0.4s;
        }

        @keyframes twinkle {
          0% {
            opacity: 0.2;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentCreationPage;
