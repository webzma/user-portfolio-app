import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, message, recipientId, recipientEmail } =
      await request.json();

    // Validate input
    if (!name || !email || !message || !recipientId || !recipientEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real application, you would send an email here
    // For this example, we'll just log the message
    console.log(
      `Message from ${name} (${email}) to ${recipientEmail}:`,
      message
    );

    // You could use a service like SendGrid, Mailgun, etc.
    // Example with SendGrid would be:
    // await sendgrid.send({
    //   to: recipientEmail,
    //   from: 'your-app@example.com',
    //   subject: `New message from ${name} via your portfolio`,
    //   text: `From: ${name} (${email})\n\n${message}`,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
