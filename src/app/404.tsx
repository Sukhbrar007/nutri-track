import Loading from "@/components/Loading";
import { Suspense } from "react";

function NotFoundContent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>

        <div className="mt-6 mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<Loading />}>
      <NotFoundContent />
    </Suspense>
  );
}
