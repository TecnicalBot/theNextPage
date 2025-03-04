import dbConnect from "@/db";
import User from "@/db/models/user";
import { PlanType } from "@/types/user";

export async function POST(req: Request) {
  const { email, plan } = await req.json();

  try {
    await dbConnect();
    const user = await User.findOne({ email });

    switch (plan) {
      case PlanType.Plus:
        user.plan = PlanType.Plus;
        user.credits += 30;
        break;
      case PlanType.Pro:
        user.plan = PlanType.Pro;
        user.credits += 50;
        break;
    }

    await user.save();
    return Response.json({ message: "Plan updated." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
