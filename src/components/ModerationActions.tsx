'use client';

import { useState } from 'react';
import { TrashIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface ModerationActionsProps {
  messageId: string;
  threadId: string;
  onMessageDeleted: () => void;
  onThreadDeleted: () => void;
  onMessageForwarded: () => void;
}

export default function ModerationActions({
  messageId,
  threadId,
  onMessageDeleted,
  onThreadDeleted,
  onMessageForwarded,
}: ModerationActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const [forwarding, setForwarding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showThreadDeleteConfirm, setShowThreadDeleteConfirm] = useState(false);

  const handleDeleteMessage = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        onMessageDeleted();
        setShowDeleteConfirm(false);
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      alert('Failed to delete message');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteThread = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/threads/${threadId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        onThreadDeleted();
        setShowThreadDeleteConfirm(false);
      } else {
        alert('Failed to delete thread');
      }
    } catch (error) {
      alert('Failed to delete thread');
    } finally {
      setDeleting(false);
    }
  };

  const handleForwardMessage = async () => {
    setForwarding(true);
    try {
      const response = await fetch(`/api/admin/messages/${messageId}/forward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.success) {
        alert('Message forwarded successfully');
        onMessageForwarded();
      } else {
        alert('Failed to forward message');
      }
    } catch (error) {
      alert('Failed to forward message');
    } finally {
      setForwarding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="card">
        <div className="flex justify-between items-center">
          {/* Forward Message */}
          <button
            onClick={handleForwardMessage}
            disabled={forwarding}
            className="btn-purple flex items-center space-x-2"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            <span>{forwarding ? 'Forwarding...' : 'Forward this message'}</span>
          </button>

          {/* Delete Message */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-danger flex items-center space-x-2"
          >
            <TrashIcon className="h-5 w-5" />
            <span>Delete Message</span>
          </button>
        </div>
      </div>

      {/* Delete Conversation Button */}
      <div className="card bg-red-50 border border-red-200">
        <button
          onClick={() => setShowThreadDeleteConfirm(true)}
          className="btn-danger w-full flex items-center justify-center space-x-2"
        >
          <TrashIcon className="h-5 w-5" />
          <span>Delete Conversation</span>
        </button>
      </div>

      {/* Delete Message Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Message?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMessage}
                className="btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Message'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Thread Confirmation Modal */}
      {showThreadDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Entire Conversation?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this entire conversation? All messages in this thread will be deleted. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowThreadDeleteConfirm(false)}
                className="btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteThread}
                className="btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Conversation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
