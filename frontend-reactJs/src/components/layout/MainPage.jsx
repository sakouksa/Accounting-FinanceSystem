import React from 'react'

export default function MainPage({ loading = false, children }) {
  return (
    <div className="relative min-h-screen">
      {children}

      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-md">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/20 bg-white/80 px-10 py-8 shadow-2xl backdrop-blur-xl">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-blue-100" />

              <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-blue-600 border-r-cyan-500" />

              <div className="absolute inset-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse opacity-20" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                រងចាំ...
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                សូមរងចាំខណៈដែលយើងកំពុងដំណើរការសំណើររបស់អ្នក
              </p>
            </div>

            <div className="flex gap-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-cyan-500"
                style={{ animationDelay: '0.15s' }}
              />
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                style={{ animationDelay: '0.3s' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
