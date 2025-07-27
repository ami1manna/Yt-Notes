import React, { useContext, useEffect, useState } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "@/context/auth/AuthContextBase";


import {Save} from "lucide-react";

import axios from 'axios';
import IconButton from "../common/IconButton";
 

const SunEditorComponent = ({playlistId,videoId}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState('');
  const {user} = useAuth();
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
  useEffect(()=>{
     
    const fetchNotes = async () => {
      try {
        const response = await axios.post(`/notes/getNotes`, {
          userId: user.userId,
          playlistId,
          videoId
        });
        if(response.data[0]) 
          setContent(response.data[0].text);
        else
          setContent('');  
         
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotes();

  },[videoId, user.userId, playlistId])
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
        text:content
      });
      
    } catch (error) {
      console.error(error);
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full ">
     <div className="flex w-full justify-end items-center ">
      <IconButton type="button" className='mb-2 px-2' icon={Save} onClick={saveContent} isLoading={isLoading}>Save</IconButton>
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
        height="500"
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