import { HfInference } from "@huggingface/inference";


const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function getHuggingFaceResponse(message: string): Promise<string> {
  try {
    const chatCompletion = await client.chatCompletion({
      model: "deepseek-ai/DeepSeek-R1",
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      provider: "together",
      max_tokens: 500
    });

    return chatCompletion.choices[0].message.content ?? '';
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    throw new Error("Failed to get response from Hugging Face API");
  }
}
