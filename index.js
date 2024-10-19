const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const genAI = new GoogleGenerativeAI("AIzaSyCEHCgeCScEGWHoyNlQishdxBFc76rXqCw");

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

// Define a route to handle API requests
app.get('/generate', async (req, res) => {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const userInput = req.query.input; // Assuming input is passed as a query parameter

  try {
    const result = await chatSession.sendMessage(userInput);
    res.send(result.response.text());
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).send('Error generating response');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});