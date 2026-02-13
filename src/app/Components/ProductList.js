"use client";
import { useState, useEffect } from "react";
import { db } from "../Pages/firebase";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { collection, getDocs } from "firebase/firestore";

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");

  const categoriesList = [
    "Groceries",
    "Home",
    "Electronics",
    "Fashion",
    "Beauty",
    "Sports",
    "Books",
  ];

  // -----------------------------
  // ADD TO CART LOGIC (LOCAL)
  // -----------------------------
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
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

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  };

  // -----------------------------
  // FETCH PRODUCTS
  // -----------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      const colRef = collection(db, "products");
      const snapshot = await getDocs(colRef);

      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllProducts(products);

      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 6));
    };

    fetchProducts();
  }, []);

  const filteredProducts = categoryFilter
    ? allProducts.filter((p) => p.category === categoryFilter)
    : allProducts;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* CATEGORY FILTER */}
      {/* <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => setCategoryFilter("")}
          className={`px-4 py-2 rounded-xl ${
            categoryFilter === ""
              ? "bg-blue-600 text-white"
              : "bg-slate-300"
          }`}
        >
          All
        </button>

        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl ${
              categoryFilter === cat
                ? "bg-blue-600 text-white"
                : "bg-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div> */}

      {/* PRODUCTS */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col gap-3"
          >
            <img
              src={prod.imageUrl}
              alt={prod.productName}
              className="w-full h-40 object-cover rounded-xl"
            />

            <h3 className="font-semibold">{prod.productName}</h3>
            <p className="text-sm text-gray-500">{prod.category}</p>

            <p className="font-bold">
              ₦{prod.price.toFixed(2)}{" "}
              {prod.discount > 0 && (
                <span className="line-through text-gray-400 text-sm">
                  ₦{prod.originalPrice.toFixed(2)}
                </span>
              )}
            </p>

            <button
              onClick={() => addToCart(prod)}
              className="mt-auto py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div> */}

      {/* RANDOM PICKS */}
      <h3 className="text-xl font-semibold mt-10">Random Picks</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {randomProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-gray-100 rounded-xl shadow-xl p-4 flex flex-col gap-3"
          >
            <img
              src={prod.imageUrl}
              alt={prod.productName}
              className="w-full h-40 object-cover rounded-xl"
            />

            <h3 className="font-semibold">{prod.productName}</h3>
            <p className="text-sm text-gray-500">{prod.category}</p>

            <p className="font-bold">₦{prod.price.toFixed(2)}</p>

            <button
              onClick={() => addToCart(prod)}
              className="mt-auto py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
