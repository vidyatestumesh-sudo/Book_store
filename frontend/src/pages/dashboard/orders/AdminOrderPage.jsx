import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import getBaseUrl from "../../../utils/baseURL";

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState({});
  const [totalSales, setTotalSales] = useState(0);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${getBaseUrl()}/api/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const sortedOrders = res.data.sort((a, b) => {
        const statusPriority = (status) =>
          status === "Delivered" || status === "Cancelled" ? 1 : 0;
        return statusPriority(a.status) - statusPriority(b.status);
      });

      setOrders(sortedOrders);

      const initialTracking = {};
      sortedOrders.forEach((order) => {
        initialTracking[order._id] = order.trackingId || "";
      });
      setTrackingInputs(initialTracking);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setLoading(false);
    }
  };

useEffect(() => {
  const total = orders.reduce((sum, order) => {
    if (order.status !== "Cancelled") {
      return sum + (order.totalPrice || 0);
    }
    return sum;
  }, 0);
  setTotalSales(total);
}, [orders]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderField = async (orderId, updatedFields) => {
    try {
      await axios.patch(
        `${getBaseUrl()}/api/orders/${orderId}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  };

  const handleStatusChange = async (orderId, value) => {
    try {
      await updateOrderField(orderId, { status: value });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: value } : order
        )
      );
      Swal.fire("Success", "Status updated", "success");
    } catch (error) {
      console.error("Status update error:", error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };
  const handleTrackingChange = (orderId, value) => {
    setTrackingInputs((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  const handleUpdateAllTracking = async () => {
    const updates = [];

    orders.forEach((order) => {
      const newTracking = trackingInputs[order._id]?.trim() || "";
      const oldTracking = order.trackingId || "";

      if (newTracking !== oldTracking) {
        updates.push({ orderId: order._id, trackingId: newTracking });
      }
    });

    if (updates.length === 0) {
      Swal.fire("Info", "No tracking ID to update", "info");
      return;
    }

    try {
      for (const update of updates) {
        await updateOrderField(update.orderId, { trackingId: update.trackingId });
      }

      await fetchOrders();
      Swal.fire("Success", "Tracking ID updated", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update some tracking IDs", "error");
      console.error(error);
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold">Order Management</h2>
        <button
          onClick={handleUpdateAllTracking}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded w-full sm:w-auto"
        >
          Update Tracking ID
        </button>
      </div>

      <div className="mb-4 font-semibold text-lg">
        Total Sales: <span className="text-green-600">₹{totalSales.toFixed(2)}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Tracking ID</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border p-2 break-all">{order._id}</td>
                  <td className="border p-2">{order.name}</td>
                  <td className="border p-2">{order.email}</td>
                  <td className="border p-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border p-1 rounded w-full"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={trackingInputs[order._id] || ""}
                      onChange={(e) => handleTrackingChange(order._id, e.target.value)}
                      className="border p-1 w-full rounded"
                      placeholder="Enter Tracking ID"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderPage;