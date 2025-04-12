import RegisterForm from "@/components/auth/RegisterForm";
import Loading from "@/components/Loading";
import { Suspense } from "react";

function RegisterPageContent() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterPageContent />
    </Suspense>
  );
}
