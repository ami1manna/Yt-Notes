export function secondsToHHMMSS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map(unit => (unit < 10 ? `0${unit}` : unit)) // Ensure 2-digit format
      .join(':');
  }

  export function secondsToHHMM(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes]
      .map(unit => (unit < 10 ? `0${unit}` : unit)) // Ensure 2-digit format
      .join(':');
  }

  export function formatDuration(totalSeconds) {
    if (!totalSeconds || isNaN(totalSeconds)) return "0M";
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    // Format with leading zeros for more consistent display
    const formattedHours = hours > 0 ? `${hours}H` : "";
    const formattedMinutes = minutes > 0 ? `${minutes}M` : "";
    const formattedSeconds = (!hours && minutes < 10) ? `${seconds}S` : "";
    
    const formatted = [formattedHours, formattedMinutes, formattedSeconds]
      .filter(Boolean) // Removes empty values
      .join(" ");
      
    // Return at least minutes if the duration is very short
    return formatted || "1M";
  }