import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';
import { sendForwardedMessageEmail } from '@/services/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !requireAdmin(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const recipientEmail =
      body.recipientEmail || process.env.INTERNAL_SUPPORT_EMAIL;

    // Get the message with all related data
    const message = await prisma.message.findUnique({
      where: { id: params.id },
      include: {
        guestUser: true,
        hostUser: true,
        thread: {
          include: {
            listing: true,
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    // Send forwarded email
    const emailResult = await sendForwardedMessageEmail({
      to: recipientEmail!,
      messageBody: message.messageBody,
      guestName: `${message.guestUser.firstName} ${message.guestUser.lastName}`,
      guestEmail: message.guestUser.email,
      hostName: `${message.hostUser.firstName} ${message.hostUser.lastName}`,
      hostEmail: message.hostUser.email,
      listingName: message.thread.listing.name,
      messageId: message.id,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update message as forwarded
    await prisma.message.update({
      where: { id: params.id },
      data: {
        forwarded: true,
        forwardedAt: new Date(),
      },
    });

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'MESSAGE_FORWARDED',
      entityType: 'Message',
      entityId: params.id,
      metadata: {
        recipientEmail,
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Message forwarded successfully' },
    });
  } catch (error) {
    console.error('Error forwarding message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to forward message' },
      { status: 500 }
    );
  }
}
