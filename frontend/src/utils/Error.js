
export function handleAxiosError(error) {
    if (error.response) {
        // Server responded with a status other than 2xx
        return { error: `Error ${error.response.status}: ${error.response.data?.message || "Something went wrong"}` };
    } else if (error.request) {
        // No response received
        return { error: "No response from server. Please check your network connection." };
    } else {
        // Other errors
        return { error: `Request failed: ${error.message}` };
    }
}
