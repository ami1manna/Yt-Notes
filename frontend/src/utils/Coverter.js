// src/utils/formatUtils.js
export function secondsToHHMMSS(totalSeconds) {
  if (!totalSeconds && totalSeconds !== 0) return "";
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [hours, minutes, seconds]
    .map(unit => (unit < 10 ? `0${unit}` : unit))
    .join(':');
}

export function secondsToHHMM(totalSeconds) {
  if (!totalSeconds && totalSeconds !== 0) return "";
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [hours, minutes]
    .map(unit => (unit < 10 ? `0${unit}` : unit))
    .join(':');
}

export function formatDuration(totalSeconds) {
  if (!totalSeconds && totalSeconds !== 0) return "0M";
  if (isNaN(totalSeconds)) return "0M";
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  const formattedHours = hours > 0 ? `${hours}H` : "";
  const formattedMinutes = minutes > 0 ? `${minutes}M` : "";
  const formattedSeconds = (!hours && minutes < 10) ? `${seconds}S` : "";
  
  const formatted = [formattedHours, formattedMinutes, formattedSeconds]
    .filter(Boolean)
    .join(" ");
    
  return formatted || "1M";
}