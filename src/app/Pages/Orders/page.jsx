"use client";

import Navbar from "@/app/Components/Navbar/Navbar";
import Footer from "../Profile/Footer";
import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { auth, db } from "@/app/Pages/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
// import { format } from "date-fns"; // optional, to format dates nicely

export default function OrdersPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Fetch orders for this user
      const q = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const fetchedOrders = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
  <div className="w-36 h-36 flex items-center justify-center bg-white rounded-2xl shadow-2xl">
    <ArrowPathIcon className="w-12 h-12 text-blue-400 animate-spin" />
  </div>
</div>;

  if (!user) return <div className="p-10">Please login to view orders.</div>;

  if (orders.length === 0)
    return (
      <div className="p-10 text-center text-gray-500">
        You have no orders yet.
      </div>
    );

  return (
    <div>
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Your Orders</h1>

        {orders.map((order) => {
          const orderDate = order.createdAt
            ? new Date(order.createdAt.seconds * 1000)
            : new Date();
          const deliveryDate = new Date(orderDate);
          deliveryDate.setDate(orderDate.getDate() + 7); // 1 week delivery

          const total = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return (
            <div
              key={order.id}
              className="bg-white p-6 rounded-2xl shadow space-y-4"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  Order ID: <span className="text-gray-500">{order.id}</span>
                </p>
                <p className="text-gray-500">
                  Placed on:{orderDate.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}

                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Product</th>
                      <th className="p-2">Quantity</th>
                      <th className="p-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-2">{item.productName}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">₦{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-2">
                <p className="font-semibold">Total: ₦{total.toFixed(2)}</p>
                <p className="text-gray-600">
                  Status: <span className="font-semibold">{order.status}</span>
                </p>
              </div>

              <p className="text-gray-500">
                ✅ Your items will arrive in 1 week from the order date.
              </p>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}
