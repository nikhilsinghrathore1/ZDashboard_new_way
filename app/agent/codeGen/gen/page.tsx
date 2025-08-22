"use client"
import React, { useState, useEffect, useRef } from 'react';
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
import { dracula } from "@codesandbox/sandpack-themes";

import { sandpackDark } from "@codesandbox/sandpack-themes";

const CodeGenPage = () => {
  const [prompt, setPrompt] = useState('');
  const [userInput, setUserInput] = useState('');
  const [files, setfiles] = useState(Extras.DEFAULT_FILE);
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false);

  // Function to get code from backend
  const GetCode = async (promptText:any) => {
    console.log("running the gencode function");
    setLoading(true);
    console.log("Prompt:", promptText);
         
    try {
      // Different payload options - uncomment the one that matches your backend:
      
      // Option 1: Original format
      const payload = {
        role: "user",
        prompt: promptText,
      };
      
      // Option 2: Simple prompt only
      // const payload = {
      //   prompt: promptText,
      // };
      
      // Option 3: Messages array format
      // const payload = {
      //   messages: [{ role: "user", content: promptText }]
      // };
      
      // Option 4: Direct string
      // const payload = promptText;
      
      console.log("Sending payload:", payload);
      
      const result = await axios.post(`https://ethback.vercel.app/code/genCode`, payload);
      console.log("Backend response:", result);
       
      const aiResp = result.data.resp;
      console.log("this are the airesp files ", aiResp.files);
      const mergedFile = { ...aiResp.files };
      console.log("these are the merged files ", mergedFile);
      setfiles(mergedFile);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // Extract prompt from URL on component mount and fetch code - SINGLE useEffect
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const extractedPrompt = urlParams.get('prompt');
    
    if (extractedPrompt) {
      const decodedPrompt = decodeURIComponent(extractedPrompt);
      setPrompt(decodedPrompt);
      // Automatically fetch code when prompt is found in URL
      GetCode(decodedPrompt);
      hasInitialized.current = true;
    }
  }, []);

  const handleInputSubmit = () => {
    // Handle user input submission here
    console.log('User requested changes:', userInput);
    
    if (userInput.trim()) {
      // Update prompt with user input and trigger code generation
      const newPrompt = userInput;
      setPrompt(newPrompt);
      GetCode(newPrompt); // Call GetCode directly to avoid double execution
      setUserInput('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 bg-black">
        {/* Generate twinkling stars */}
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.7,
            }}
          />
        ))}
        {/* Larger twinkling stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute w-2 h-2 bg-purple-300 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              opacity: 0.2 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-8 pb-8 pt-5 h-screen flex flex-col">
        
        {/* Toggle Button */}
        <div className="mb- flex justify-end">
         
        </div>

        {/* Main code editor area */}
        <div className="flex-1 h-[50%] mb-8 relative">
          <div className="h-full bg-gray-900/80 border border-purple-500/30 rounded-2xl backdrop-blur-sm relative overflow-hidden shadow-2xl">
            {/* Hidden checkbox for toggle control */}
            <input type="checkbox" id="preview-toggle" className="hidden" />
            
            {/* Code editor header */}
            <div className="bg-gray-800/60 border-b border-purple-500/20 py-2 px-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="ml-6 text-purple-300 text-sm font-medium">Code Editor</span>
              </div>
              <label
                htmlFor="preview-toggle"
                className="px-6 py-2 border border-purple-500/50 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer bg-gray-800/50 text-purple-300 hover:border-purple-400 hover:bg-purple-500/10"
              >
                <span className="toggle-text-show">▶ Show Preview</span>
                <span className="toggle-text-hide hidden">◀ Hide Preview</span>
              </label>
            </div>

            {/* Code editor placeholder with loading state */}
            <div className="h-full bg-gray-900/20 flex items-center justify-center">
              {loading ? (
                <div className="flex flex-col items-center justify-center text-purple-300">
                  <div className="w-10 h-10 border-3 border-purple-400 border-t-transparent rounded-full animate-spin mb-6"></div>
                  <p className="text-base">Generating your code...</p>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <SandpackProvider
                    className="relative w-full h-[70%]"
                    files={files}
                    theme={sandpackDark}
                    customSetup={{
                      dependencies: {
                       ...Extra.DEPENDANCY
                      },
                    }}
                    options={{
                      externalResources: ["https://cdn.tailwindcss.com"],
                    }}
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
                <div className="flex items-center gap-3 px-4">
                  <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400' : 'bg-purple-400'} animate-pulse`}></div>
                  <span className="text-purple-300 text-sm font-medium">Prompt:</span>
                </div>
                
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInputSubmit();
                    }
                  }}
                  placeholder="Describe what you want to build..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-3 py-3 text-sm"
                  disabled={loading}
                />
                
                <button
                  onClick={handleInputSubmit}
                  disabled={loading || !userInput.trim()}
                  className="px-8 py-3 bg-purple-600/80 border border-purple-500/50 text-white hover:bg-purple-500 hover:border-purple-400 transition-all duration-300 rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Generate'}
                </button>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-6">
              <span>Status: {loading ? 'Processing' : 'Ready'}</span>
              <span>Connection: Secure</span>
              <span>Memory: 2.4GB</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400' : 'bg-purple-400'} animate-pulse`}></div>
              <span>Live Sync</span>
            </div>
          </div>
        </div>

        {/* Display current prompt for debugging */}
        {prompt && (
          <div className="mt-3 text-xs text-gray-500 truncate">
            Current Prompt: {prompt}
          </div>
        )}
      </div>

      {/* CSS for toggle animation */}
      <style jsx>{`
        /* Default state - preview hidden (slides to right) */
        .preview-container {
          transform: translateX(100%);
        }
        
        /* When checkbox is checked - preview visible (slides in) */
        #preview-toggle:checked ~ * .preview-container {
          transform: translateX(0);
        }
        
        /* Toggle button styling changes when checked */
        #preview-toggle:checked ~ * label[for="preview-toggle"] {
          background-color: rgba(147, 51, 234, 0.2) !important;
          border-color: rgb(196, 125, 245) !important;
          color: rgb(221, 170, 254) !important;
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3) !important;
        }
        
        /* Text switching for show/hide */
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

        /* Enhanced twinkling animation */
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CodeGenPage;