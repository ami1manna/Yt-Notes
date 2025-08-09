import React, { useContext } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { ThemeContext } from "@/context/ThemeContext";
import { editorOptions } from "./editorConfig";
 

const RichTextEditor = ({ value = "", onChange , handleNoteSave}) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  const editorStyle = {
    backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
    color: isDarkMode ? "#ffffff" : "#000000",
  };
 

 

  return (
    <div className="w-full">
      <style>
        {isDarkMode &&
          `
            .sun-editor {
              background-color: #1a1a1a !important;
              border-color: #374151 !important;
            }
            .sun-editor .se-toolbar {
              background-color: #1f2937 !important;
              border-color: #374151 !important;
            }
            .sun-editor .se-btn {
              color: #ffffff !important;
            }
            .sun-editor .se-btn:hover {
              background-color: #374151 !important;
            }
            .sun-editor .se-wrapper-inner {
              background-color: #1a1a1a !important;
              color: #ffffff !important;
            }
            .sun-editor .se-resizing-bar {
              background-color: #1f2937 !important;
              border-color: #374151 !important;
            }
            .sun-editor .se-dialog {
              background-color: #1f2937 !important;
              border-color: #374151 !important;
              color: #ffffff !important;
            }
            .sun-editor .se-dialog button {
              background-color: #374151 !important;
              color: #ffffff !important;
            }
            .sun-editor .se-dialog input,
            .sun-editor .se-dialog textarea {
              background-color: #1a1a1a !important;
              border-color: #374151 !important;
              color: #ffffff !important;
            }
          `}
      </style>

      <SunEditor
        setOptions={{
              ...editorOptions,
              callBackSave: handleNoteSave,  
            }}
        onChange={onChange}
        setDefaultStyle={`
          font-family: arial;
          font-size: 14px;
          ${isDarkMode ? "background-color: #1a1a1a; color: #ffffff;" : ""}
        `}
        setContents={value}
        height="500"
        hideToolbar={false}
        disable={false}
        placeholder="Start typing..."
        style={editorStyle}
      />
    </div>
  );
};

export default RichTextEditor;
