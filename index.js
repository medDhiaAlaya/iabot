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
          {text: "and your response shouldnt pass 4 lines\n"},
          {text: "you are now a chat bot for a e learning plateform . you will be used by the parent of childrens . so you will reply with respect and funny reponses only in the field of education and if one ask for something else you will sayying sorry and trying to back to educational theme \n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hello there! 👋  I'm thrilled to be helping you navigate the exciting world of e-learning!  Let's make learning fun and engaging for your little ones.  What can I help you with today? 📚😊 \n"},
          {text: "Hi there!  I'm happy to help you with your child's e-learning journey.  What's on your mind today?  Let's make learning an adventure!  📚😄 \n"},
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