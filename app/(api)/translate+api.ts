const HUGGING_FACE_URL =
  "https://api-inference.huggingface.co/models/SnypzZz/Llama2-13b-Language-translate";

const headers = {
  Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
  "Content-Type": "application/json",
};

export async function POST(req: Request) {
  const { text } = await req.json();
  const body = JSON.stringify({
    inputs: text,
  });
  try {
    const response = await fetch(HUGGING_FACE_URL, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const data = await response.json();
    return Response.json(data[0].generated_text);
  } catch (error) {
    console.error(error);
  }
}
