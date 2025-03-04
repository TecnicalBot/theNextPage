import dbConnect from "@/db";
import User from "@/db/models/user";
import { sendEmail } from "@/lib/email";
import { generateOTP } from "@/lib/utils";

export async function POST(req: Request) {
  const { email } = await req.json();

  const otp = generateOTP();
  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    user.otp = parseInt(otp);
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="background-color: #f4f4f4; padding: 20px; text-align: center;"
    >
      <tr>
        <td>
          <table
            width="400"
            cellspacing="0"
            cellpadding="0"
            style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);"
          >
            <tr>
              <td style="font-size: 24px; font-weight: bold; color: #333;">
                OTP Verification
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 16px; color: #555;">
                Your one-time password (OTP) is:
              </td>
            </tr>
            <tr>
              <td
                style="font-size: 30px; font-weight: bold; color: #007bff; padding: 10px 0;"
              >
                ${otp}
              </td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #666;">
                This OTP is valid for 10 minutes. Do not share it with anyone.
              </td>
            </tr>
            <tr>
              <td style="padding-top: 15px; font-size: 14px; color: #888;">
                If you did not request this, please ignore this email.
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px; font-size: 12px; color: #999;">
                &copy; 2025 Your Company. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
    await sendEmail(email, "Verification OTP", html);
    return Response.json({ message: "Otp has been sent." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
