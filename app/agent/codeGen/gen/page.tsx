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
      
      const result = await axios.post(`https://forj-backend.vercel.app/code/genCode`, payload);
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
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      {/* Glowing border effect */}
      <div className="absolute inset-0 border border-green-500/20 shadow-[inset_0_0_50px_rgba(0,255,0,0.1)]"></div>

      <div className="relative z-10 px-6 pb-6 pt-1 h-screen flex flex-col">
        
        {/* Toggle Button */}
        <div className="mb-1 flex justify-end">
         
        </div>

        {/* Main code editor area */}
        <div className="flex-1 h-[50%] mb-6 relative">
          <div className="h-full bg-gray-900/30 border-2 border-green-500/40 rounded-lg backdrop-blur-sm relative overflow-hidden">
            {/* Hidden checkbox for toggle control */}
            <input type="checkbox" id="preview-toggle" className="hidden" />
            
            {/* Code editor header */}
            <div className="bg-gray-800/50 border-b border-green-500/30 p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-green-400 text-sm">editor.js</span>
              </div>
              <label
                htmlFor="preview-toggle"
                className="px-4 py-2 border-2 rounded-lg font-mono text-sm transition-all duration-300 cursor-pointer bg-gray-900/50 border-green-500/50 text-green-500 hover:border-green-400"
              >
                <span className="toggle-text-show">▶ SHOW PREVIEW</span>
                <span className="toggle-text-hide hidden">◀ HIDE PREVIEW</span>
              </label>
            </div>

            {/* Code editor placeholder with loading state */}
            <div className=" h-full bg-green-200 flex items-center justify-center">
              {loading ? (
                <div className="flex flex-col items-center justify-center text-green-400">
                  <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm">Generating code...</p>
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
                        style={{ height: "71vh", fontSize: "12px", lineHeight: "30px" }}
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

            {/* Glowing corners */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-green-400/60 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-green-400/60 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-green-400/60 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-green-400/60 rounded-br-lg"></div>
          </div>
        </div>

        {/* Input bar */}
        <div className="relative">
          <div className="relative">
            <div className="bg-gray-900/50 border-2 border-green-500/50 rounded-lg backdrop-blur-sm overflow-hidden">
              <div className="flex items-center p-2">
                <div className="flex items-center gap-2 px-3">
                  <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`}></div>
                  <span className="text-green-500 text-sm">INPUT:</span>
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
                  placeholder="Enter modifications to neural network..."
                  className="flex-1 bg-transparent text-green-300 placeholder-green-500/40 outline-none px-2 py-2 text-sm font-mono"
                  disabled={loading}
                />
                
                <button
                  onClick={handleInputSubmit}
                  disabled={loading || !userInput.trim()}
                  className="px-6 py-2 bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 hover:border-green-400 transition-all duration-300 rounded text-sm font-mono tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'PROCESSING...' : 'EXECUTE'}
                </button>
              </div>
            </div>
            
            {/* Glowing effect on focus */}
            <div className="absolute inset-0 rounded-lg bg-green-500/5 blur-xl -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Status bar */}
          <div className="mt-2 flex items-center justify-between text-xs text-green-500/60">
            <div className="flex items-center gap-4">
              <span>STATUS: {loading ? 'PROCESSING' : 'READY'}</span>
              <span>CONN: SECURE</span>
              <span>MEM: 2.4GB</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-1 h-1 rounded-full animate-pulse ${loading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
              <span>REAL_TIME_SYNC</span>
            </div>
          </div>
        </div>

        {/* Display current prompt for debugging */}
        {prompt && (
          <div className="mt-2 text-xs text-green-500/40 truncate">
            Current Prompt: {prompt}
          </div>
        )}
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-green-400/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-green-400/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-green-400/30 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
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
          background-color: rgba(34, 197, 94, 0.2) !important;
          border-color: rgb(74, 222, 128) !important;
          color: rgb(134, 239, 172) !important;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.3) !important;
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
      `}</style>
    </div>
  );
};

export default CodeGenPage;