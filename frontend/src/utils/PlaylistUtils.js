export const extractPlaylistId =(url)=> {
    try {
      // Remove any whitespace
      url = url.trim();
  
      // Regex patterns for different YouTube playlist URL formats
      const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*?list=([a-zA-Z0-9_-]+)/,
        /^([a-zA-Z0-9_-]+)$/ // Direct playlist ID
      ];
  
      for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return match[1];
        }
      }
  
      return null;
    } catch (error) {
      console.error('Error extracting playlist ID:', error);
      return null;
    }
  }

  export const validatePlaylistUrl = (url) => {
    // Basic YouTube playlist URL validation
    const youtubePlaylistRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/.+list=|youtu\.be\/.+list=)/;
    return youtubePlaylistRegex.test(url);
};