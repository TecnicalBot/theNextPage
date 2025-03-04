import dbConnect from "@/db";
import User from "@/db/models/user";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { session } = await req.json();
    // console.log("email>", session);
    const user = await User.findOne({ email: session });
    // console.log(user);
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
