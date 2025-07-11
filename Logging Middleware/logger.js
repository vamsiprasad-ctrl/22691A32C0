// Logging Middleware/logger.js
export function Log(event, data) {
  // You can extend this to send logs to a backend or store in localStorage
  console.log(`[${new Date().toISOString()}] ${event}:`, data);
}
