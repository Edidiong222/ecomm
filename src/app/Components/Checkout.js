"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { db, auth } from "@/app/Pages/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Replace with your Stripe public key
const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

function CheckoutForm({ cart, total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        setError("Please login to checkout.");
        setLoading(false);
        return;
      }

      // 🔹 Save order to Firestore
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cart,
        total,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      onSuccess();
    } catch (err) {
      setError("Checkout failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleCheckout} className="space-y-4">
      <CardElement className="p-4 border rounded-lg" />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
      >
        {loading ? "Processing..." : `Pay ₦${total.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function StripeCheckout({ cart, total, onSuccess }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm cart={cart} total={total} onSuccess={onSuccess} />
    </Elements>
  );
}
