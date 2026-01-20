"use client";
import { useState, useEffect } from "react";
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

  if (loading) return <p className="p-10 text-center">               
   <ArrowPathIcon className="w-20 h-20 m-auto z-30 text-blue-500 animate-spin" />
</p>;
  if (!user)
    return (
      <p className="p-10 text-center text-red-500">
        Please log in to view your profile.
      </p>
    );

  // Calculate final price for live preview
  const finalPricePreview =
    price && discount ? price - (price * discount) / 100 : price;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start px-4 py-8 gap-8">
      {/* User Info */}
      <Navbar/>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">Your Profile</h2>
        <div className="space-y-4 text-slate-700">
          <p>
            <span className="font-medium">Username:</span>{" "}
            {userData?.username || user.displayName || "Not set"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {userData?.email || user.email}
          </p>
          <p>
            <span className="font-medium">Role:</span> {userData?.role || "buyer"}
          </p>
        </div>

        {/* Role Buttons */}
        {userData?.role === "buyer" && (
          <button
            onClick={() => handleRoleChange("vendor")}
            disabled={updatingRole}
            className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            {updatingRole ? "Applying..." : "Apply to be a Vendor"}
          </button>
        )}

        {userData?.role === "vendor" && (
          <button
            onClick={() => handleRoleChange("buyer")}
            disabled={updatingRole}
            className="mt-6 w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            {updatingRole ? "Updating..." : "Stop Being a Vendor"}
          </button>
        )}
      </div>

      {/* Vendor Product Upload Form */}
      {userData?.role === "vendor" && (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Upload Product</h2>
          <form onSubmit={handleProductUpload} className="space-y-4">
            {/* Product Name */}
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500"
              required
            />

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500"
            >
              {categoriesList.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Price */}
            <input
              type="number"
              placeholder="Price (max 4,000,000)"
              value={price}
              onChange={(e) => setPrice(Math.min(e.target.value, 4000000))}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500"
              required
            />

            {/* Discount */}
            <input
              type="number"
              placeholder="Discount (%) max 100"
              value={discount}
              onChange={(e) => setDiscount(Math.min(e.target.value, 100))}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500"
            />

            {/* Live Final Price */}
            {price && (
              <p className="text-right text-gray-600">
                Final Price: <span className="font-bold">{finalPricePreview}</span>
              </p>
            )}

            {/* Description */}
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500"
            />

            {/* Image URL */}
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500"
              required
            />

            {/* Image Preview */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-xl mx-auto"
              />
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              {uploading ? "Uploading..." : "Upload Product"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
