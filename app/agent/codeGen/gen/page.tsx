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

// Memoized components to prevent unnecessary re-renders
const StatusIndicator = memo(({ loading }: { loading: boolean }) => {
  const statusColor = useMemo(() => {
    if (loading) return 'bg-yellow-400';
    return 'bg-purple-400';
  }, [loading]);

  const statusText = useMemo(() => {
    if (loading) return 'Processing';
    return 'Ready';
  }, [loading]);

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

const SandpackEditor = memo(({ files, showPreview }: { files: any; showPreview: boolean }) => {
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
      className="relative w-full h-full"
      files={files}
      theme={sandpackDark}
      customSetup={customSetup}
      options={sandpackOptions}
      template="react"
    >
      <SandpackLayout>
        <div className={`transition-all duration-500 ease-in-out w-fit`}>
          <SandpackFileExplorer
           style={{ height: "63vh" , width:"170px" } } />
        </div>
          <SandpackCodeEditor
            style={{ height: "63vh", fontSize: "13px", lineHeight: "1.6" , width:"100%" }}
          />

    
        <div 
          className={`absolute top-0 right-0 h-full transition-all duration-500 ease-in-out ${
            showPreview ? 'translate-x-0 w-full' : 'translate-x-full w-1/2'
          }`}
          style={{ 
            backgroundColor: '#151515',
            zIndex: 10
          }}
        >
          <SandpackPreview
            className="w-full h-full"
            showNavigator={false}
            style={{ height: "71vh" }}
          />
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
});
SandpackEditor.displayName = 'SandpackEditor';

const StatusBar = memo(({ loading }: { loading: boolean }) => {
  const statusText = useMemo(() => {
    if (loading) return 'Processing';
    return 'Ready';
  }, [loading]);

  const statusColor = useMemo(() => {
    if (loading) return 'bg-yellow-400';
    return 'bg-purple-400';
  }, [loading]);

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
  const [isUpdatingUI, setIsUpdatingUI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const hasInitialized = useRef(false);
  const abortController = useRef<AbortController | null>(null);
  const hasUpdatedUI = useRef(false); // Track if UI update has been called

  // New function to update App.js UI
  const updateAppJsUI = useCallback(async (currentFiles: any) => {
    if (!currentFiles || !currentFiles['/App.js'] || hasUpdatedUI.current) {
      return currentFiles;
    }

    console.log("Updating App.js UI... payload:" , JSON.stringify(currentFiles['/App.js']));
    setIsUpdatingUI(true);
    
    try {
      const response = await axios.post('https://ethback.vercel.app/code/updateCode', {
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
    if (!promptText.trim()) {
      console.log("Empty prompt");
      return;
    }

    // Cancel previous request if still pending
    if (abortController.current) {
      abortController.current.abort();
    }
    
    abortController.current = new AbortController();
    
    console.log("Generating code for prompt:", promptText);
    setLoading(true);
    setShowPreview(false); // Hide preview when generating new code
    hasUpdatedUI.current = false; // Reset UI update flag
         
    try {
      const payload = {
        role: "user",
        prompt: promptText,
      };
      
      const result = await axios.post(
        `https://ethback.vercel.app/code/genCode`, 
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
  }, [updateAppJsUI]);

  // Initialize component and check URL params
  useEffect(() => {
    if (hasInitialized.current) return;
    
    // Extract prompt from URL
    const urlParams = new URLSearchParams(window.location.search);
    const extractedPrompt = urlParams.get('prompt');
    
    if (extractedPrompt) {
      const decodedPrompt = decodeURIComponent(extractedPrompt);
      setPrompt(decodedPrompt);
      generateCode(decodedPrompt);
    }
    
    hasInitialized.current = true;
  }, [generateCode]);

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
    if (e.key === 'Enter' && !loading && userInput.trim()) {
      e.preventDefault();
      handleInputSubmit();
    }
  }, [loading, userInput]);

  const handleInputSubmit = useCallback(() => {
    if (!userInput.trim() || loading) {
      console.log('Cannot submit:', { userInput: userInput.trim(), loading });
      return;
    }

    console.log('User requested changes:', userInput);
    const newPrompt = userInput.trim();
    setPrompt(newPrompt);
    generateCode(newPrompt);
    setUserInput('');
  }, [userInput, loading, generateCode]);

  // Handle preview toggle
  const handlePreviewToggle = useCallback(() => {
    setShowPreview(prev => !prev);
  }, []);

  // Memoized placeholder text
  const placeholderText = useMemo(() => {
    return "Describe what you want to build...";
  }, []);

  // Memoized button text
  const buttonText = useMemo(() => {
    if (loading) return 'Processing...';
    if (isUpdatingUI) return 'Enhancing UI...';
    return 'Generate';
  }, [loading, isUpdatingUI]);

  // Memoized button disabled state
  const isButtonDisabled = useMemo(() => {
    return loading || isUpdatingUI || !userInput.trim();
  }, [loading, isUpdatingUI, userInput]);

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      <div className="relative z-10 px-8 pb-8 pt-5 h-screen flex flex-col">
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
              <button
                onClick={handlePreviewToggle}
                className={`px-6 py-2 border rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                  showPreview
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                    : 'bg-gray-800/50 border-purple-500/50 text-purple-300 hover:border-purple-400 hover:bg-purple-500/10'
                }`}
              >
                {showPreview ? '◀ Hide Preview' : '▶ Show Preview'}
              </button>
            </div>

            {/* Code editor content */}
            <div className="h-full bg-gray-900/20 flex items-center justify-center relative overflow-hidden">
              {(loading || isUpdatingUI) ? (
                <LoadingSpinner />
              ) : (
                <div className="relative w-full h-full">
                  <SandpackEditor files={files} showPreview={showPreview} />
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
                <StatusIndicator loading={loading || isUpdatingUI} />
                
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholderText}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-3 py-3 text-sm"
                  disabled={loading || isUpdatingUI}
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

          <StatusBar loading={loading || isUpdatingUI} />
        </div>

        {/* Display current prompt for debugging */}
        {prompt && (
          <div className="mt-3 text-xs text-gray-500 truncate">
            Current Prompt: {prompt}
          </div>
        )}
      </div>

      {/* Optimized CSS */}
      <style jsx>{`
        /* Optimized animations */
        .animate-spin {
          will-change: transform;
        }
        
        .animate-pulse {
          will-change: opacity;
        }
      `}</style>
    </div>
  );
};

export default CodeGenPage;