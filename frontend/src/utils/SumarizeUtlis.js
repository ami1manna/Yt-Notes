import axios from "axios";
import { handleAxiosError } from "./Error";

export const getSummary = async (videoId)=>{
    if (!videoId) return { error: "Enter a valid Video ID" };

    try{
        const result = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/transcript/summarize?videoId=${videoId}`);
        return result.data;
    }
    catch(error){
        return handleAxiosError(error);
    }
}
 

  export const getEducationalNotes = async (videoId) => {
   
    if (!videoId) return { error: "Enter a valid Video ID" };
    try {
      const result = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/transcript/educational-notes?videoId=${videoId}`);
    
      return result.data;
    }
    catch (error) {
      return handleAxiosError(error);
    }
  };
  