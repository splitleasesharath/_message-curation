import { Message, User, Thread, Listing, Proposal } from '@prisma/client';

export type MessageWithRelations = Message & {
  guestUser: User;
  hostUser: User;
  originatorUser: User;
  thread: Thread & {
    listing: Listing;
  };
};

export type ThreadWithMessages = Thread & {
  listing: Listing;
  messages: (Message & {
    guestUser: User;
    hostUser: User;
    originatorUser: User;
  })[];
};

export type SplitBotRecipient = 'guest' | 'host';

export interface CreateSplitBotMessageRequest {
  threadId: string;
  messageBody: string;
  recipientType: SplitBotRecipient;
  templateName?: string;
}

export interface ForwardMessageRequest {
  messageId: string;
  recipientEmail?: string;
}

export interface MarkLeaseDocumentsSignedRequest {
  proposalId: string;
}

export interface ThreadSearchParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  limit: number;
  offset: number;
}
