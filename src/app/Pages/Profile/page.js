"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import Navbar from "@/app/Components/Navbar/Navbar";
import { ArrowPathIcon } from "@heroicons/react/24/solid"; // spinner icon


export default function Profile() {
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Vendor Product Form States
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const categoriesList = [
    "Groceries",
    "Home",
    "Electronics",
    "Fashion",
    "Beauty",
    "Sports",
    "Books",
  ];

  // Fetch current user data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setUserData(docSnap.data());
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  // Handle role change (buyer <-> vendor)
  const handleRoleChange = async (newRole) => {
    if (!userData) return;
    setUpdatingRole(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { role: newRole });
      setUserData({ ...userData, role: newRole });
    } catch (err) {
      console.error(err);
      alert("Error updating role: " + err.message);
    } finally {
      setUpdatingRole(false);
    }
  };

  // Handle product upload
  const handleProductUpload = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!productName || !price || !imageUrl) {
      return alert("Please fill all required fields and add an image URL.");
    }
    if (price > 4000000) {
      return alert("Price cannot exceed 4,000,000.");
    }
    if (discount > 100) {
      return alert("Discount cannot exceed 100%.");
    }

    setUploading(true);

    try {
      const finalPrice = discount ? price - (price * discount) / 100 : price;

      // Save product to Firestore
     const docRef = await addDoc(collection(db, "products"), {
  uid: user.uid,
  productName,
  category,
  price: parseFloat(finalPrice),
  originalPrice: parseFloat(price),
  discount: discount ? parseFloat(discount) : 0,
  description,
  imageUrl,
  createdAt: Timestamp.now(),
});


      // Reset form
      setProductName("");
      setCategory("Groceries");
      setPrice("");
      setDiscount("");
      setDescription("");
      setImageUrl("");

      alert("Product uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading product: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return   <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
  <div className="w-40 h-40 flex items-center justify-center bg-white rounded-2xl shadow-2xl">
    <ArrowPathIcon className="w-15 h-15 text-blue-400 animate-spin" />
  </div>
</div>

  if (!user)
    return (
      <p className="p-10 text-center text-red-500">
        <Link href="/Pages/Login"> Please log in to view your profile.</Link>
       
      </p>
    );

  // Calculate final price for live preview
  const finalPricePreview =
    price && discount ? price - (price * discount) / 100 : price;


    return (
  <div className="min-h-screen bg-slate-50">
    <Navbar />

    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= LEFT SIDE (Dominant Profile) ================= */}
        <div className="lg:col-span-2 space-y-8">

          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Your Profile
            </h2>

            <div className="space-y-4 text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Username:</span>{" "}
                {userData?.username || user.displayName || "Not set"}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Email:</span>{" "}
                {userData?.email || user.email}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Role:</span>{" "}
                {userData?.role || "buyer"}
              </p>
            </div>

            {/* Role Buttons */}
            {userData?.role === "buyer" && (
              <button
                onClick={() => handleRoleChange("vendor")}
                disabled={updatingRole}
                className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                {updatingRole ? "Applying..." : "Apply to be a Vendor"}
              </button>
            )}

            {userData?.role === "vendor" && (
              <button
                onClick={() => handleRoleChange("buyer")}
                disabled={updatingRole}
                className="mt-6 w-full py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition"
              >
                {updatingRole ? "Updating..." : "Stop Being a Vendor"}
              </button>
            )}
          </div>

          {/* Vendor Upload Form */}
          {userData?.role === "vendor" && (
            <div className="bg-white rounded-3xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Upload Product
              </h2>

              <form onSubmit={handleProductUpload} className="space-y-4">

                <input
                  type="text"
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categoriesList.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) =>
                      setPrice(Math.min(e.target.value, 4000000))
                    }
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Discount (%)"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(Math.min(e.target.value, 100))
                    }
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {price && (
                  <p className="text-right text-slate-600">
                    Final Price:{" "}
                    <span className="font-semibold text-indigo-600">
                      {finalPricePreview}
                    </span>
                  </p>
                )}

                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl mx-auto shadow"
                  />
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                >
                  {uploading ? "Uploading..." : "Upload Product"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ================= RIGHT SIDE (Mini Dashboard) ================= */}
        <div className="space-y-6">

          {/* Stats Cards */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-slate-700 font-semibold mb-4">
              Account Overview
            </h3>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-semibold text-indigo-600">
                  {userData?.role || "buyer"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Member Since</span>
                <div className="font-semibold">
                  {user?.metadata?.creationTime?.slice(0, 17)}
                </div>
              </div>

              <div className="flex justify-between">
                <span>Email Verified</span>
                <span
                  className={`font-semibold ${
                    user.emailVerified
                      ? "text-green-600"
                      : "text-rose-600"
                  }`}
                >
                  {user.emailVerified ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Placeholder Analytics */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-slate-700 font-semibold mb-4">
              Activity Summary
            </h3>

            <div className="h-40 bg-gradient-to-br from-indigo-50 to-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">
             <Link href="/Pages/Dashboard">Click here to View Dashboard</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);
}
