import React, { useContext, useEffect, useState } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "@/context/auth/AuthContextBase";

import { Save, FileText, Sparkles } from "lucide-react";

// import axios from 'axios'; // Moved to component usage context
import IconButton from "../common/IconButton";

const SunEditorComponent = ({ playlistId, videoId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);

  const isDarkMode = theme === 'dark';

  const options = {
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['removeFormat'],
      ['fontColor', 'hiliteColor'],
      ['indent', 'outdent'],
      ['align', 'horizontalRule', 'list', 'table'],
      ['link'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['preview', 'print'],
      ['save', 'template']
    ],

    defaultTag: 'p',
    stickyToolbar: "40",
    rtl: false,
    showPathLabel: false,

    attributesWhitelist: {
      all: 'style',
      table: 'cellpadding|width|cellspacing|height|style',
      tr: 'style',
      td: 'style',
      img: 'style|src|alt'
    }
  };

  // fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.post(`/notes/getNotes`, {
          userId: user.userId,
          playlistId,
          videoId
        });
        if (response.data[0])
          setContent(response.data[0].text);
        else
          setContent('');

      } catch (error) {
        console.error(error);
      }
    };

    fetchNotes();

  }, [videoId, user.userId, playlistId]);

  const editorStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#000000',
  };

  // save content to file
  const saveContent = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/notes/addNotes`, {
        userId: user.userId,
        playlistId: playlistId,
        videoId: videoId,
        text: content
      });

    } catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Neon Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-pink-500/5 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 p-4 border-b border-cyan-500/20 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-500/30">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Rich Text Editor
              </h2>
              <p className="text-sm text-gray-400">
                Create and format your notes
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-700/50 border border-cyan-500/20">
              <div className={`w-2 h-2 rounded-full ${
                isLoading 
                  ? "bg-yellow-400 animate-pulse" 
                  : "bg-cyan-400"
              }`} />
              <span className="text-xs text-gray-300">
                {isLoading ? "Saving..." : "Ready"}
              </span>
            </div>
            
            {/* Save Button */}
            <IconButton
              type="button"
              className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white border-none shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
              icon={Save}
              onClick={saveContent}
              isLoading={isLoading}
            >
              Save
            </IconButton>
          </div>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative z-10 p-4 h-full">
        <div className="h-full bg-gray-800/30 rounded-xl border border-cyan-500/20 backdrop-blur-sm overflow-hidden relative">
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50 z-10" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-pink-400/50 z-10" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-400/50 z-10" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-pink-400/50 z-10" />
          
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="relative z-10 h-full p-4">
            <style>
              {`
                ${isDarkMode ? `
                  .sun-editor {
                    background-color: rgba(31, 41, 55, 0.8) !important;
                    border-color: rgba(6, 182, 212, 0.2) !important;
                    border-radius: 8px !important;
                    backdrop-filter: blur(8px) !important;
                  }
                  .sun-editor .se-toolbar {
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%) !important;
                    border-color: rgba(6, 182, 212, 0.2) !important;
                    border-radius: 8px 8px 0 0 !important;
                    backdrop-filter: blur(8px) !important;
                  }
                  .sun-editor .se-btn {
                    color: #ffffff !important;
                    border-radius: 4px !important;
                    transition: all 0.2s ease !important;
                  }
                  .sun-editor .se-btn:hover {
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%) !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 8px rgba(6, 182, 212, 0.25) !important;
                  }
                  .sun-editor .se-btn.se-btn-select {
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%) !important;
                  }
                  .sun-editor .se-wrapper-inner {
                    background-color: rgba(17, 24, 39, 0.9) !important;
                    color: #ffffff !important;
                    border-radius: 0 0 8px 8px !important;
                  }
                  .sun-editor .se-resizing-bar {
                    background: linear-gradient(90deg, rgba(6, 182, 212, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%) !important;
                    border-color: rgba(6, 182, 212, 0.3) !important;
                  }
                  .sun-editor .se-dialog {
                    background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%) !important;
                    border: 1px solid rgba(6, 182, 212, 0.3) !important;
                    border-radius: 12px !important;
                    color: #ffffff !important;
                    backdrop-filter: blur(16px) !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(6, 182, 212, 0.1) !important;
                  }
                  .sun-editor .se-dialog button {
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%) !important;
                    color: #ffffff !important;
                    border: none !important;
                    border-radius: 6px !important;
                    transition: all 0.2s ease !important;
                  }
                  .sun-editor .se-dialog button:hover {
                    background: linear-gradient(135deg, rgba(6, 182, 212, 1) 0%, rgba(236, 72, 153, 1) 100%) !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4) !important;
                  }
                  .sun-editor .se-dialog input,
                  .sun-editor .se-dialog textarea,
                  .sun-editor .se-dialog select {
                    background-color: rgba(17, 24, 39, 0.8) !important;
                    border: 1px solid rgba(6, 182, 212, 0.3) !important;
                    border-radius: 6px !important;
                    color: #ffffff !important;
                    transition: all 0.2s ease !important;
                  }
                  .sun-editor .se-dialog input:focus,
                  .sun-editor .se-dialog textarea:focus,
                  .sun-editor .se-dialog select:focus {
                    border-color: rgba(6, 182, 212, 0.6) !important;
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2) !important;
                    outline: none !important;
                  }
                  .sun-editor .se-dropdown-list {
                    background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%) !important;
                    border: 1px solid rgba(6, 182, 212, 0.3) !important;
                    border-radius: 8px !important;
                    backdrop-filter: blur(8px) !important;
                  }
                  .sun-editor .se-dropdown-list button {
                    color: #ffffff !important;
                    transition: all 0.2s ease !important;
                  }
                  .sun-editor .se-dropdown-list button:hover {
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%) !important;
                  }
                ` : ''}
              `}
            </style>
            
            <SunEditor
              setOptions={options}
              onChange={setContent}
              setDefaultStyle={`
                font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; 
                font-size: 14px;
                line-height: 1.6;
                ${isDarkMode ? 'background-color: rgba(17, 24, 39, 0.9); color: #ffffff;' : ''}
              `}
              height="calc(100% - 40px)"
              setContents={content}
              hideToolbar={false}
              disable={false}
              placeholder="Start typing your notes..."
              style={editorStyle}
            />
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SunEditorComponent;