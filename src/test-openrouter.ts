import { config } from "dotenv";
import OpenAI from "openai";

config();

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY is missing");
}

const client = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
});

const response = await client.chat.completions.create({
model: "openai/gpt-4o-mini-2024-07-18",
  messages: [{ role: "user", content: "Hello! explain the localhost?" }],
});

console.log(response.choices[0]?.message.content);
