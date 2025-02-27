import React, { useRef, useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import plugins from "suneditor/src/plugins"; // Import SunEditor plugins
 

const Editor = () => {
  const editor = useRef();
  // Default saved content (Processed for KaTeX)
  const defaultSavedContent = `<p><span>$$f(x) = \\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n^2} \\cos\\left(\\frac{\\pi x}{n}\\right) + \\int_{0}^{1} e^{-x^2} dx$$</span></p><p>adadd&nbsp; </p> <span>adadad</span>`;
  
  // Convert $$LaTeX$$ back into KaTeX elements
  const decodeLatex = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    
    tempDiv.querySelectorAll("span").forEach((el) => {
      const latexMatch = el.textContent.match(/^\$\$(.*?)\$\$/);
      if (latexMatch) {
        const latexCode = latexMatch[1];
        const katexSpan = document.createElement("span");
        katexSpan.classList.add("__se__katex", "katex");
        katexSpan.setAttribute("data-exp", latexCode);
        katexSpan.innerHTML = katex.renderToString(latexCode, { throwOnError: false });
        el.replaceWith(katexSpan);
      }
    });
    return tempDiv.innerHTML;
  };
  
  // State with default value decoded from LaTeX
  const [content, setContent] = useState(decodeLatex(defaultSavedContent));
  
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };
  
  const handleChange = (content) => {
    setContent(content); // Update state with new content
  };
  
  // Extracts raw LaTeX formulas and replaces KaTeX HTML with LaTeX
  const extractLatex = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const katexElements = tempDiv.querySelectorAll("span.__se__katex");
    katexElements.forEach((el) => {
      const latexCode = el.getAttribute("data-exp"); // Get raw LaTeX formula
      if (latexCode) {
        const latexSpan = document.createElement("span");
        latexSpan.textContent = `$$${latexCode}$$`; // Wrap in LaTeX delimiters
        el.replaceWith(latexSpan); // Replace KaTeX element with LaTeX text
      }
    });
    return tempDiv.innerHTML; // Return modified HTML with raw LaTeX
  };
  
  // Save function: Extracts and logs the cleaned content
  const saveContent = () => {
    const formattedContent = extractLatex(content);
    console.log("Saved content:", formattedContent);
  };
  
  // Define templates
  const templates = [
    {
      name: 'Template-1',
      html: '<p>HTML source1</p>'
    },
    {
      name: 'Template-2',
      html: '<p>HTML source2</p>'
    }
  ];
  
  // Define button lists for responsive design
  const responsiveButtonList = [
    // default view (mobile first)
    ['undo', 'redo'],
    [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['fontColor', 'hiliteColor', 'textStyle'],
    ['removeFormat'],
    ['outdent', 'indent'],
    ['align', 'horizontalRule', 'list', 'lineHeight'],
    ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template'],
    ['-right', ':r-More Rich-default.more_plus', 'table', 'math', 'imageGallery'],
    ['-right', 'image', 'video', 'audio', 'link'],
    
    // Desktop (min-width: 992px)
    ['%992', [
      ['undo', 'redo'],
      [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike'],
      [':t-More Text-default.more_text', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template'],
      ['-right', ':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'math', 'imageGallery']
    ]],
    
    // Tablet (min-width: 767px)
    ['%767', [
      ['undo', 'redo'],
      [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
      [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      [':e-More Line-default.more_horizontal', 'align', 'horizontalRule', 'list', 'lineHeight'],
      [':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'math', 'imageGallery'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template']
    ]],
    
    // Mobile large (min-width: 480px)
    ['%480', [
      ['undo', 'redo'],
      [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
      [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
      [':e-More Line-default.more_horizontal', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'lineHeight'],
      [':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'math', 'imageGallery'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template']
    ]]
  ];

  return (
    <div className="h-full">
      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        setContents={content}
        autoFocus={false}
        onChange={handleChange}
        setOptions={{
          height: 300,
          width: '100%',
          popupDisplay: "full",
          templates: templates,
          
          katex: katex,
          buttonList: responsiveButtonList,
          // Essential for responsive toolbar
          toolbarContainer: null,
          resizingBar: true,
          responsiveToolbar: true,
          stickyToolbar: true,
          // These help better mobile UX
          hideToolbar: false,
          charCounter: true,
          plugins: {
            ...plugins, // Load existing plugins
          }
        }}
      />
      <button
        onClick={saveContent}
        className="mt-4 p-2 bg-green-500 text-white rounded"
      >
        Save
      </button>
    </div>
  );
};

export default Editor;