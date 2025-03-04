import dbConnect from "@/db";
import User from "@/db/models/user";

const HUGGING_FACE_URL =
  "https://api-inference.huggingface.co/models/SnypzZz/Llama2-13b-Language-translate";

const headers = {
  Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
  "Content-Type": "application/json",
};

export async function POST(req: Request) {
  const { text, email } = await req.json();
  const body = JSON.stringify({
    inputs: text,
  });
  try {
    await dbConnect();
    const user = await User.findOne({ email });

    if (user.credits <= 0) {
      return Response.json(
        { error: "You do not have enough credits." },
        { status: 400 }
      );
    }
    const response = await fetch(HUGGING_FACE_URL, {
      method: "POST",
      headers: headers,
      body: body,
    });

    user.credits -= 1;
    await user.save();
    const data = await response.json();
    return Response.json(data[0].generated_text);
  } catch (error) {
    console.error(error);
  }
}
