// src/logger.js
export function Log(event, data) {
  // Extend to send logs to a backend or store in localStorage if needed
  console.log(`[${new Date().toISOString()}] ${event}:`, data);
}
