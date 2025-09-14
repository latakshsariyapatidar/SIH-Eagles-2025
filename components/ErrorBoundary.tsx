import React from 'react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-soft-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please refresh the page to try again.
        </p>
        <div className="space-y-3">
          {resetError && (
            <button
              onClick={resetError}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-600 hover:to-secondary-500 transition-all duration-200 shadow-soft"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
          >
            Refresh Page
          </button>
        </div>
        {error && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Technical Details
            </summary>
            <pre className="text-xs text-gray-400 mt-2 p-2 bg-gray-50 rounded overflow-auto max-h-32">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
