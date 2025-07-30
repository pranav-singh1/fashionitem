require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Check for OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('ERROR: OPENAI_API_KEY is missing in .env');
  process.exit(1);
}

const client = new OpenAI({ apiKey });

app.post('/api/fashion-piece', async (req, res) => {
  const { seed } = req.body;
  console.log("Received request with seed:", seed);
  if (!seed) {
    console.log("Missing seed in request body");
    return res.status(400).json({ error: 'Missing seed in request body' });
  }
  const prompt = `
    Give me a Japanese archive fashion piece as a JSON object with these fields: 
    brand, designer, category, color, and description. 
    Only output valid JSON. 
    Make it unique for this seed: ${seed}
  `;
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });
    const text = response.choices[0].message.content;
    console.log("OpenAI response text:", text);
    let data;
    try {
      // Remove code block markers if present
      const cleaned = text.replace(/```json|```/g, '').trim();
      data = JSON.parse(cleaned);
    } catch (jsonErr) {
      console.log("JSON parse error:", jsonErr, "Raw text:", text);
      return res.status(500).json({ error: 'Failed to parse OpenAI response as JSON', raw: text });
    }
    res.json(data);
  } catch (e) {
    console.error('OpenAI API error:', e);
    res.status(500).json({ error: 'OpenAI API error', details: e.message });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 