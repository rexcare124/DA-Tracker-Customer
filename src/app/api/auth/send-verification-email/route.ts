// /app/api/auth/send-verification-email/route.ts
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

export async function POST(request: Request) {
  // SendGrid requires a single API key
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  // You also need a verified sender email address
  const sendgridSenderEmail = process.env.SENDGRID_SENDER_EMAIL;

  if (!sendgridApiKey || !sendgridSenderEmail) {
    console.error(
      "Missing required environment variables for SendGrid (SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL)"
    );
    return new NextResponse("Server is not configured for sending emails.", {
      status: 500,
    });
  }

  // Set the API key for the SendGrid mail client
  sgMail.setApiKey(sendgridApiKey);

  try {
    const body = await request.json();

    // Validate input data
    const { email, otp } = body;

    if (!email || !otp) {
      console.error(
        "Validation failed: Email or OTP missing in request body.",
        body
      );
      return new NextResponse(
        "Email and OTP are required in the request body.",
        { status: 400 }
      );
    }

    // This is the message object that SendGrid expects
    const msg = {
      to: email,
      from: sendgridSenderEmail, // Use a verified sender email address
      subject: "Your Email Verification Code",
      html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`,
    };

    // Send the email using SendGrid
    await sgMail.send(msg);

    return NextResponse.json({
      message: "Verification email sent successfully.",
    });
  } catch (error: any) {
    // SendGrid might return more specific errors, which can be logged
    console.error("SENDGRID_VERIFICATION_EMAIL_ERROR", {
      message: error.message,
      stack: error.stack,
      // SendGrid errors often have a response body with more details
      response: error.response?.body,
    });

    if (
      error instanceof SyntaxError &&
      error.message.includes("Unexpected end of JSON input")
    ) {
      console.error("Possible cause: The request body was empty.");
      return new NextResponse("Request body is empty or invalid.", {
        status: 400,
      });
    }
    return new NextResponse("Error sending verification email.", {
      status: 500,
    });
  }
}
