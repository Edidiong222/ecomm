"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/Pages/firebase";
import { ArrowPathIcon } from "@heroicons/react/24/solid"; // spinner icon
import { TrashIcon } from "@heroicons/react/24/outline";
import {  deleteDoc } from "firebase/firestore";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";


import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {useRouter} from "next/navigation"
import {
  FiHome,
  FiBox,
  FiDollarSign,
  FiUser,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  PieChart,
} from "recharts";
import Link from "next/link";


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDelete = async (id) => {
  try {
    await deleteDoc(doc(db, "products", id));
    toast.success("Product Deleted Succesfully")
    setOpenMenuId(null);
  } catch (error) {
    console.log(error);
    toast.error(err.message);
    
  }
};

 const router = useRouter();
  const chartData = products.map((p) => {
  const soldQty = orders.reduce((acc, order) => {
    const item = order.items?.find((i) => i.id === p.id);
    return acc + (item?.quantity || 0);
  }, 0);

  return {
    name: p.productName,
    sold: soldQty,
  };
});



  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setUser(currentUser);
      
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);

        if (data.role === "vendor") {
          // 1️⃣ Fetch products
          const prodQ = query(
            collection(db, "products"),
            where("uid", "==", currentUser.uid)
          );
          const prodSnap = await getDocs(prodQ);
          const vendorProducts = prodSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setProducts(vendorProducts);

          // 2️⃣ Fetch orders where products were purchased
        // 2️⃣ Fetch ALL orders
const ordersSnap = await getDocs(collection(db, "orders"));
const allOrders = ordersSnap.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));



setOrders(allOrders);

        }
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return<div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
  <div className="w-36 h-36 flex items-center justify-center bg-white rounded-2xl shadow-2xl">
    <ArrowPathIcon className="w-12 h-12 text-blue-400 animate-spin" />
  </div>
      <Toaster/>
  
</div>
  if (!user) return <div className="p-10"><Link href="/Pages/Login">Please Login</Link></div>;

  // --- DASHBOARD DATA ---
const totalProducts = products.length;

let productsAddedToCart = 0;
let totalIncome = 0;

orders.forEach((order) => {
  order.items?.forEach((item) => {
    const match = products.find((p) => p.id === item.id);

    if (match) {
      productsAddedToCart += item.quantity || 0;
      totalIncome += item.total || (item.price * item.quantity) || 0;
    }
  });
});



  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
     <div
  className={`fixed top-0 left-0 h-full bg-black text-white z-50 p-4
  transition-all duration-300 overflow-hidden
  ${sidebarOpen ? "w-60" : "w-0 hidden"}
  lg:w-60`}
>
  <div className="flex mb-6 items-center justify-between">
    <h2 className="text-xl font-bold text-blue-400">
      {userData?.username || "Vendor"}
    </h2>
      <Toaster/>

    <button
      onClick={() => setSidebarOpen(false)}
      className="text-white hover:text-red-400 transition"
    >
      <h1 className="text-bold">✕</h1>
    </button>

</div>


        <nav className="flex flex-col gap-3">
          {[
            { name: "Dashboard", icon: <FiHome /> },
            { name: "Products", icon: <FiBox /> },
            { name: "Income", icon: <FiDollarSign /> },
            { name: "Profile", icon: <FiUser /> },
            { name: "Logout", icon: <FiLogOut /> },
            { name: "Home", icon: <FiHome /> },
            
          ].map((btn) => (
           <button
  key={btn.name}
  onClick={() => {
    if (btn.name === "Logout") {
      auth.signOut().then(() => {
        router.push("/"); // ✅ safe now
      });
      return;
    }
    if(btn.name === "Home"){
      router.push("/");
    }
    setActivePage(btn.name);
  }}
  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
    activePage === btn.name
      ? "bg-blue-600 text-white"
      : "hover:text-blue-400"
  }`}
>
  {btn.icon} {btn.name}
</button>

          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-6">
        {/* Mobile menu button */}
        <button
          className="lg:hidden mb-4 text-black"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu size={24} />
        </button>

        {activePage === "Dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-4">
              Welcome {userData?.username || user.email}
            </h1>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-100 p-6 rounded-2xl shadow">
                <h3>Total Products</h3>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <div className="bg-green-100 p-6 rounded-2xl shadow">
                <h3>Products Sold</h3>
                <p className="text-2xl font-bold">{productsAddedToCart}</p>
              </div>
              <div className="bg-purple-100 p-6 rounded-2xl shadow">
                <h3>Total Income</h3>
                <p className="text-2xl font-bold">₦{totalIncome.toLocaleString()}</p>
              </div>
            </div>

   <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl mb-4">Products</h2>
            {products.length ? (
              <table className="min-w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Sold Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                  const soldQty = orders.reduce((acc, order) => {
  const item = order.items?.find((i) => i.id === p.id);
  return acc + (item?.quantity || 0);
}, 0);

                    return (
                      <tr key={p.id} className="border-t">
                        <td className="p-2">{p.productName}</td>
                        <td className="p-2">₦{p.price}</td>
                        <td className="p-2">{soldQty}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No products added yet.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow mt-8">
  <h2 className="text-xl mb-4">Top Selling Products</h2>

  {chartData.length > 0 ? (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
  contentStyle={{
    backgroundColor: "blue",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
  }}
  cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
/>

          <Bar dataKey="sold" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <p>No sales data available.</p>
  )}
</div>

          </>
        )}

        {activePage === "Products" && (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h2 className="text-xl mb-4 font-semibold">Products</h2>

    {products.length ? (
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Sold Quantity</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => {
              const soldQty = orders.reduce((acc, order) => {
                const item = order.items?.find(
                  (i) => i.id === p.id
                );
                return acc + (item?.quantity || 0);
              }, 0);

              return (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{p.productName}</td>
                  <td className="p-3">₦{p.price}</td>
                  <td className="p-3">{soldQty}</td>

                  <td className="p-3 relative text-center">
                    {/* Three dots button */}
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === p.id ? null : p.id
                        )
                      }
                      className="text-xl font-bold px-2"
                    >
                      ⋮
                    </button>

                    {/* Delete button */}
                    {openMenuId === p.id && (
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="absolute right-6 mt-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <p>No products added yet.</p>
    )}
  </div>
)}

        {activePage === "Income" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl mb-4">Income</h2>
            <p className="font-semibold mb-2">
              Total income from sold products: ₦{totalIncome.toLocaleString()}
            </p>
            <p>Products sold: {productsAddedToCart}</p>
          </div>
        )}

        {activePage === "Profile" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl mb-4">Profile Info</h2>
            <p><strong>Name:</strong> {userData?.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {userData?.role}</p>
          </div>
        )}
      </div>
    </div>
  );
}