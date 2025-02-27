import React, { useRef, useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import { responsiveButtonList, templates } from "./toolbarConfig.js";
import { decodeLatex, extractLatex } from "./utils.js";
import "./Editor.css";

const Editor = () => {
  const editor = useRef();
  const containerRef = useRef(null); // Reference for parent container
  const defaultSavedContent = `<p><span>$$f(x) = \\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n^2} \\cos\\left(\\frac{\\pi x}{n}\\right) + \\int_{0}^{1} e^{-x^2} dx$$</span></p><p>adadd&nbsp;</p> <span>adadad</span>`;
  const [content, setContent] = useState(decodeLatex(defaultSavedContent));
  const [editorHeight, setEditorHeight] = useState(300); // Default height

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  const handleChange = (content) => {
    setContent(content);
  };

  const saveContent = () => {
    console.log("Saved content:", extractLatex(content));
  };

  // Dynamically update height based on parent container
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const parentHeight = containerRef.current.clientHeight;
        setEditorHeight(parentHeight - 100); // Adjust based on padding/margin
      }
    };

    updateHeight(); // Initial height setup
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full bg-slate-500 flex flex-col p-4">
      <div className="flex-1">
        <SunEditor
          height={`${editorHeight}px`} // Dynamically set height
          getSunEditorInstance={getSunEditorInstance}
          setContents={content}
          autoFocus={false}
          onChange={handleChange}
          setOptions={{
            stickyToolbar: true,
            width: "100%",
            popupDisplay: "full",
            templates: templates,
            katex: katex,
            buttonList: responsiveButtonList,
            responsiveToolbar: true,
            callBackSave: saveContent, // Connect save button to function
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
