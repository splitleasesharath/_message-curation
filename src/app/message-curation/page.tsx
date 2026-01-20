'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import CorporateHeader from '@/components/CorporateHeader';
import ThreadSelector from '@/components/ThreadSelector';
import ConversationHistory from '@/components/ConversationHistory';
import MessageDisplay from '@/components/MessageDisplay';
import SplitBotMessaging from '@/components/SplitBotMessaging';
import ModerationActions from '@/components/ModerationActions';
import { MessageWithRelations } from '@/types';

export default function MessageCurationPage() {
  const { data: session, status } = useSession();
  const [selectedThreadId, setSelectedThreadId] = useState<string>();
  const [messages, setMessages] = useState<MessageWithRelations[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithRelations>();
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/api/auth/signin');
    }
    if (session?.user && !['ADMIN', 'SUPPORT_STAFF'].includes(session.user.role)) {
      redirect('/unauthorized');
    }
  }, [session, status]);

  // Load messages when thread is selected
  useEffect(() => {
    if (selectedThreadId) {
      loadMessages(selectedThreadId);
    }
  }, [selectedThreadId]);

  const loadMessages = async (threadId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/threads/${threadId}/messages`);
      const result = await response.json();

      if (result.success) {
        setMessages(result.data.messages);
        // Auto-select the first message
        if (result.data.messages.length > 0) {
          setSelectedMessage(result.data.messages[0]);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = (message: MessageWithRelations) => {
    setSelectedMessage(message);
  };

  const handleMessageSent = () => {
    // Reload messages after sending
    if (selectedThreadId) {
      loadMessages(selectedThreadId);
    }
  };

  const handleMessageDeleted = () => {
    // Reload messages after deletion
    if (selectedThreadId) {
      loadMessages(selectedThreadId);
    }
  };

  const handleThreadDeleted = () => {
    // Clear selection and reset
    setSelectedThreadId(undefined);
    setMessages([]);
    setSelectedMessage(undefined);
  };

  const handleMessageForwarded = () => {
    // Reload to show forwarded status
    if (selectedThreadId) {
      loadMessages(selectedThreadId);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CorporateHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Thread Selection */}
          <div className="lg:col-span-1">
            <ThreadSelector
              onThreadSelect={setSelectedThreadId}
              selectedThreadId={selectedThreadId}
            />
          </div>

          {/* Middle Column: Conversation History */}
          <div className="lg:col-span-1">
            {selectedThreadId ? (
              <ConversationHistory
                messages={messages}
                selectedMessageId={selectedMessage?.id}
                onMessageClick={handleMessageClick}
              />
            ) : (
              <div className="card">
                <p className="text-center text-gray-500">
                  Select a thread to view conversation history
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Message Details & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {selectedMessage ? (
              <>
                {/* Message Display */}
                <MessageDisplay message={selectedMessage} />

                {/* Moderation Actions */}
                <ModerationActions
                  messageId={selectedMessage.id}
                  threadId={selectedMessage.threadId}
                  onMessageDeleted={handleMessageDeleted}
                  onThreadDeleted={handleThreadDeleted}
                  onMessageForwarded={handleMessageForwarded}
                />

                {/* Split Bot Messaging */}
                {selectedThreadId && (
                  <SplitBotMessaging
                    threadId={selectedThreadId}
                    onMessageSent={handleMessageSent}
                  />
                )}
              </>
            ) : (
              <div className="card">
                <p className="text-center text-gray-500">
                  Select a message to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Debug Panel */}
        {process.env.NODE_ENV === 'development' && selectedMessage && (
          <div className="mt-8 card bg-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Debug Information
            </h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(
                {
                  messageId: selectedMessage.id,
                  threadId: selectedMessage.threadId,
                  guestUserId: selectedMessage.guestUserId,
                  hostUserId: selectedMessage.hostUserId,
                  originatorUserId: selectedMessage.originatorUserId,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
