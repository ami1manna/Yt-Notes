import axios from "axios";
import { handleAxiosError } from "./Error.js";

export async function addTranscript({ videoId }) {
    if (!videoId) return { error: "Enter a valid Video ID" };

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/transcript/addTranscript`,
            { videoId }
        );
        
        // Handle the case where an existing transcript is returned
        if (response.data && response.data.existingTranscript) {
            return response.data.existingTranscript.transcript;
        }
        
        // Handle the case where a newly created transcript is returned
        if (response.data && response.data.transcript) {
            return response.data.transcript;
        }
        
        console.error("Unexpected API response structure:", response.data);
        return { error: "Invalid response format from server" };
    } catch (error) {
        console.error("Transcript API error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to load transcript";
        return { error: errorMessage };
    }
}


export async function getTranscript({ videoId }) {
    if (!videoId) return { error: "Enter a valid Video ID" };

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/transcript/getTranscript?videoId=${videoId}`
        );

        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
}


