import React, { useState } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
 

const QuillEditor = () => {
  const [editorValue, setEditorValue] = useState("");

  const handleChange = (value) => {
    setEditorValue(value); // Update editor value on change
  };

  return (
    
      <ReactQuill
        value={editorValue}
        onChange={handleChange}
        theme="snow"
        placeholder="Write something..."
        className="border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-4 w-full dark:bg-gray-900 dark:text-white"
      />
     
  );
};

export default QuillEditor;
