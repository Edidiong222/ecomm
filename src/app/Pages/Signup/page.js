"use client";
import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ArrowPathIcon } from "@heroicons/react/24/solid"; // spinner icon
import { doc, setDoc } from "firebase/firestore";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { db } from "../firebase"; // adjust the path if needed

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 loading state
const handleSignUp = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // 1️⃣ Create user with email & password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 2️⃣ Set display name in Firebase Auth
    await updateProfile(user, { displayName: username });

    // 3️⃣ Create Firestore document for this user
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username: username,
      email: user.email,
      role: "buyer", // default role
      createdAt: new Date(),
    });

    // 4️⃣ Redirect to home page
    window.location.href = "/";
  } catch (err) {
    toast.error(err.message);
    setError(err.message);
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Sign Up</h2>

    <Toaster/>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500"
            required
          />

          {/* 🔹 Submit button with loading */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Already have an account?{" "}
          <a
            href="/Pages/Login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
