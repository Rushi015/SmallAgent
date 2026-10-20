import { config } from "dotenv";
import OpenAI from "openai";
import { parseArgs } from "node:util";

config();

const { values } = parseArgs({
  options: {
    prompt: { type: "string", short: "p" },
    model: {
      type: "string",
      default:
        process.env.OPENROUTER_MODEL ??
        "openai/gpt-4o-mini-2024-07-18",
    },
  },
});

if (!values.prompt?.trim()) {
  console.error('Usage: npm run dev -- -p "Your prompt"');
  process.exit(1);
}

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error("OPENROUTER_API_KEY is missing from .env");
  process.exit(1);
}

const client = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
});

try {
  const stream = await client.chat.completions.create({
    model: values.model,
     messages: [{ role: "user", content: values.prompt }],
    stream:true
  });




  for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta.content

    if (typeof text === "string") {
      process.stdout.write(text);
      // console.log(text)
    }
  }

  process.stdout.write("\n");
} catch (error) {
  console.error(
    "OpenRouter request failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
}
