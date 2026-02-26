"use client";

import Navbar from "@/components/navbar";

export default function Error() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center p-6 m-24 text-center bg-white">
        <div className="max-w-md space-y-6">
          {/* Alert Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-900">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-500">
              An unexpected error occurred. Please try refreshing the page.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Refresh page
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
