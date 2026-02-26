"use client";

import Navbar from "@/components/navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center p-6 m-24 text-center bg-white">
        <div className="max-w-md space-y-6">
          {/* Search/Map Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-900">
              Page not found
            </h1>
            <p className="text-sm text-gray-500 font-normal">
              We couldn't find the page you're looking for. It might have been
              moved, deleted, or perhaps it never existed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <a
              href="/"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Back to home
            </a>
            <button
              onClick={() => window.history.back()}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
