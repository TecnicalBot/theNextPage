import dbConnect from "@/db";
import User from "@/db/models/user";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    user.password = password;
    await user.save();

    return Response.json({ message: "Password changed." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
