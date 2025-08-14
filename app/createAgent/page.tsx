'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AgentCreationPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: 'professional',
    responseStyle: 'detailed'
  });

  const personalityOptions = [
    { value: 'professional', label: 'Professional & Direct' },
    { value: 'analytical', label: 'Analytical & Logical' },
    { value: 'creative', label: 'Creative & Innovative' },
    { value: 'supportive', label: 'Supportive & Encouraging' },
    { value: 'consultative', label: 'Consultative & Advisory' },
    { value: 'technical', label: 'Technical & Precise' }
  ];

  const responseStyleOptions = [
    { value: 'concise', label: 'Concise & Brief' },
    { value: 'detailed', label: 'Detailed & Comprehensive' },
    { value: 'structured', label: 'Structured & Organized' },
    { value: 'conversational', label: 'Conversational & Engaging' }
  ];

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Function to map personality and response style to capabilities
  const getCapabilities = (personality: string, responseStyle: string) => {
    const capabilityMap: { [key: string]: string[] } = {
      'professional': ['business-analysis', 'strategic-planning', 'communication'],
      'analytical': ['data-analysis', 'research', 'problem-solving'],
      'creative': ['content-creation', 'brainstorming', 'design-thinking'],
      'supportive': ['mentoring', 'guidance', 'motivation'],
      'consultative': ['advisory', 'consultation', 'recommendations'],
      'technical': ['coding', 'debugging', 'technical-documentation']
    };

    const styleMap: { [key: string]: string[] } = {
      'concise': ['summarization'],
      'detailed': ['comprehensive-analysis'],
      'structured': ['organization', 'planning'],
      'conversational': ['communication', 'engagement']
    };

    const personalityCapabilities = capabilityMap[personality] || [];
    const styleCapabilities = styleMap[responseStyle] || [];
    
    // Combine and deduplicate capabilities
    return Array.from(new Set([...personalityCapabilities, ...styleCapabilities]));
  };

  const handleCreateAgent = async (e: any) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Prepare the payload according to backend expectations
      const payload = {
        name: formData.name,
        description: formData.description,
        model: "gemini-pro", // Default model as specified
        capabilities: getCapabilities(formData.personality, formData.responseStyle)
      };

    console.log("this is the payload: " , payload); 
      console.log('Sending payload:', payload);

      const response = await fetch('http://localhost:4000/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Agent created successfully:', responseData);
      
      // Only redirect after successful database storage
      // Assuming the backend returns an ID field
      const agentId = responseData.data.id || responseData.data._id || responseData.data.agentId;
      
      if (agentId) {
        router.push(`/agent/${agentId}`);
      } else {
        // If no ID is returned, you might want to handle this differently
        console.warn('No agent ID returned from backend');
        router.push('/agents'); // Redirect to agents list page
      }

    } catch (error: any) {
      console.error('Error creating agent:', error);
      setError(error.message || 'Failed to create agent. Please try again.');
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setFormData({
      name: '',
      description: '',
      personality: 'professional',
      responseStyle: 'detailed'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto border-4 border-green-400 border-t-transparent rounded-full animate-spin shadow-lg shadow-green-400/50"></div>
            <div className="absolute inset-0 w-32 h-32 mx-auto border-2 border-green-300 border-b-transparent rounded-full animate-spin animation-delay-150 shadow-md shadow-green-300/30"></div>
          </div>
          <div className="text-green-400 text-xl font-mono mb-4 animate-pulse">
            DEPLOYING AGENT...
          </div>
          <div className="text-green-300 text-sm font-mono opacity-70">
            Storing neural pathways to database...
          </div>
        </div>
        <style jsx>{`
          .animation-delay-150 {
            animation-delay: 150ms;
            animation-duration: 1.5s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-black"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 0%, transparent 50%)',
        }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 text-sm font-mono mb-6">
            AI Agent DEPLOYMENT SYSTEM
          </div>
          <h1 className="text-4xl md:text-6xl font-light mb-6 text-white tracking-wide">
            Autonomous Agent
            <span className="block text-green-400 font-bold">Architecture</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Deploy sophisticated AI agents with advanced AI, contextual memory, 
            and adaptive learning capabilities through our enterprise-grade infrastructure.
          </p>
        </div>

        <div className='w-full h-fit flex flex-col items-center justify-center'>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-black bg-green-400 rounded-lg transition-all duration-300 hover:bg-green-300 hover:shadow-lg hover:shadow-green-400/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-400/20"
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              INITIALIZE AGENT DEPLOYMENT
            </span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-300 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </button>
        </div>

        {/* Workflow Diagram */}
        <div className="relative max-w-6xl mx-auto mb-20">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.3}} />
                <stop offset="50%" style={{stopColor: '#10b981', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: '#10b981', stopOpacity: 0.3}} />
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
              style={{animationDelay: '0.5s'}}
            />
            {/* Data flow particles */}
            <circle r="3" fill="#10b981">
              <animateMotion dur="3s" repeatCount="indefinite">
                <path d="M 150 200 Q 250 150 350 200" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#10b981">
              <animateMotion dur="3s" repeatCount="indefinite" begin="1.5s">
                <path d="M 450 200 Q 550 150 650 200" />
              </animateMotion>
            </circle>
          </svg>

          {/* Process Nodes */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
            {[
              {
                phase: "INIT",
                title: "Neural Architecture",
                subtitle: "Configuration",
                description: "Define cognitive models, behavioral patterns, and knowledge domains through advanced parameter tuning",
                metrics: ["Synaptic Weight Mapping", "Contextual Memory Allocation", "Response Pattern Analysis"],
                icon: (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                )
              },
              {
                phase: "PROC",
                title: "Personality Matrix",
                subtitle: "Calibration",
                description: "Engineer behavioral algorithms with multi-dimensional personality vectors and adaptive response mechanisms",
                metrics: ["Emotional Intelligence Mapping", "Communication Protocol Setup", "Adaptive Learning Parameters"],
                icon: (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                )
              },
              {
                phase: "DEPLOY",
                title: "System Integration",
                subtitle: "Activation",
                description: "Initialize agent deployment with real-time monitoring, performance analytics, and continuous optimization loops",
                metrics: ["Real-time Performance Monitoring", "Conversational Flow Analytics", "Adaptive Optimization Cycles"],
                icon: (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                )
              }
            ].map((node, index) => (
              <div key={index} className="relative group">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-8 h-full transition-all duration-500 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-400/10 hover:transform hover:scale-[1.02]">
                  {/* Phase Indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-3 py-1 bg-green-400/10 border border-green-400/30 rounded-full">
                      <span className="text-green-400 text-xs font-mono font-bold">{node.phase}</span>
                    </div>
                    <div className="text-green-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      {node.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2">{node.title}</h3>
                  <div className="text-green-300 text-sm font-medium mb-4 opacity-80">{node.subtitle}</div>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">{node.description}</p>
                  
                  {/* Metrics */}
                  <div className="space-y-2">
                    {node.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 opacity-60"></div>
                        {metric}
                      </div>
                    ))}
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-6 pt-4 border-t border-green-500/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Processing Stage</span>
                      <span className="text-green-400 font-mono">{String(index + 1).padStart(2, '0')}/03</span>
                    </div>
                    <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
                        style={{width: `${((index + 1) / 3) * 100}%`}}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-center">
            {[
              { label: "Response Time", value: "<50ms" },
              { label: "Accuracy Rate", value: "99.7%" },
              { label: "Neural Paths", value: "10M+" },
              { label: "Uptime SLA", value: "99.9%" }
            ].map((spec, index) => (
              <div key={index} className="bg-gray-900/30 backdrop-blur-sm border border-green-500/20 rounded-lg p-4">
                <div className="text-green-400 text-lg font-bold font-mono">{spec.value}</div>
                <div className="text-gray-500 text-xs">{spec.label}</div>
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
            onClick={closeModal}
          ></div>
          
          <div className="relative bg-gray-900 border border-green-500/50 rounded-lg shadow-2xl shadow-green-400/20 w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-400">Neural Configuration</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-green-400 text-2xl transition-colors duration-200"
                >
                  ×
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateAgent} className="space-y-6">
                {/* Agent Identity */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Agent Designation *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-green-500/50 rounded-lg text-white placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-200"
                      placeholder="Enter agent designation"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Core Function & Purpose *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-black border border-green-500/50 rounded-lg text-white placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-200 resize-none"
                      placeholder="Define the agent's primary function, role, and operational scope..."
                      required
                    />
                  </div>
                </div>

                {/* Behavioral Parameters */}
                <div className="space-y-4">
                  <div className="text-sm font-medium text-green-300 uppercase tracking-wide">Behavioral Parameters</div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Communication Protocol
                    </label>
                    <select
                      name="personality"
                      value={formData.personality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-green-500/50 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-200"
                    >
                      {personalityOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-black">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Response Architecture
                    </label>
                    <select
                      name="responseStyle"
                      value={formData.responseStyle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-green-500/50 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-200"
                    >
                      {responseStyleOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-black">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preview of selected capabilities */}
                <div className="p-4 bg-green-400/5 border border-green-500/20 rounded-lg">
                  <div className="text-sm font-medium text-green-300 mb-2">Generated Capabilities:</div>
                  <div className="flex flex-wrap gap-2">
                    {getCapabilities(formData.personality, formData.responseStyle).map((capability, index) => (
                      <span key={index} className="px-2 py-1 bg-green-400/10 text-green-300 text-xs rounded-full">
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-green-500/20">
                  <button
                    type="submit"
                    disabled={!formData.name || !formData.description || isLoading}
                    className="w-full px-6 py-4 bg-green-400 text-black font-semibold rounded-lg hover:bg-green-300 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/30 focus:outline-none focus:ring-4 focus:ring-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        DEPLOYING...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        DEPLOY NEURAL AGENT
                      </>
                    )}
                  </button>
                  
                  <div className="mt-4 text-center">
                    <div className="text-xs text-gray-500">
                      Agent will be initialized with enterprise-grade security protocols
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )} 
    </div>
  );
};

export default AgentCreationPage;
