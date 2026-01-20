'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageWithRelations } from '@/types';
import {
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface MessageDisplayProps {
  message: MessageWithRelations;
  onMessageSelect?: (messageId: string) => void;
}

export default function MessageDisplay({
  message,
  onMessageSelect,
}: MessageDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="card space-y-6">
      {/* Guest Information */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {message.guestUser.profilePhotoUrl ? (
            <Image
              src={message.guestUser.profilePhotoUrl}
              alt={`${message.guestUser.firstName} ${message.guestUser.lastName}`}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {getUserInitials(message.guestUser.firstName, message.guestUser.lastName)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900">
              Guest: {message.guestUser.firstName} {message.guestUser.lastName}
            </h3>
            {message.splitBotWarning && (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          <p className="text-sm text-gray-500">
            Guest Email: {message.guestUser.email}
          </p>
          {message.splitBotWarning && (
            <p className="text-sm text-yellow-600 mt-1">
              {message.splitBotWarning}
            </p>
          )}
        </div>
      </div>

      {/* Host Information */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {message.hostUser.profilePhotoUrl ? (
            <Image
              src={message.hostUser.profilePhotoUrl}
              alt={`${message.hostUser.firstName} ${message.hostUser.lastName}`}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
              {getUserInitials(message.hostUser.firstName, message.hostUser.lastName)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            Host: {message.hostUser.firstName} {message.hostUser.lastName}
          </h3>
          <p className="text-sm text-gray-500">
            Host Email: {message.hostUser.email}
          </p>
        </div>
      </div>

      {/* Listing Information */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">
          Listing: {message.thread.listing.name}
        </h3>
      </div>

      {/* Originator */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">
          Originator: {message.originatorUser.firstName}
        </h3>
      </div>

      {/* Message ID (Debug) */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Message unique id: {message.id}
          </span>
          <button
            onClick={() => copyToClipboard(message.id)}
            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="h-4 w-4" />
                <span>(click to copy)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message Body */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Message:</h3>
        <textarea
          value={message.messageBody}
          readOnly
          rows={6}
          className="input resize-none bg-gray-50"
        />
      </div>

      {/* Forwarded Status */}
      {message.forwarded && (
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <CheckIcon className="h-5 w-5" />
          <span>
            Forwarded on {new Date(message.forwardedAt!).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
