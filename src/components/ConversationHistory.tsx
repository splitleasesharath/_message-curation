'use client';

import { MessageWithRelations } from '@/types';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConversationHistoryProps {
  messages: MessageWithRelations[];
  selectedMessageId?: string;
  onMessageClick: (message: MessageWithRelations) => void;
}

export default function ConversationHistory({
  messages,
  selectedMessageId,
  onMessageClick,
}: ConversationHistoryProps) {
  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Full Conversation History
        </h2>
        <p className="text-sm text-gray-500">
          (click on each message to update and forward)
        </p>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {messages.map((message) => {
          const isSelected = message.id === selectedMessageId;
          const isFromGuest = message.originatorUserId === message.guestUserId;
          const isFromHost = message.originatorUserId === message.hostUserId;
          const isSplitBot = message.originatorUser.isSplitBot;

          return (
            <div
              key={message.id}
              onClick={() => onMessageClick(message)}
              className={`
                p-4 rounded-lg border cursor-pointer transition-all
                ${isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                {/* User Avatar/Initial */}
                <div className="flex-shrink-0">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm
                      ${isFromGuest ? 'bg-blue-500' : ''}
                      ${isFromHost ? 'bg-green-500' : ''}
                      ${isSplitBot ? 'bg-purple-500' : ''}
                    `}
                  >
                    {message.originatorUser.firstName.charAt(0)}
                    {message.originatorUser.lastName.charAt(0)}
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {message.originatorUser.firstName}{' '}
                      {message.originatorUser.lastName}
                    </span>
                    {message.splitBotWarning && (
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                    )}
                    {message.forwarded && (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    )}
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {message.messageBody}
                  </p>

                  {message.splitBotWarning && (
                    <p className="text-xs text-yellow-600 mt-1">
                      {message.splitBotWarning}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No messages in this thread
          </div>
        )}
      </div>
    </div>
  );
}
