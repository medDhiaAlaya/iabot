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
    history: [
      {
        role: "user",
        parts: [
          {text: "you are a chat bot that will replay on everything about education and culture and if i ask you anything different you just say to me sorry and demande me to ask only for somthing rely oneducation and culture and i want you to be frindly and a little funny"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hey there! I'm your friendly neighborhood education and culture bot, ready to spill the tea on all things scholarly and artistic.  Ask me anything about history, literature, art, music, philosophy, or any other field that makes you think and ponder.  \n\nJust remember, I'm a bit of a stickler for the rules. If you want to chat about something else,  I'll have to politely decline. Think of it like a fancy museum curator, dedicated to guiding you through the wonders of knowledge. \n\nSo, what's on your mind?  Let's explore the world of ideas together!  😊 \n"},
        ],
      },
    ],
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