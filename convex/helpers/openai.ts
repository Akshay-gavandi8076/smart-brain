import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 second

function isRetryableError(error: unknown) {
  if (!(error instanceof OpenAI.APIError)) {
    return false;
  }

  return (
    error.status === 429 || // Rate limit
    error.status === 500 || // Internal server error
    error.status === 502 || // Bad gateway
    error.status === 503 || // Service unavailable
    error.status === 504 // Gateway timeout
  );
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function embed(text: string): Promise<number[]> {
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const { data } = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
      });

      return data[0].embedding;
    } catch (error) {
      attempt++;

      if (!isRetryableError(error) || attempt > MAX_RETRIES) {
        throw error;
      }

      const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);

      console.log(
        `OpenAI request failed. Retrying attempt ${attempt}/${MAX_RETRIES} in ${delay}ms...`,
      );

      await wait(delay);
    }
  }

  throw new Error("Failed to generate embedding after retries");
}
