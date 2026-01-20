import nodemailer from 'nodemailer';

const emailProvider = process.env.EMAIL_PROVIDER || 'sendgrid';
const emailFrom = process.env.EMAIL_FROM || 'support@splitlease.com';

// Create transporter based on provider
const createTransporter = () => {
  if (emailProvider === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else if (emailProvider === 'postmark') {
    return nodemailer.createTransport({
      host: 'smtp.postmarkapp.com',
      port: 587,
      auth: {
        user: process.env.POSTMARK_API_KEY,
        pass: process.env.POSTMARK_API_KEY,
      },
    });
  }
  throw new Error('Invalid email provider');
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  try {
    const transporter = createTransporter();

    const result = await transporter.sendMail({
      from: emailFrom,
      to,
      subject,
      html,
      text,
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendForwardedMessageEmail({
  to,
  messageBody,
  guestName,
  guestEmail,
  hostName,
  hostEmail,
  listingName,
  messageId,
}: {
  to: string;
  messageBody: string;
  guestName: string;
  guestEmail: string;
  hostName: string;
  hostEmail: string;
  listingName: string;
  messageId: string;
}) {
  const html = `
    <h2>Forwarded Message from Split Lease</h2>
    <p><strong>Message ID:</strong> ${messageId}</p>
    <p><strong>Listing:</strong> ${listingName}</p>
    <hr />
    <p><strong>Guest:</strong> ${guestName} (${guestEmail})</p>
    <p><strong>Host:</strong> ${hostName} (${hostEmail})</p>
    <hr />
    <h3>Message:</h3>
    <p>${messageBody}</p>
  `;

  const text = `
Forwarded Message from Split Lease

Message ID: ${messageId}
Listing: ${listingName}

Guest: ${guestName} (${guestEmail})
Host: ${hostName} (${hostEmail})

Message:
${messageBody}
  `;

  return sendEmail({
    to,
    subject: `Forwarded Message - ${listingName}`,
    html,
    text,
  });
}
