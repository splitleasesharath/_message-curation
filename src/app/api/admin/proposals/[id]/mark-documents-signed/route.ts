import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';
import { sendSMS } from '@/services/sms';
import { sendEmail } from '@/services/email';

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

    // Get the proposal with thread information
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
      include: {
        thread: {
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
        },
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      );
    }

    if (!proposal.thread || proposal.thread.messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Thread not found for proposal' },
        { status: 404 }
      );
    }

    // Update proposal
    await prisma.proposal.update({
      where: { id: params.id },
      data: {
        leaseDocumentsSigned: true,
      },
    });

    // Get Split Bot user
    const splitBotUser = await prisma.user.findFirst({
      where: { isSplitBot: true },
    });

    if (!splitBotUser) {
      return NextResponse.json(
        { success: false, error: 'Split Bot user not found' },
        { status: 500 }
      );
    }

    const firstMessage = proposal.thread.messages[0];
    const guestUser = firstMessage.guestUser;
    const hostUser = firstMessage.hostUser;

    const messageBody =
      'Great news! Your lease documents have been signed and processed. You can now proceed with your move-in arrangements.';

    // Create message for both guest and host
    const message = await prisma.message.create({
      data: {
        messageBody,
        guestUserId: guestUser.id,
        hostUserId: hostUser.id,
        originatorUserId: splitBotUser.id,
        threadId: proposal.thread.id,
      },
    });

    // Send notifications to both guest and host
    await Promise.all([
      sendSMS({ to: guestUser.email, message: messageBody }),
      sendEmail({
        to: guestUser.email,
        subject: 'Lease Documents Signed - Split Lease',
        text: messageBody,
        html: `<p>${messageBody}</p>`,
      }),
      sendSMS({ to: hostUser.email, message: messageBody }),
      sendEmail({
        to: hostUser.email,
        subject: 'Lease Documents Signed - Split Lease',
        text: messageBody,
        html: `<p>${messageBody}</p>`,
      }),
    ]);

    // Create audit logs
    await Promise.all([
      createAuditLog({
        userId: session.user.id,
        action: 'LEASE_DOCUMENTS_SIGNED',
        entityType: 'Proposal',
        entityId: params.id,
        metadata: {
          messageId: message.id,
        },
      }),
      createAuditLog({
        userId: session.user.id,
        action: 'MESSAGE_CREATED',
        entityType: 'Message',
        entityId: message.id,
        metadata: {
          templateName: 'lease-documents-signed',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        proposal,
        message,
      },
    });
  } catch (error) {
    console.error('Error marking lease documents as signed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark lease documents as signed' },
      { status: 500 }
    );
  }
}
