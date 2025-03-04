import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HUGGING_FACE_API_KEY);

export async function POST(req: Request) {
  const { text } = await req.json();
  try {
    const genPrompt = await inference.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant skilled in creating highly detailed and descriptive prompts for image generation based on the given context.",
        },
        {
          role: "user",
          content: `The context is: ${text}`,
        },
      ],
    });

    const prompt = genPrompt.choices[0].message.content;

    if (!prompt) return;

    const res: Blob = await inference.textToImage({
      model: "stabilityai/stable-diffusion-3.5-large",
      //model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
    });

    return new Response(res);
  } catch (error) {
    console.error(error);
  }
}
