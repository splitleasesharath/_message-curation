import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !requireAdmin(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build search query
    const where = search
      ? {
          OR: [
            {
              listing: {
                name: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            },
            {
              messages: {
                some: {
                  OR: [
                    {
                      guestUser: {
                        email: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                    },
                    {
                      hostUser: {
                        email: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                    },
                    {
                      messageBody: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                  ],
                },
              },
            },
          ],
          deletedAt: null,
        }
      : { deletedAt: null };

    const [threads, totalCount] = await Promise.all([
      prisma.thread.findMany({
        where,
        include: {
          listing: true,
          messages: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.thread.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: threads,
        totalCount,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch threads' },
      { status: 500 }
    );
  }
}
