import React, { useEffect, useState } from "react";
import TranscriptTile from "../ui/TranscriptTile"; // Fixed component name import
import { getTranscript } from "../../utils/Transcript";
import { toast, ToastContainer } from "react-toastify";


import "react-toastify/dist/ReactToastify.css";

const TranscriptList = ({ videoId }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
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

  // Filter transcript based on search term
  const filteredTranscript = data.transcript?.filter(item => 
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer />
      
      {/* Title and search bar */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Video Transcript</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search in transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
             <Search className="w-4 h-5"/>
          </div>
        </div>
      </div>
      
      {/* Content section */}
      <div className=" rounded-xl p-6 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading transcript...</p>
          </div>
        ) : filteredTranscript && filteredTranscript.length > 0 ? (
          <div className="space-y-4">
            {filteredTranscript.map((item) => (
              <TranscriptTile
                key={item._id?.$oid || item._id}
                timestamp={{ start: item.start, end: item.end }}
                text={item.text}
              />
            ))}
          </div>
        ) : searchTerm && data.transcript?.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No results found for "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-2 text-blue-500 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 font-medium">No transcript available.</p>
            {!videoId && (
              <p className="text-gray-500 text-sm mt-2">Please select a video to view its transcript.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptList;