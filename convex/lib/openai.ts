import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function embed(text: string): Promise<number[]> {
  const { data } = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return data[0].embedding;
}
