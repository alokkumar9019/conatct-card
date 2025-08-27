import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// --- IMPORTANT: PASTE YOUR SPREADSHEET ID HERE ---
const SPREADSHEET_ID = "1b2iNYMT2x7MmGzmn2FV8_L4O6d-tw6TGI0RknmFu_WQ";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    // Authenticate with Google using the credentials you set up
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Connect to your document
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({
      Timestamp: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      Email: email,
    });

    return NextResponse.json({ message: "Email stored successfully!" });
  } catch (error) {
    console.error("Error storing email:", error);
    return NextResponse.json(
      { error: "Failed to store email." },
      { status: 500 }
    );
  }
}
