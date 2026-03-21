const Product = require("../models/Product");

// We import the new official Gemini SDK
const { GoogleGenAI } = require("@google/genai"); 

exports.chatWithAi = async (req, res) => {
    try {
        // Initialize AI with the correct API key
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Fetch products as context for the AI
        const products = await Product.find({ isDeleted: false });
        
        // Summarize products to create an organized catalog the AI can easily read
        const catalog = products.map(p => `- ${p.title}: Rs. ${p.price} (Stock: ${p.stockQuantity}). ${p.description.substring(0, 150)}...`).join('\n');

        const systemPrompt = `You are a helpful, enthusiastic AI shopping assistant for HealthKart. 
Your job is to help users find the best products based on their needs.
Here is the current HealthKart inventory:
${catalog}

When recommending a product, always use the exact name and price in Rupees (always use 'Rs.' instead of '$'). If asked about something we don't have, politely mention you only assist with HealthKart's current inventory. Be concise, friendly, and conversational! Output clean texts or bullet points.`;

        // Send a request to the blazing fast Gemini 2.5 Flash model
        // We use the modern genai structure: ai.models.generateContent
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Question: " + message }] }
            ]
        });

        res.status(200).json({ reply: response.text });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: "Failed to communicate with AI.", error: error.message });
    }
};
