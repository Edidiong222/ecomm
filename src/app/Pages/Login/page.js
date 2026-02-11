"use client"
import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  GoogleIcon,
} from "@heroicons/react/24/outline"; // GoogleIcon or custom SVG

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.hrefz = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-center bg-blue-600 text-white p-12">
          <h1 className="text-4xl font-bold mb-4">Welcome back 👋</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Sign in to continue shopping smarter, faster, and better on MegaMart.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Sign In</h2>
          <p className="text-slate-500 mb-8">Access your MegaMart account</p>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email address
              </label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border focus-within:border-blue-500">
                <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full outline-none text-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Password
              </label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border focus-within:border-blue-500">
                <LockClosedIcon className="w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full outline-none text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <EyeIcon className="w-5 h-5 text-slate-400 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <button className="text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
            >
              Sign In
            </button>
          </form>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            className="mt-4 w-full flex items-center justify-center gap-2 border py-3 rounded-xl hover:bg-slate-100 transition"
          >
            <img src="/google-icon.svg" className="w-5 h-5" />
            Sign in with Google
          </button>

          <p className="mt-6 text-center text-slate-600">
            Don’t have an account?{" "}
            <a
              href="/Pages/Signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
