import dbConnect from "@/db";
import User from "@/db/models/user";

export async function POST(req: Request) {
  const { otp, email } = await req.json();
  try {
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (otp !== user.otp) {
      return Response.json({ error: "OTP didn't match" }, { status: 401 });
    }

    if (user.otpExpiry < Date.now()) {
      user.otp = undefined;
      await user.save();
      return Response.json({ error: "OTP expired!" }, { status: 403 });
    }

    user.otp = undefined;
    user.otp = undefined;
    await user.save();
    return Response.json(
      { message: "OTP verification successfull." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
