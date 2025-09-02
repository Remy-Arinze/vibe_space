"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext"; 

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth(); 

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#about", label: "About" },
  ];

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white fixed top-0 left-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-[#6366f1] hover:opacity-80 transition"
        >
          VibeSpace
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <motion.div key={link.href} whileHover={{ scale: 1.05 }}>
              <Link
                href={link.href}
                className={`relative px-3 py-1 font-medium transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-white bg-blue-600 rounded-md shadow-md"
                    : "text-gray-800 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Auth / Avatar */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 focus:outline-none">
                <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-800">{user.username}</span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md hidden group-hover:block">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded font-medium text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/auth/register"
                  className={`px-4 py-2 rounded font-medium transition ${
                    pathname === "/auth/register"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
