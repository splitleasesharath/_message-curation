'use client';

import { useState } from 'react';
import { SplitBotRecipient } from '@/types';

interface SplitBotMessagingProps {
  threadId: string;
  onMessageSent: () => void;
}

const TEMPLATES = {
  redacted_contact_info:
    'We noticed your message contained contact information. For your safety and security, we\'ve removed it. Please use Split Lease messaging for all communications.',
  limit_messages:
    'We noticed a high volume of messages in this conversation. Please consolidate your messages to help keep the conversation organized.',
  lease_documents_signed:
    'Great news! Your lease documents have been signed and processed. You can now proceed with your move-in arrangements.',
};

export default function SplitBotMessaging({
  threadId,
  onMessageSent,
}: SplitBotMessagingProps) {
  const [messageBody, setMessageBody] = useState('');
  const [recipientType, setRecipientType] = useState<SplitBotRecipient>('guest');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const loadTemplate = (templateKey: keyof typeof TEMPLATES) => {
    setMessageBody(TEMPLATES[templateKey]);
  };

  const sendMessage = async () => {
    if (!messageBody.trim()) {
      setError('Please enter a message');
      return;
    }

    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          messageBody,
          recipientType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessageBody('');
        onMessageSent();
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Old Flow */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Split Bot Messages (Old Flow)
        </h3>

        {/* Message Textarea */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Split Bot Messages go here
          </label>
          <textarea
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            rows={4}
            className="input resize-none"
            placeholder="Enter your message here..."
          />
        </div>

        {/* Recipient Radio Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Send to:
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="guest"
                checked={recipientType === 'guest'}
                onChange={(e) => setRecipientType(e.target.value as SplitBotRecipient)}
                className="mr-2"
              />
              <span>Send to Guest</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="host"
                checked={recipientType === 'host'}
                onChange={(e) => setRecipientType(e.target.value as SplitBotRecipient)}
                className="mr-2"
              />
              <span>Send to Host</span>
            </label>
          </div>
        </div>

        {/* Template Buttons */}
        <div className="mb-4 space-y-2">
          <button
            onClick={() => loadTemplate('redacted_contact_info')}
            className="btn-secondary w-full text-left"
          >
            Say Split Bot redacted contact info
          </button>
          <button
            onClick={() => loadTemplate('limit_messages')}
            className="btn-secondary w-full text-left"
          >
            Say please limit number of messages
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={sendMessage}
          disabled={sending || !messageBody.trim()}
          className="btn-primary w-full"
        >
          {sending ? 'Sending...' : 'Send as Split Bot (Old)'}
        </button>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* New Flow - Placeholder for call-to-action dropdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Split Bot Messages (New Flow)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Use the proposal section to mark lease documents as signed
        </p>

        <button
          onClick={() => loadTemplate('lease_documents_signed')}
          className="btn-secondary w-full"
        >
          Load lease documents signed template
        </button>
      </div>
    </div>
  );
}
