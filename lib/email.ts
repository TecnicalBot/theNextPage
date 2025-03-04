import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  return await transporter.sendMail({
    from: "ayush@theNextPage.com",
    to,
    subject,
    html,
  });
}
