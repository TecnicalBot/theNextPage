import dbConnect from "@/db";
import User from "@/db/models/user";
import { hashPassword } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return Response.json({ error: "User already exists!" }, { status: 403 });
    }

    const hashedPassword = hashPassword(password);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error as any);
    return Response.json({ error }, { status: 500 });
  }
}
