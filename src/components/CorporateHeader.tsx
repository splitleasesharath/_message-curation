'use client';

import { useSession, signOut } from 'next-auth/react';

export default function CorporateHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Split Lease Admin
            </h1>
            <span className="ml-4 text-sm text-gray-500">
              Message Curation
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {session?.user && (
              <>
                <div className="text-sm text-gray-700">
                  {session.user.name}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
