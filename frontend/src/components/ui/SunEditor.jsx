import React, { useContext, useEffect, useState } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

import IconButton from "./IconButton";
import {Save} from "lucide-react";

import axios from 'axios';
import { PlaylistContext } from "../../context/PlaylistsContext";

const SunEditorComponent = ({playlistId,videoId}) => {
  const [content, setContent] = useState('');
  const {user} = useContext(AuthContext);
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


  // fetch notes
  useEffect(()=>{
     
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/video/notes/${user.email}/${playlistId}/${videoId}`);
        if(response.data[0]) 
          setContent(response.data[0].text);
        else
          setContent('');  
         
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotes();

  },[videoId])
  const editorStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#000000',
  };

  // save content to file
  const saveContent = async () => {
    try {
       
      const response = await axios.put('http://localhost:5000/video/notes', {
        "userEmail": user.email,
        "playlistId": playlistId,
        "videoId": videoId,
        "timestamp": 120,
        "text":content
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="editor-container w-full ">
     <div className="flex w-full justify-end items-center">
      <IconButton type="button" className='w-28 h-full p-4 my-3 ' icon={Save} onClick={saveContent} >Save</IconButton>
     </div>

      
      <style>
        {`
          ${isDarkMode ? `
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
          ` : ''}
        `}
      </style>
      <SunEditor
        setOptions={options}
        onChange={setContent}
        setDefaultStyle={`
          font-family: arial; 
          font-size: 14px;
          ${isDarkMode ? 'background-color: #1a1a1a; color: #ffffff;' : ''}
        `}
        height="400px"
        setContents={content}
        hideToolbar={false}
        disable={false}
        placeholder="Start typing..."
        style={editorStyle}
      />
    </div>
  );
};

export default SunEditorComponent;