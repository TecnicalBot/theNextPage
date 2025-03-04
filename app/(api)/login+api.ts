import dbConnect from "@/db";
import User from "@/db/models/user";
import { comparePassword } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = comparePassword(password, user.password);

    if (!isPasswordValid) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    return Response.json({ message: "Login successful." }, { status: 200 });
  } catch (error) {
    console.error(error as any);
    return Response.json({ error }, { status: 500 });
  }
}
