import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';
import { sendSMS } from '@/services/sms';
import { sendEmail } from '@/services/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !requireAdmin(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { threadId, messageBody, recipientType, templateName } = body;

    // Get the thread to determine guest and host
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        messages: {
          where: { deletedAt: null },
          take: 1,
          include: {
            guestUser: true,
            hostUser: true,
          },
        },
      },
    });

    if (!thread || thread.messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Thread not found' },
        { status: 404 }
      );
    }

    const firstMessage = thread.messages[0];
    const guestUser = firstMessage.guestUser;
    const hostUser = firstMessage.hostUser;

    // Get Split Bot user ID
    const splitBotUser = await prisma.user.findFirst({
      where: { isSplitBot: true },
    });

    if (!splitBotUser) {
      return NextResponse.json(
        { success: false, error: 'Split Bot user not found' },
        { status: 500 }
      );
    }

    const recipientUser = recipientType === 'guest' ? guestUser : hostUser;

    // Create the message
    const message = await prisma.message.create({
      data: {
        messageBody,
        guestUserId: guestUser.id,
        hostUserId: hostUser.id,
        originatorUserId: splitBotUser.id,
        threadId,
      },
      include: {
        guestUser: true,
        hostUser: true,
        originatorUser: true,
        thread: {
          include: {
            listing: true,
          },
        },
      },
    });

    // Send via SMS and Email
    await Promise.all([
      sendSMS({
        to: recipientUser.email, // Replace with actual phone number field
        message: messageBody,
      }),
      sendEmail({
        to: recipientUser.email,
        subject: 'New message from Split Lease',
        text: messageBody,
        html: `<p>${messageBody}</p>`,
      }),
    ]);

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'MESSAGE_CREATED',
      entityType: 'Message',
      entityId: message.id,
      metadata: {
        recipientType,
        templateName,
      },
    });

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
