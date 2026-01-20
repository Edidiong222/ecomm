"use client";
import Categories from "../categories";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/app/Pages/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";


import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 🛒 CART COUNT STATE
  const [cartCount, setCartCount] = useState(0);

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // 🛒 Cart count listener
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const count = cart.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <header className="w-full border-b bg-white">
      {/* Top Navbar */}
      <div className="max-w-7xl  mx-auto px-4 py-4">

        <div className="flex justify-between lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center">
        <div>
          <Link href='/'>
          <HomeIcon className="w-8 h-8 text-blue-500"/>
        </Link>
        </div>

          {/* Logo */}
          <h1 className="text-3xl font-bold text-blue-600 cursor-pointer">
            MegaMart
          </h1>
          </div>

          {/* Search */}
          {/* <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl w-full lg:max-w-xl">
            <MagnifyingGlassIcon className="w-5 h-5 text-blue-500" />
            <input
              type="text"
              placeholder="Search essentials, groceries and more..."
              className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div> */}

          {/* Actions */}
          <div className="flex items-center justify-end gap-6">

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user.displayName?.[0] || user.email?.[0]}
                  </div>

                  <span className="hidden sm:inline font-medium">
                    {user.displayName || "Account"}
                  </span>

                  <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50">
                    <Link
                      href="/Pages/Profile"
                      className="block px-4 py-2 text-sm  rounded-xl hover:bg-blue-50"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-left px-4 py-2  rounded-xl text-sm text-red-500 hover:bg-blue-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/Pages/Login"
                className="py-2 px-4 bg-blue-200 rounded-2xl font-bold text-slate-700"
              >
                Sign In
              </Link>
            )}

            <span className="hidden sm:block text-slate-300">|</span>

            {/* 🛒 Cart */}
            <Link href="/Pages/Cart">
              <button className="relative flex items-center gap-2 text-slate-700 hover:text-blue-600 transition">
                <ShoppingCartIcon className="w-6 h-6" />
                <span className="hidden sm:inline">Cart</span>

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Categories />
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Sign out?</h3>
            <p className="text-slate-500 mb-6">
              Are you sure you want to sign out?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await signOut(auth);
                  setShowLogoutModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-500 text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
