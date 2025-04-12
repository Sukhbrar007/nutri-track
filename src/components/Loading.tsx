export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="loading-spinner"></div>

        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/0 to-blue-500/30 animate-pulse-slow"></div>
      </div>

      <div className="mt-4 text-gray-700 font-medium animate-pulse-slow">
        Loading...
      </div>

      <div className="loading-dots mt-2">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
    </div>
  );
}
