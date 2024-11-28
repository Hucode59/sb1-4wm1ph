const functions = require('firebase-functions');
const MistralClient = require('@mistralai/mistralai').default;

const mistral = new MistralClient({
  apiKey: process.env.MISTRAL_API_KEY
});

exports.chatMistral = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { messages } = req.body;

    const chatResponse = await mistral.chat({
      model: "mistral-tiny",
      messages,
      temperature: 0.7,
      maxTokens: 500
    });

    res.json({ response: chatResponse.choices[0].message.content });
  } catch (error) {
    console.error('Mistral AI Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});