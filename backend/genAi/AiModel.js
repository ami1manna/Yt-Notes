require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI with API key
const geminiApiKey = process.env.GEMINI_API_KEY;
console.log("geminiApiKey:", geminiApiKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
exports.genAIModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

