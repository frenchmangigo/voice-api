const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Endpoint to generate voice
app.get('/voice-synthesis', async (req, res) => {
    const { id, text } = req.query;

    if (!text) {
        return res.status(400).send('Text query parameter is required.');
    }

    try {
        // Make a request to ElevenLabs Text-to-Speech API
        const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech', 
        {
            text: text,
            voice_id: id || "default_voice_id", // Replace with the desired voice ID or provide as a query parameter
        }, 
        {
            headers: {
                'Authorization': `Bearer ${ELEVENLABS_API_KEY}`,
                'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer' // Important for audio data
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(response.data);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to generate voice.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
