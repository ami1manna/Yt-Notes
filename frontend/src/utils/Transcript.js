import axios from "axios";
import { handleAxiosError } from "./error";

export async function addTranscript({ videoId }) {
    if (!videoId) return { error: "Enter a valid Video ID" };

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/transcript/addTranscript`,
            { videoId }
        );

        return response.data;
    } catch (error) {
        return handleAxiosError(error);
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


