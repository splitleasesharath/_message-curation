import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
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

    const messages = await prisma.message.findMany({
      where: {
        threadId: params.id,
        deletedAt: null,
      },
      include: {
        guestUser: true,
        hostUser: true,
        originatorUser: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const thread = await prisma.thread.findUnique({
      where: { id: params.id },
      include: {
        listing: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        messages,
        thread,
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
