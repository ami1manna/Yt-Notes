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
  const saveContent = async () => {
    setContent((prevContent) => {
      const latestContent = prevContent; // Now this gets the latest value
      console.log(latestContent); // This will correctly log the latest content
  
      (async () => {
        try {
          setLoading(true);
          console.log(user.email, playlistId, videoId, latestContent);
          const response = await axios.put(
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/video/notes`,
            {
              userEmail: user.email,
              playlistId: playlistId,
              videoId: videoId,
              text: latestContent,
            }
          );
  
          console.log(response);
          toast.success("Notes Saved");
  
          // Update sessionStorage
          const storageKey = `notes_${videoId}`;
          sessionStorage.setItem(storageKey, latestContent);
        } catch (error) {
          toast.error("Failed to save notes: " + error);
        } finally {
          setLoading(false);
        }
      })();
  
      return prevContent; // Return the same value since we're not modifying state here
    });
  };
  
  
   
  const handleChange = (updatedContent) => {
    setContent(() => updatedContent); // Ensures the latest value is set
  };
  
  // fetch content from server
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      const storageKey = `notes_${videoId}`;
      const cachedNotes = sessionStorage.getItem(storageKey);

      if (cachedNotes) {
        setContent(cachedNotes);
        console.log("Using cached notes");
        setLoading(false);
      } else {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/video/notes/${user.email}/${playlistId}/${videoId}`
          );
          
          const noteText = response.data ? response.data.notes : "";
          setContent(decodeLatex(noteText));
          
       
          // Store in sessionStorage
          sessionStorage.setItem(storageKey, decodeLatex(noteText));

        } catch (error) {
          toast.error("Failed to fetch notes");

        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchNotes();
  }, [videoId]);




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
              callBackSave: saveContent, // Connect save button to function
            }}
          />
        }
      </div>
    </div>
  );
};

export default Editor;
