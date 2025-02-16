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
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
  
    return [hours ? `${hours}H` : "", minutes ? `${minutes}M` : ""]
      .filter(Boolean) // Removes empty values
      .join("");
  }
  