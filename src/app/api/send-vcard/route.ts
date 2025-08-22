import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Check if the API key is available. This provides a clearer error if it's missing.
if (!process.env.RESEND_API_KEY) {
  console.error("Resend API key is not set. Please check your .env.local file.");
  throw new Error("Missing RESEND_API_KEY environment variable.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const contactInfo = {
  name: "Dan Agarwal",
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address provided.' }, { status: 400 });
    }

    // --- Read the vCard file ---
    const vcfPath = path.join(process.cwd(), 'public', 'dan-agarwal.vcf');

    // Check if file exists before reading
    if (!fs.existsSync(vcfPath)) {
      console.error("vCard file not found at:", vcfPath);
      return NextResponse.json({ error: 'Contact file is missing on the server.' }, { status: 500 });
    }

    const vcfContent = fs.readFileSync(vcfPath);

    // Send email via Resend (destructure only error, ignore unused data)
    const { error } = await resend.emails.send({
      from: 'Contact Card <onboarding@resend.dev>',
      to: [email],
      subject: `Contact Card for ${contactInfo.name}`,
      html: `<p>Hi there,</p><p>Here is the contact card for ${contactInfo.name}, as you requested.</p>`,
      attachments: [
        {
          filename: 'dan-agarwal.vcf',
          content: vcfContent,
        },
      ],
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ error: error.message || 'Failed to send email via Resend.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully!' });

  } catch (error: unknown) {
    // Use unknown instead of any, with type guard
    if (error instanceof Error) {
      console.error('An unexpected error occurred in /api/send-vcard:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('An unexpected non-error was thrown in /api/send-vcard:', error);
      return NextResponse.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
    }
  }
}
