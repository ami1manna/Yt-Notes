import React, { useEffect, useRef, useState } from "react";
import TranscriptTile from "../ui/TranscriptTitle";
import { getTranscript } from "../../utils/Transcript";
import { toast } from "react-toastify";

const TranscriptList = ({ videoId }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
   const inputRef = useRef(null);
  
  useEffect(() => {
    if (!videoId) return; // Prevents unnecessary API calls if videoId is empty

    
    setLoading(true);

    const abortController = new AbortController();
    const fetchTranscript = async () => {
      try {
        const result = await getTranscript({ videoId });

        if (result.error) {
          toast.error(result.error, {
            position: "top-right",
            icon: "⚠️"
          });
      
          setData({});
          return;
        }

        setData(result);
      } catch (error) {
        if (error.name !== "AbortError") {
          
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();

    return () => abortController.abort(); // Cleanup function to cancel previous requests
  }, [videoId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
       

      {loading ? (
        <p className="text-center text-gray-600">Loading transcript...</p>
      ) : data.transcript && data.transcript.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          {data.transcript.map((item) => (
            <TranscriptTile
              key={item._id?.$oid || item._id} // Handles both object ID and string ID
              timestamp={{ start: item.start, end: item.end }}
              text={item.text}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No transcript available.</p>
      )}
    </div>
  );
};

export default TranscriptList;
