import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';

export async function DELETE(
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

    // Soft delete the thread and all its messages
    await prisma.$transaction(async (tx) => {
      // Soft delete all messages in the thread
      await tx.message.updateMany({
        where: { threadId: params.id },
        data: { deletedAt: new Date() },
      });

      // Soft delete the thread
      await tx.thread.update({
        where: { id: params.id },
        data: { deletedAt: new Date() },
      });
    });

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'THREAD_DELETED',
      entityType: 'Thread',
      entityId: params.id,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Thread deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete thread' },
      { status: 500 }
    );
  }
}
