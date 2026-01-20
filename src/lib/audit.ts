import { prisma } from './prisma';
import { AuditAction } from '@prisma/client';

export async function createAuditLog({
  userId,
  action,
  entityType,
  entityId,
  metadata,
}: {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
}) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      metadata: metadata || {},
    },
  });
}
