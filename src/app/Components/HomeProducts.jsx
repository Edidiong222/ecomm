"use client";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import { db } from "../Pages/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { FaAppleAlt, FaHome, FaTv, FaTshirt, FaSpa, FaFootballBall, FaBook } from "react-icons/fa";

export default function HomeProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState({});

  const categories = [
    "All",
    "Groceries",
    "Home",
    "Electronics",
    "Fashion",
    "Beauty",
    "Sports",
    "Books",
  ];

  const categoryIcons = {
  All: null,
  Groceries: <FaAppleAlt />,
  Home: <FaHome />,
  Electronics: <FaTv />,
  Fashion: <FaTshirt />,
  Beauty: <FaSpa />,
  Sports: <FaFootballBall />,
  Books: <FaBook />,
};

  /* 🛒 ADD TO CART */
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);

    

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        productName: product.productName,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        quantity: 1,
      });
    }

    window.dispatchEvent(new Event("storage"));


    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");

    window.dispatchEvent(new Event("storage"));

  };

  /* 🔴 Real-time Firestore listener */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  /* 🔍 Search filter */
  const filtered = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  /* 🧠 Group by category */
  const grouped = filtered.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4  py-10 space-y-10">
                <Toaster position="top-right" />

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl bg-blue-50  focus:outline-none focus:border-blue-500"
      />

      {/* 🧭 Categories */}
    <div className="flex lg:justify-center gap-3 overflow-x-auto px-4">
  {categories.map((cat) => (
    <button
      key={cat}
      onClick={() => setActiveCategory(cat)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition
        ${
          activeCategory === cat
            ? "bg-blue-600 text-white"
            : "bg-slate-200 hover:bg-slate-300"
        }`}
    >
      {categoryIcons[cat]} {cat}
    </button>
  ))}
</div>

      {/* 🗂 Products */}
      {Object.entries(grouped)
        .filter(([cat]) => activeCategory === "All" || cat === activeCategory)
        .map(([category, items]) => {
          const showAll = expanded[category];
          const visible = showAll ? items : items.slice(0, 6);

          return (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold">{category}</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {visible.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl shadow p-4 space-y-2 flex flex-col"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.productName}
                      className="w-full h-36 object-cover rounded-lg"
                    />

                    <p className="font-medium">{p.productName}</p>

                    <p className="text-green-600 font-semibold">
                      ₦{p.price}
                      {p.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through ml-1">
                          ₦{p.originalPrice}
                        </span>
                      )}
                    </p>

                    <button
                      onClick={() => addToCart(p)}
                      className="mt-auto bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
                    >
                     <h1 className="font-bold"> Add to Cart </h1>
                    </button>
                  </div>
                ))}
              </div>

              {/* ➕ View More */}
              {items.length > 6 && (
                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [category]: !prev[category],
                    }))
                  }
                  className="text-blue-600 font-medium hover:underline"
                >
                  {showAll ? "View less" : "View more"}
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
}
