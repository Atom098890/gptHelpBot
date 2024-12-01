import fs from "fs";
import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();

class OpenAIConfig {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.TOKEN_AI
        });
    }

    async chat(messages) {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages,
            });

            return response.choices[0].message.content;
        } catch (error) {
            throw new Error(`Failed method chat in opanaiconfig ${error.message}`);
        }
    }

    async transcription(value) {
        try {
            const transcription = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(value),
                model: "whisper-1",
            });
            return transcription.text;
        } catch (error) {
            console.error("Error during transcription:", error.message);
        }
    }
}

export const openai = new OpenAIConfig();