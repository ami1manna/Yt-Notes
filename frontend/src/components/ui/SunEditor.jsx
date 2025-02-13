import React, { useState } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditorComponent = () => {
  const [content, setContent] = useState('');

  const options = {
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['removeFormat'],
      ['fontColor', 'hiliteColor'],
      ['indent', 'outdent'],
      ['align', 'horizontalRule', 'list', 'table'],
      ['link', 'image', 'video'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['preview', 'print'],
      ['save', 'template']
    ],
    defaultTag: 'p',
    minHeight: '300px',
    showPathLabel: false,
    attributesWhitelist: {
      all: 'style',
      table: 'cellpadding|width|cellspacing|height|style',
      tr: 'style',
      td: 'style',
      img: 'style|src|alt'
    }
  };

  return (
    <div className="editor-container w-full mt-8 p-4">
      <SunEditor
        setOptions={options}
        onChange={setContent}
        setDefaultStyle="font-family: arial; font-size: 14px;"
        height="400px"
        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
      />
      
      {/* Optional: Display HTML preview */}
      <div className="mt-4 p-4 border rounded-lg">
        <h3 className="mb-2 text-lg font-semibold">HTML Output:</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default SunEditorComponent;