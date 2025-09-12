"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import axios from 'axios';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import Extras from './data/Extras';
import Extra from './data/Extra';
import { sandpackDark } from "@codesandbox/sandpack-themes";

// Constants to prevent recreating objects
const RESET_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEYS = {
  REQUEST_USED: 'codeGenRequestUsed',
  REQUEST_TIMESTAMP: 'codeGenRequestTimestamp'
} as const;

// Memoized components to prevent unnecessary re-renders
const StarField = memo(() => {
  const stars = useMemo(() => {
    const starArray = [];
    
    // Regular stars
    for (let i = 0; i < 150; i++) {
      starArray.push({
        id: i,
        type: 'regular',
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 3,
        animationDuration: 2 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }
    
    // Large stars
    for (let i = 0; i < 30; i++) {
      starArray.push({
        id: `large-${i}`,
        type: 'large',
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 4,
        animationDuration: 3 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.5,
      });
    }
    
    return starArray;
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full animate-pulse ${
            star.type === 'large' ? 'w-2 h-2 bg-purple-300' : 'w-1 h-1 bg-white'
          }`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.animationDelay}s`,
            animationDuration: `${star.animationDuration}s`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
});
StarField.displayName = 'StarField';

const RateLimitBanner = memo(({ message }: { message: string }) => (
  <div className="mb-2 text-center">
    <span className="text-red-400 text-xs bg-red-900/30 px-3 py-1 rounded-full border border-red-500/30">
      ⚠️ {message}
    </span>
  </div>
));
RateLimitBanner.displayName = 'RateLimitBanner';

const StatusIndicator = memo(({ loading, hasUsedRequest }: { loading: boolean; hasUsedRequest: boolean }) => {
  const statusColor = useMemo(() => {
    if (loading) return 'bg-yellow-400';
    if (hasUsedRequest) return 'bg-red-400';
    return 'bg-purple-400';
  }, [loading, hasUsedRequest]);

  const statusText = useMemo(() => {
    if (loading) return 'Processing';
    if (hasUsedRequest) return 'Rate Limited';
    return 'Ready';
  }, [loading, hasUsedRequest]);

  return (
    <div className="flex items-center gap-3 px-4">
      <div className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`} />
      <span className="text-purple-300 text-sm font-medium">Status: {statusText}</span>
    </div>
  );
});
StatusIndicator.displayName = 'StatusIndicator';

const LoadingSpinner = memo(() => (
  <div className="flex flex-col items-center justify-center text-purple-300">
    <div className="w-10 h-10 border-3 border-purple-400 border-t-transparent rounded-full animate-spin mb-6" />
    <p className="text-base">Generating your code...</p>
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

const SandpackEditor = memo(({ files }: { files: any }) => {
  const sandpackOptions = useMemo(() => ({
    externalResources: ["https://cdn.tailwindcss.com"],
  }), []);

  const customSetup = useMemo(() => ({
    dependencies: {
      ...Extra.DEPENDANCY
    },
  }), []);

  return (
    <SandpackProvider
      className="relative w-full h-[70%]"
      files={files}
      theme={sandpackDark}
      customSetup={customSetup}
      options={sandpackOptions}
      template="react"
    >
      <SandpackLayout>
        <SandpackFileExplorer style={{ height: "71vh" }} />
        <SandpackCodeEditor
          style={{ height: "71vh", fontSize: "13px", lineHeight: "1.6" }}
        />
        <div className="preview-container absolute w-full top-0 left-0 transition-all duration-500 ease-in-out">
          <SandpackPreview
            className="w-full"
            showNavigator={false}
            style={{ height: "71vh" }}
          />
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
});
SandpackEditor.displayName = 'SandpackEditor';

const StatusBar = memo(({ loading, hasUsedRequest }: { loading: boolean; hasUsedRequest: boolean }) => {
  const statusText = useMemo(() => {
    if (loading) return 'Processing';
    if (hasUsedRequest) return 'Rate Limited';
    return 'Ready';
  }, [loading, hasUsedRequest]);

  const statusColor = useMemo(() => {
    if (loading) return 'bg-yellow-400';
    if (hasUsedRequest) return 'bg-red-400';
    return 'bg-purple-400';
  }, [loading, hasUsedRequest]);

  return (
    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
      <div className="flex items-center gap-6">
        <span>Status: {statusText}</span>
        <span>Connection: Secure</span>
        <span>Memory: 2.4GB</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
        <span>Live Sync</span>
      </div>
    </div>
  );
});
StatusBar.displayName = 'StatusBar';

const CodeGenPage = () => {
  const [prompt, setPrompt] = useState('');
  const [userInput, setUserInput] = useState('');
  const [files, setFiles] = useState(Extras.DEFAULT_FILE);
  const [loading, setLoading] = useState(false);
  const [hasUsedRequest, setHasUsedRequest] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState('');
  const [isUpdatingUI, setIsUpdatingUI] = useState(false);
  
  const hasInitialized = useRef(false);
  const abortController = useRef<AbortController | null>(null);
  const hasUpdatedUI = useRef(false); // Track if UI update has been called

  // Memoized rate limit checker
  const checkRateLimit = useCallback(() => {
    const requestUsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUEST_USED) || 'false');
    const requestTimestamp = localStorage.getItem(STORAGE_KEYS.REQUEST_TIMESTAMP);
    
    if (requestUsed && requestTimestamp) {
      const now = Date.now();
      const requestTime = parseInt(requestTimestamp);
      const timeDiff = now - requestTime;
      
      if (timeDiff < RESET_DURATION) {
        const remainingTime = Math.ceil((RESET_DURATION - timeDiff) / (60 * 60 * 1000));
        setHasUsedRequest(true);
        setRateLimitMessage(`Rate limit exceeded. Try again in ${remainingTime} hours.`);
        return false;
      } else {
        // Reset if 24 hours have passed
        localStorage.removeItem(STORAGE_KEYS.REQUEST_USED);
        localStorage.removeItem(STORAGE_KEYS.REQUEST_TIMESTAMP);
        setHasUsedRequest(false);
        setRateLimitMessage('');
        return false;
      }
    }
    return false;
  }, []);

  // New function to update App.js UI
  const updateAppJsUI = useCallback(async (currentFiles: any) => {
    if (!currentFiles || !currentFiles['/App.js'] || hasUpdatedUI.current) {
      return currentFiles;
    }

    console.log("Updating App.js UI... payload:" , JSON.stringify(currentFiles['/App.js']));
    setIsUpdatingUI(true);
    
    try {
      const response = await axios.post('http://localhost:4000/code/updateCode', {
        file: JSON.stringify(currentFiles['/App.js'])  
      });
      
      const updatedAppJs = response.data.resp.files;
      console.log("this is the response : " ,response.data.resp)
      console.log("Received updated App.js from backend this is the file : " , updatedAppJs['/App.js']);
      
  
      const mergedFiles = {
        ...currentFiles,
        '/App.js': updatedAppJs['/App.js']
      };
      
      hasUpdatedUI.current = true; // Mark as updated to prevent infinite loop
      return mergedFiles;
      
    } catch (error) {
      console.error('Error updating App.js UI:', error);
      return currentFiles; // Return original files if update fails
    } finally {
      setIsUpdatingUI(false);
    }
  }, []);

  // Optimized API call with abort controller for cleanup
  const generateCode = useCallback(async (promptText: string) => {
    if (hasUsedRequest || !promptText.trim()) {
      console.log("Rate limit exceeded or empty prompt");
      return;
    }

    // Cancel previous request if still pending
    if (abortController.current) {
      abortController.current.abort();
    }
    
    abortController.current = new AbortController();
    
    console.log("Generating code for prompt:", promptText);
    setLoading(true);
    hasUpdatedUI.current = false; // Reset UI update flag
         
    try {
      const payload = {
        role: "user",
        prompt: promptText,
      };
      
      const result = await axios.post(
        `http://localhost:4000/code/genCode`, 
        payload,
        { signal: abortController.current.signal }
      );
      
      const aiResp = result.data.resp;
      console.log("Generated files:", aiResp.files);

      // First, set the generated files
      let currentFiles = { ...aiResp.files };
      
      // Then update App.js UI if it exists
      if (currentFiles['/App.js']) {
        console.log("App.js file found")
        currentFiles = await updateAppJsUI(currentFiles);
      }
      
      setFiles(currentFiles);
      
      // Mark request as used
      setHasUsedRequest(true);
      localStorage.setItem(STORAGE_KEYS.REQUEST_USED, 'true');
      localStorage.setItem(STORAGE_KEYS.REQUEST_TIMESTAMP, Date.now().toString());
      setRateLimitMessage('Request limit reached. You can make another request in 24 hours.');
      
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request cancelled');
      } else {
        console.error('Code generation failed:', err);
      }
    } finally {
      setLoading(false);
      abortController.current = null;
    }
  }, [hasUsedRequest, updateAppJsUI]);

  // Initialize component and check URL params
  useEffect(() => {
    if (hasInitialized.current) return;
    
    // Check rate limit first
    const isRateLimited = checkRateLimit();
    
    // Extract prompt from URL
    const urlParams = new URLSearchParams(window.location.search);
    const extractedPrompt = urlParams.get('prompt');
    
    if (extractedPrompt && !isRateLimited) {
      const decodedPrompt = decodeURIComponent(extractedPrompt);
      setPrompt(decodedPrompt);
      generateCode(decodedPrompt);
    }
    
    hasInitialized.current = true;
  }, [checkRateLimit, generateCode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  // Optimized input handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && !hasUsedRequest && userInput.trim()) {
      e.preventDefault();
      handleInputSubmit();
    }
  }, [loading, hasUsedRequest, userInput]);

  const handleInputSubmit = useCallback(() => {
    if (hasUsedRequest || !userInput.trim() || loading) {
      console.log('Cannot submit:', { hasUsedRequest, userInput: userInput.trim(), loading });
      return;
    }

    console.log('User requested changes:', userInput);
    const newPrompt = userInput.trim();
    setPrompt(newPrompt);
    generateCode(newPrompt);
    setUserInput('');
  }, [hasUsedRequest, userInput, loading, generateCode]);

  // Memoized placeholder text
  const placeholderText = useMemo(() => {
    return hasUsedRequest ? "Rate limit exceeded..." : "Describe what you want to build...";
  }, [hasUsedRequest]);

  // Memoized button text
  const buttonText = useMemo(() => {
    if (loading) return 'Processing...';
    if (isUpdatingUI) return 'Enhancing UI...';
    if (hasUsedRequest) return 'Limited';
    return 'Generate';
  }, [loading, isUpdatingUI, hasUsedRequest]);

  // Memoized button disabled state
  const isButtonDisabled = useMemo(() => {
    return loading || isUpdatingUI || !userInput.trim() || hasUsedRequest;
  }, [loading, isUpdatingUI, userInput, hasUsedRequest]);

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      <StarField />

      <div className="relative z-10 px-8 pb-8 pt-5 h-screen flex flex-col">
        {/* Rate limit notification */}
        {hasUsedRequest && <RateLimitBanner message={rateLimitMessage} />}
        
        {/* UI Update notification */}
        {isUpdatingUI && (
          <div className="mb-2 text-center">
            <span className="text-purple-400 text-xs bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30">
              🎨 Enhancing UI with cyberpunk theme...
            </span>
          </div>
        )}

        {/* Main code editor area */}
        <div className="flex-1 h-[50%] mb-8 relative">
          <div className="h-full bg-gray-900/80 border border-purple-500/30 rounded-2xl backdrop-blur-sm relative overflow-hidden shadow-2xl">
            {/* Hidden checkbox for toggle control */}
            <input type="checkbox" id="preview-toggle" className="hidden" />
            
            {/* Code editor header */}
            <div className="bg-gray-800/60 border-b border-purple-500/20 py-2 px-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="ml-6 text-purple-300 text-sm font-medium">Code Editor</span>
                {isUpdatingUI && (
                  <span className="ml-3 text-purple-400 text-xs animate-pulse">
                    • UI Enhancing
                  </span>
                )}
              </div>
              <label
                htmlFor="preview-toggle"
                className="px-6 py-2 border border-purple-500/50 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer bg-gray-800/50 text-purple-300 hover:border-purple-400 hover:bg-purple-500/10"
              >
                <span className="toggle-text-show">▶ Show Preview</span>
                <span className="toggle-text-hide hidden">◀ Hide Preview</span>
              </label>
            </div>

            {/* Code editor content */}
            <div className="h-full bg-gray-900/20 flex items-center justify-center">
              {(loading || isUpdatingUI) ? (
                <LoadingSpinner />
              ) : (
                <div className="relative w-full h-full">
                  <SandpackEditor files={files} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="relative">
          <div className="relative">
            <div className="bg-gray-900/70 border border-purple-500/30 rounded-2xl backdrop-blur-sm overflow-hidden shadow-xl">
              <div className="flex items-center p-4">
                <StatusIndicator loading={loading || isUpdatingUI} hasUsedRequest={hasUsedRequest} />
                
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholderText}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-3 py-3 text-sm"
                  disabled={loading || isUpdatingUI || hasUsedRequest}
                  autoComplete="off"
                />
                
                <button
                  onClick={handleInputSubmit}
                  disabled={isButtonDisabled}
                  className="px-8 py-3 bg-purple-600/80 border border-purple-500/50 text-white hover:bg-purple-500 hover:border-purple-400 transition-all duration-300 rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  type="button"
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>

          <StatusBar loading={loading || isUpdatingUI} hasUsedRequest={hasUsedRequest} />
        </div>

        {/* Display current prompt for debugging */}
        {prompt && (
          <div className="mt-3 text-xs text-gray-500 truncate">
            Current Prompt: {prompt}
          </div>
        )}
      </div>

      {/* Optimized CSS - moved to separate component to prevent recalculation */}
      <OptimizedStyles />
    </div>
  );
};

// Separate styles component to prevent recreation
const OptimizedStyles = memo(() => (
  <style jsx>{`
    /* Preview toggle animations */
    .preview-container {
      transform: translateX(100%);
    }
    
    #preview-toggle:checked ~ * .preview-container {
      transform: translateX(0);
    }
    
    #preview-toggle:checked ~ * label[for="preview-toggle"] {
      background-color: rgba(147, 51, 234, 0.2) !important;
      border-color: rgb(196, 125, 245) !important;
      color: rgb(221, 170, 254) !important;
      box-shadow: 0 0 20px rgba(147, 51, 234, 0.3) !important;
    }
    
    #preview-toggle:checked ~ * .toggle-text-show {
      display: none !important;
    }
    
    #preview-toggle:checked ~ * .toggle-text-hide {
      display: inline !important;
    }
    
    #preview-toggle:not(:checked) ~ * .toggle-text-show {
      display: inline !important;
    }
    
    #preview-toggle:not(:checked) ~ * .toggle-text-hide {
      display: none !important;
    }

    /* Optimized animations */
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
    
    /* GPU-accelerated animations */
    .animate-spin {
      will-change: transform;
    }
    
    .animate-pulse {
      will-change: opacity;
    }
    
    /* Improve rendering performance */
    .preview-container {
      will-change: transform;
      backface-visibility: hidden;
      transform-style: preserve-3d;
    }
  `}</style>
));
OptimizedStyles.displayName = 'OptimizedStyles';

export default CodeGenPage;
