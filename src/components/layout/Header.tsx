"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  X,
  LogOut,
  Home,
  // CalendarDays,
  Settings,
  User,
  ShieldCheck,
  ChevronDown,
  BarChart2,
} from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll position changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;
  const isAdmin = session?.user?.role === "ADMIN";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    // { name: "Calendar", href: "/calendar", icon: CalendarDays },
    {
      name: "Calculator",
      href: "/calculator",
      icon: BarChart2,
    },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (isAdmin) {
    menuItems.push({ name: "Admin", href: "/admin", icon: ShieldCheck });
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                NutriTracker
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {session ? (
              <>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}

                {/* User menu */}
                <div className="relative ml-6">
                  <div className="flex items-center">
                    <button
                      onClick={toggleProfile}
                      className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white overflow-hidden">
                        {session.user.name ? (
                          session.user.name.charAt(0).toUpperCase()
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all hover:shadow"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {session ? (
              <>
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
                      {session.user.name ? (
                        session.user.name.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {session.user.name || "User"}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
                </div>

                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all hover:shadow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
