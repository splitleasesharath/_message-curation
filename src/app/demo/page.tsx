'use client';

import { useState } from 'react';
import CorporateHeader from '@/components/CorporateHeader';
import ThreadSelector from '@/components/ThreadSelector';
import ConversationHistory from '@/components/ConversationHistory';
import MessageDisplay from '@/components/MessageDisplay';
import SplitBotMessaging from '@/components/SplitBotMessaging';
import ModerationActions from '@/components/ModerationActions';
import { MessageWithRelations } from '@/types';

// Mock data
const mockGuestUser = {
  id: 'guest-1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@example.com',
  profilePhotoUrl: null,
  isSplitBot: false,
  role: 'USER' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockHostUser = {
  id: 'host-1',
  firstName: 'Michael',
  lastName: 'Chen',
  email: 'michael.chen@example.com',
  profilePhotoUrl: null,
  isSplitBot: false,
  role: 'USER' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSplitBotUser = {
  id: 'splitbot-1',
  firstName: 'Split',
  lastName: 'Bot',
  email: 'splitbot@splitlease.com',
  profilePhotoUrl: null,
  isSplitBot: true,
  role: 'ADMIN' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockListing = {
  id: 'listing-1',
  name: 'Cozy 2BR Apartment in Downtown',
  hostId: 'host-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockThread = {
  id: 'thread-1',
  listingId: 'listing-1',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date(),
  deletedAt: null,
  listing: mockListing,
};

const mockMessages: MessageWithRelations[] = [
  {
    id: 'msg-1',
    messageBody: 'Hi! I\'m interested in your listing. Is it still available for the dates I selected?',
    splitBotWarning: null,
    guestUserId: 'guest-1',
    hostUserId: 'host-1',
    originatorUserId: 'guest-1',
    threadId: 'thread-1',
    forwarded: false,
    forwardedAt: null,
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
    deletedAt: null,
    guestUser: mockGuestUser,
    hostUser: mockHostUser,
    originatorUser: mockGuestUser,
    thread: mockThread,
  },
  {
    id: 'msg-2',
    messageBody: 'Yes, the apartment is available! I\'d be happy to show you around. When would be a good time for you?',
    splitBotWarning: null,
    guestUserId: 'guest-1',
    hostUserId: 'host-1',
    originatorUserId: 'host-1',
    threadId: 'thread-1',
    forwarded: false,
    forwardedAt: null,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    deletedAt: null,
    guestUser: mockGuestUser,
    hostUser: mockHostUser,
    originatorUser: mockHostUser,
    thread: mockThread,
  },
  {
    id: 'msg-3',
    messageBody: 'Great! How about tomorrow at 2pm? By the way, here\'s my phone number: 555-1234',
    splitBotWarning: 'Contact information has been redacted for your safety.',
    guestUserId: 'guest-1',
    hostUserId: 'host-1',
    originatorUserId: 'guest-1',
    threadId: 'thread-1',
    forwarded: false,
    forwardedAt: null,
    createdAt: new Date('2024-01-15T11:00:00'),
    updatedAt: new Date('2024-01-15T11:00:00'),
    deletedAt: null,
    guestUser: mockGuestUser,
    hostUser: mockHostUser,
    originatorUser: mockGuestUser,
    thread: mockThread,
  },
  {
    id: 'msg-4',
    messageBody: 'We noticed your message contained contact information. For your safety and security, we\'ve removed it. Please use Split Lease messaging for all communications.',
    splitBotWarning: null,
    guestUserId: 'guest-1',
    hostUserId: 'host-1',
    originatorUserId: 'splitbot-1',
    threadId: 'thread-1',
    forwarded: false,
    forwardedAt: null,
    createdAt: new Date('2024-01-15T11:01:00'),
    updatedAt: new Date('2024-01-15T11:01:00'),
    deletedAt: null,
    guestUser: mockGuestUser,
    hostUser: mockHostUser,
    originatorUser: mockSplitBotUser,
    thread: mockThread,
  },
  {
    id: 'msg-5',
    messageBody: 'No problem! Tomorrow at 2pm works perfectly. See you then!',
    splitBotWarning: null,
    guestUserId: 'guest-1',
    hostUserId: 'host-1',
    originatorUserId: 'host-1',
    threadId: 'thread-1',
    forwarded: true,
    forwardedAt: new Date('2024-01-15T14:00:00'),
    createdAt: new Date('2024-01-15T12:00:00'),
    updatedAt: new Date('2024-01-15T12:00:00'),
    deletedAt: null,
    guestUser: mockGuestUser,
    hostUser: mockHostUser,
    originatorUser: mockHostUser,
    thread: mockThread,
  },
];

export default function DemoPage() {
  const [selectedMessage, setSelectedMessage] = useState<MessageWithRelations>(mockMessages[0]);

  const handleMessageClick = (message: MessageWithRelations) => {
    setSelectedMessage(message);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mock Corporate Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Split Lease Admin
              </h1>
              <span className="ml-4 text-sm text-gray-500">
                Message Curation (DEMO)
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">Demo User (Admin)</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Demo Mode - Using Mock Data
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                This is a preview with dummy data. Actions won't actually modify any data. Connect to Supabase in your production app for full functionality.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Thread Selection (Mock) */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thread Selection</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search for threads..."
                  className="input"
                  disabled
                />
                <select className="input" disabled>
                  <option>Cozy 2BR Apartment in Downtown - sarah.johnson@example.com</option>
                  <option>Modern Studio Loft - john.doe@example.com</option>
                  <option>Spacious 3BR House - jane.smith@example.com</option>
                </select>
                <div className="text-sm text-gray-500 text-center">
                  3 threads (mock data)
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Conversation History */}
          <div className="lg:col-span-1">
            <ConversationHistory
              messages={mockMessages}
              selectedMessageId={selectedMessage.id}
              onMessageClick={handleMessageClick}
            />
          </div>

          {/* Right Column: Message Details & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Message Display */}
            <MessageDisplay message={selectedMessage} />

            {/* Moderation Actions (Mock) */}
            <div className="space-y-4">
              <div className="card">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => alert('Demo Mode: Forward action would send email to support team')}
                    className="btn-purple flex items-center space-x-2"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Forward this message</span>
                  </button>

                  <button
                    onClick={() => alert('Demo Mode: Delete message action (would show confirmation)')}
                    className="btn-danger flex items-center space-x-2"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Message</span>
                  </button>
                </div>
              </div>

              <div className="card bg-red-50 border border-red-200">
                <button
                  onClick={() => alert('Demo Mode: Delete conversation action (would show confirmation)')}
                  className="btn-danger w-full flex items-center justify-center space-x-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Conversation</span>
                </button>
              </div>
            </div>

            {/* Split Bot Messaging (Mock) */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Split Bot Messages (Demo)
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Split Bot Messages go here
                  </label>
                  <textarea
                    rows={4}
                    className="input resize-none"
                    placeholder="Enter your message here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send to:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="recipient" defaultChecked className="mr-2" />
                      <span>Send to Guest</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="recipient" className="mr-2" />
                      <span>Send to Host</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => alert('Demo Mode: Would load "redacted contact info" template')}
                    className="btn-secondary w-full text-left"
                  >
                    Say Split Bot redacted contact info
                  </button>
                  <button
                    onClick={() => alert('Demo Mode: Would load "limit messages" template')}
                    className="btn-secondary w-full text-left"
                  >
                    Say please limit number of messages
                  </button>
                </div>

                <button
                  onClick={() => alert('Demo Mode: Would send Split Bot message via SMS and Email')}
                  className="btn-primary w-full"
                >
                  Send as Split Bot (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="mt-8 card bg-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Debug Information (Demo Data)
          </h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(
              {
                messageId: selectedMessage.id,
                threadId: selectedMessage.threadId,
                guestUserId: selectedMessage.guestUserId,
                hostUserId: selectedMessage.hostUserId,
                originatorUserId: selectedMessage.originatorUserId,
                forwarded: selectedMessage.forwarded,
                hasWarning: !!selectedMessage.splitBotWarning,
              },
              null,
              2
            )}
          </pre>
        </div>
      </main>
    </div>
  );
}
