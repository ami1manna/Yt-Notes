import React, { useState } from "react";
import ReactQuill from "react-quill"; 
import "react-quill/dist/quill.snow.css"; // Import Quill's styles

const QuillEditor = () => {
  const [editorValue, setEditorValue] = useState("");

  const handleChange = (value) => {
    setEditorValue(value); // Update editor value on change
  };

  return (
    <div className="w-full mt-8 p-4">
      <ReactQuill
        value={editorValue}
        onChange={handleChange}
        theme="snow"
        modules={{
          toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ 'color': [] }, { 'background': [] }],
            ['image'],
            ['blockquote', 'code-block'],
            ['undo', 'redo'],
            
          ],
        }}
        className="border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 w-full dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-xl"
      />
    </div>
  );
};

export default QuillEditor;
