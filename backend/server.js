const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { destination, days } = req.body;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Create a detailed ${days} day travel itinerary for ${destination}, India. 
    For each day include:
    - Morning, afternoon and evening activities
    - Local food recommendations
    - Travel tips
    Format it nicely with Day 1, Day 2 etc.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ itinerary: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});