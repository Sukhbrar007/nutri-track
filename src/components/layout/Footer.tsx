export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center">
            <span className="text-gray-900 font-medium">NutriTracker</span>
            <span className="text-gray-500 ml-2 text-sm">
              Track your nutrition journey
            </span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} NutriTracker. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
