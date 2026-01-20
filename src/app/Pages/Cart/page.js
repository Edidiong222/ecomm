"use client";
import Navbar from "@/app/Components/Navbar/Navbar";
import { useEffect, useState } from "react";
import Footer from "../Profile/Footer";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increaseQty = (id) => {
    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    updateCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <p className="text-center py-20 text-gray-500">
        🛒 Your cart is empty
      </p>
    );
  }

  return (
    <div>
        <Navbar/>
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 bg-white p-4 rounded-xl shadow"
        >
          <img
            src={item.imageUrl}
            className="w-24 h-24 object-cover rounded-lg"
          />

          <div className="flex-1">
            <p className="font-medium">{item.productName}</p>
            <p className="text-green-600">₦{item.price}</p>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => decreaseQty(item.id)}
                className="px-3 py-1 bg-slate-200 rounded"
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => increaseQty(item.id)}
                className="px-3 py-1 bg-slate-200 rounded"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item.id)}
                className="ml-4 text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center border-t pt-4">
        <p className="text-xl font-bold">Total: ₦{total.toFixed(2)}</p>

        <button
          onClick={clearCart}
          className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
        >
          Clear Cart
        </button>
      </div>
    </div>
    <Footer/>
    </div>
  );
}
