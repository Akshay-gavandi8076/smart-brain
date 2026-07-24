import OpenAI from "openai";
import { serverEnv } from "../../lib/env/server";

export const openai = new OpenAI({
  apiKey: serverEnv.OPENAI_API_KEY,
});

export async function embed(text: string): Promise<number[]> {
  const { data } = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return data[0].embedding;
}
