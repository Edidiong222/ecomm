"use client"
import { useState } from "react";
import {
  ChevronDownIcon,
  ShoppingCartIcon,
  HomeIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/solid";

const categories = [
  {
    title: "Groceries",
    icon: ShoppingCartIcon,
    items: ["Fruits", "Vegetables", "Drinks"],
  },
  {
    title: "Home",
    icon: HomeIcon,
    items: ["Furniture", "Decor", "Cleaning"],
  },
  {
    title: "Electronics",
    icon: DevicePhoneMobileIcon,
    items: ["Phones", "Laptops", "Accessories"],
  },
  {
    title: "Fashion",
    icon: ShoppingCartIcon,
    items: ["Men", "Women", "Kids"],
  },
  {
    title: "Beauty",
    icon: ShoppingCartIcon,
    items: ["Skincare", "Makeup", "Hair"],
  },
  {
    title: "Sports",
    icon: ShoppingCartIcon,
    items: ["Fitness", "Outdoor", "Gear"],
  },
  {
    title: "Books",
    icon: ShoppingCartIcon,
    items: ["Fiction", "Education", "Comics"],
  },
];

export default function Categories() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      <div className="lg:flex grid grid-cols-2 flex-wrap gap-4 justify-between">
        {categories.map((cat, index) => (
          <div key={index} className="relative">
            {/* Button */}
            <button
              onClick={() => toggleDropdown(index)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-full shadow-sm hover:bg-slate-200 transition"
            >
              <cat.icon className="w-5 h-5 text-slate-700" />
              <span className="font-medium text-slate-800">
                {cat.title}
              </span>
              <ChevronDownIcon
                className={`w-4 h-4 transition ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {openIndex === index && (
              <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-lg z-50">
                {cat.items.map((item, i) => (
                  <button
                    key={i}
                    className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
