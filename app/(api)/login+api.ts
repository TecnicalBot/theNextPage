import dbConnect from "@/db";
import User, { PlanType } from "@/db/models/user";
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

    if (user.creditsExpiry < Date.now()) {
      switch (user.plan) {
        case PlanType.FREE:
          user.credits = 15;
          break;
        case PlanType.PLUS:
          user.credits = 30;
          break;
        case PlanType.PRO:
          user.credits = 50;
          break;
      }

      user.creditsExpiry = Date.now() + 24 * 60 * 60 * 1000;
    }

    await user.save();

    return Response.json({ message: "Login successful." }, { status: 200 });
  } catch (error) {
    console.error(error as any);
    return Response.json({ error }, { status: 500 });
  }
}
