"use client";
import { useEffect, useState } from "react";
import { db } from "../Pages/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { FaTruckLoading } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

// ✅ Import from swiper/react
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ArrowPathIcon } from "@heroicons/react/24/solid"; // spinner icon

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function RandomProductsSwiper() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const allProducts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const shuffled = allProducts.sort(() => 0.5 - Math.random()).slice(0, 6);
      setProducts(shuffled);
    });
    return () => unsub();
  }, []);

  // ✅ Prevent Swiper from initializing with 0 slides (breaks loop)
  if (products.length === 0) return  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
  <div className="w-36 h-36 flex items-center justify-center bg-white rounded-2xl shadow-2xl">
    <ArrowPathIcon className="w-12 h-12 text-blue-400 animate-spin" />
  </div>
</div>






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

  return (
    <div className="max-w-7xl  mx-auto px-12 py-10">
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={products.length > 1} // Only loop if there's more than 1 item
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1 }, // Added for mobile
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <div className="bg-white rounded-xl shadow p-4 flex flex-col h-full border">
              <img
                src={p.imageUrl}
                alt={p.productName}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="mt-4 flex flex-col flex-grow">
                 <p className="font-medium">{p.productName}</p>
                 <p className="text-green-600 font-semibold">
                   ₦{p.price}
                   {p.discount > 0 && (
                     <span className="text-sm text-gray-400 line-through ml-2">
                       ₦{p.originalPrice}
                     </span>
                   )}
                 </p>
                 <button
                   onClick={() => addToCart(p)}
                   className="mt-4 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                 >
                   🛒 Add to Cart
                 </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}