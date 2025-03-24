const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI with API key
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI("AIzaSyA88srZwqJVOE_F0x0Sus0BX_7zVJhGR8w");
exports.genAIModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

