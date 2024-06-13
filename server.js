const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const { OpenAI } = require("openai");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

async function getOpenAIResponse(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: message + " (Répond uniquement avec du code html, css ou javascript et en moins de 1000 tokens)"
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0].message.content; // Accéder au bon chemin de la réponse
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
      throw new Error(error.response.data);
    } else {
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
}

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const botReply = await getOpenAIResponse(userMessage);
    res.json({ reply: botReply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});