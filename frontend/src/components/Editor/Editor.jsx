import  { useRef, useState, useEffect, useContext } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import { responsiveButtonList, templates } from "./toolbarConfig.js";
import { decodeLatex } from "./utils.js";
import { useAuth } from "@/context/auth/AuthContextBase";
// third party
import axios from 'axios';
import { toast } from "react-toastify";

const Editor = ({ videoId, playlistId }) => {
  const editor = useRef();
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [content, setContent] = useState('');
  const [editorHeight, setEditorHeight] = useState(300);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  // fetch content from server
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
        
      try {
        const response = await axios.post(
          `/notes/getNotes`,
          {
            videoId,
            playlistId,
            userId: user?.userId
          }
        );
        
        const noteText = response.data ? response.data.notes : "";
      
        setContent(decodeLatex(noteText));
       
      } catch (error) {
        console.error("Error fetching notes:", error);
        setContent("");
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    if (videoId && playlistId && user?.userId) {
      fetchNotes();
     
    }
  }, [videoId, playlistId, user?.userId]);
  
  const handleChange = (updatedContent) => {
   
    setContent(updatedContent);
  };
  
  // Pass the latest state when saving
  const saveContent = async () => {
    try {
      setLoading(true);
  
      await axios.put(
        `/notes/saveNotes`,
        {
          userId: user?.userId,
          playlistId,
          videoId,
          text: editor.current?.getContents(),  // Get latest content from editor
        }
      );
  
      toast.success("Notes saved successfully");
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error(`Failed to save notes: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
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
    <div ref={containerRef} className="h-[100vh] flex flex-col p-4">
      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-500">Loading editor...</div>
          </div>
        ) : (
          <SunEditor
            height={`${editorHeight}px`}
            getSunEditorInstance={getSunEditorInstance}
            setContents={content || ''}
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
        )}
      </div>
    </div>
  );
};

export default Editor;