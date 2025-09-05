import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const contactInfo = {
  name: "Dan Agarwal",
  title: "VP of Sales",
  email: "nikolai@pclnxai.com",
  number: "(925)784-9248",
  company: "PCLnXAI",
  website: "https://pclnxai.com/",
  vCardUrl: "/dan-agarwal.vcf",
};

export async function POST(request: NextRequest) {
  const { email: recipientEmail } = await request.json();

  if (!recipientEmail) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const vcfPath = path.join(process.cwd(), "public", "dan-agarwal.vcf");
  if (!fs.existsSync(vcfPath)) {
    return NextResponse.json(
      { error: "Contact file is missing." },
      { status: 500 }
    );
  }
  const vcfContent = fs.readFileSync(vcfPath);

  // --- EMAIL #1: To the User ---
  const mailToUser = {
    from: `"${contactInfo.name}" <${process.env.GMAIL_EMAIL}>`,
    to: recipientEmail,
    subject: `Contact Card for ${contactInfo.name}`,
    html: `
    <p>Hi there,</p>
    <p>Thanks so much for connecting. It was great to meet you.</p>
    <p>To make it easy to stay in touch, here are my contact details:</p>
    <p>
      <strong>Email:</strong> <a href="mailto:${contactInfo.email}">${contactInfo.email}</a><br>
      <strong>Phone:</strong> ${contactInfo.number}
    </p>
    <p>I'm keen to find a time to discuss how we can work together to solve your payroll problem. Please let me know what time works best for you next week.</p>
    <p>I look forward to hearing from you.</p>
    <p>Best regards,</p>
    <p> <strong>${contactInfo.name}</strong></p>
  `,
    attachments: [
      {
        filename: "dan-agarwal.vcf",
        content: vcfContent,
        contentType: "text/vcard",
      },
    ],
  };

  // --- EMAIL #2: Notification to You ---
  // const mailToOwner = {
  //   from: `"VCard Notifier" <${process.env.GMAIL_EMAIL}>`,
  //   to: process.env.YOUR_PERSONAL_EMAIL, // Sending to your email from environment variables
  //   subject: `New vCard Lead Captured!`,
  //   html: `
  //     <p>A new user has downloaded your vCard.</p>
  //     <p><b>Email:</b> ${recipientEmail}</p>
  //     <p><b>Time:</b> ${new Date().toLocaleString('en-US')}</p>
  //   `,
  // };

  try {
    // --- Send Email #1 to the user ---
    await transporter.sendMail(mailToUser);
    console.log(`Successfully sent vCard to ${recipientEmail}`);

    // --- If that succeeds, send Email #2 to yourself ---
    // We don't use 'await' here because we don't need to wait for the notification to send before responding to the user.
    // transporter.sendMail(mailToOwner)
    //   .then(() => console.log('Successfully sent notification to owner.'))
    //   .catch(err => console.error('Failed to send notification email:', err));

    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
