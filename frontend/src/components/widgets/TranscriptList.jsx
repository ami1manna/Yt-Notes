import React, { useEffect, useState } from "react";
import TranscriptTile from "../ui/TranscriptTile";
import { addTranscript, getTranscript } from "../../utils/Transcript";
import { toast, ToastContainer } from "react-toastify";
import { CloudDownload, Search, Copy, Check } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import IconButton from "../ui/IconButton";

const TranscriptList = ({ videoId }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copying, setCopying] = useState(false);
  
  useEffect(() => {
    if (!videoId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const abortController = new AbortController();
    
    const fetchTranscript = async () => {
      try {
        const result = await getTranscript({ videoId });
        if (result.error) {
          setData({});
        } else {
          setData(result);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error("An unexpected error occurred.", {
            position: "top-right",
            icon: "❌",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTranscript();
    return () => abortController.abort();
  }, [videoId]);

  const fetchTranscript = async () => {
    setLoading(true);
    try {
      const result = await addTranscript({ videoId });
      if (result.error) {
        setData({});
      } else {
        setData(result);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        position: "top-right",
        icon: "❌",
      });
    }
    finally {
      setLoading(false);
    }
  }
  
  // Filter transcript based on search term
  const filteredTranscript = data.transcript?.filter(item => 
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to copy all transcript text
  const copyTranscriptText = async () => {
    if (!filteredTranscript || filteredTranscript.length === 0) return;
    
    setCopying(true);
    
    try {
      const fullText = filteredTranscript.map(item => item.text).join('\n\n');
      await navigator.clipboard.writeText(fullText);
      toast.success("Transcript copied to clipboard!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to copy transcript", {
        position: "top-right",
      });
    } finally {
      // Set copying state to true for visual feedback
      setTimeout(() => {
        setCopying(false);
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 h-[100vh] overflow-hidden overflow-y-auto">
      <ToastContainer />
      
      {/* Title, search bar and copy button */}
      <div className="mb-6 sticky top-0 bg-white dark:bg-gray-800 p-4  border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Video Transcript</h2>
          
          {filteredTranscript && filteredTranscript.length > 0 && (
            <button
              onClick={copyTranscriptText}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={copying}
            >
              {copying ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy All</span>
                </>
              )}
            </button>
          )}
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search in transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="w-4 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Content section */}
      <div className="rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:shadow-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-400 dark:border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Loading transcript...</p>
          </div>
        ) : filteredTranscript && filteredTranscript.length > 0 ? (
          <div className="space-y-4">
            {filteredTranscript.map((item) => (
              <TranscriptTile
                key={item._id}
                timestamp={{ start: item.start, end: item.end }}
                text={item.text}
              />
            ))}
          </div>
        ) : searchTerm && data.transcript?.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No results found for "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 font-medium">No transcript available.</p>
            <IconButton
              type="button"
              onClick={fetchTranscript}
              className="mt-2 font-medium px-6"
              isLoading={loading}
              icon={CloudDownload}
              iconPosition="right"
            >
              Get Transcript
            </IconButton>
            {!videoId && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Please select a video to view its transcript.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptList;