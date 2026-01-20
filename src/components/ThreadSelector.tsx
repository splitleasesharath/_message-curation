'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ThreadWithMessages } from '@/types';

interface ThreadSelectorProps {
  onThreadSelect: (threadId: string) => void;
  selectedThreadId?: string;
}

export default function ThreadSelector({
  onThreadSelect,
  selectedThreadId,
}: ThreadSelectorProps) {
  const [threads, setThreads] = useState<ThreadWithMessages[]>([]);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchThreads();
  }, [search, limit]);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        limit: limit.toString(),
        offset: '0',
      });

      const response = await fetch(`/api/admin/threads?${params}`);
      const result = await response.json();

      if (result.success) {
        setThreads(result.data.items);
        setTotalCount(result.data.totalCount);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setLimit((prev) => prev + 50);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for threads..."
          className="input pl-10"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500">
          {totalCount} threads
        </div>
      </div>

      {/* Thread Dropdown */}
      <div>
        <label
          htmlFor="thread-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Choose a thread...
        </label>
        <select
          id="thread-select"
          value={selectedThreadId || ''}
          onChange={(e) => onThreadSelect(e.target.value)}
          className="input"
          disabled={loading}
        >
          <option value="">Select a thread</option>
          {threads.map((thread) => (
            <option key={thread.id} value={thread.id}>
              {thread.listing.name} - {thread.messages[0]?.guestUser.email || 'No messages'}
            </option>
          ))}
        </select>
      </div>

      {/* Show More Button */}
      {threads.length < totalCount && (
        <button
          onClick={handleShowMore}
          disabled={loading}
          className="btn-secondary w-full"
        >
          {loading ? 'Loading...' : 'Show More'}
        </button>
      )}
    </div>
  );
}
