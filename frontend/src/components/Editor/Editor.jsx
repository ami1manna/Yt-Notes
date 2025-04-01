import React, { useRef, useState, useEffect, useContext } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import { responsiveButtonList, templates } from "./toolbarConfig.js";
import { decodeLatex, extractLatex } from "./utils.js";
import { AuthContext } from "../../context/AuthContext.jsx";
// third party
import axios from "axios";
import { toast } from "react-toastify";
 
 

const Editor = ({ videoId, playlistId }) => {
  const editor = useRef();
  const { user } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);
  const containerRef = useRef(null); // Reference for parent container

  const [content, setContent] = useState('');
  const [editorHeight, setEditorHeight] = useState(300); // Default height

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

    // fetch content from server
    useEffect(() => {
      const fetchNotes = async () => {
        setLoading(true);
          
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_REACT_APP_BASE_URL}/video/getNotes`,
              {
                videoId: videoId,
                playlistId: playlistId,
                userEmail: user.email
              }
            );
            
            const noteText = response.data ? response.data.notes : "";
            setContent(decodeLatex(noteText));
            
         
           
  
          } catch (error) {
            setContent("");
            console.log(error);
  
          }
          finally {
            setLoading(false);
          }
        
      };
  
      fetchNotes();
    }, [videoId]);
  
  


  const saveContent = async () => {
    
        try {
          setLoading(true);
          
          const response = await axios.put(
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/video/saveNotes`,
            {
              userEmail: user.email,
              playlistId: playlistId,
              videoId: videoId,
              text: content,
            }
          );
  
          
          toast.success(response.data.message);
  
           
        } catch (error) {
          toast.error("Failed to save notes: " + error);
        } finally {
          setLoading(false);
        }
      }

  
  
   
  const handleChange = (updatedContent) => {
    setContent(() => updatedContent); // Ensures the latest value is set
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
    <div ref={containerRef} className=" h-[100vh] flex flex-col p-4">
      <div className="flex-1">
        

        {
          isLoading && (<>Loading...</>)
        }

        {
          !isLoading &&
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
              callBackSave: saveContent,  
            }}
          />
        }
      </div>
    </div>
  );
};

export default Editor;
