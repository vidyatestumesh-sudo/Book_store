import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import getBaseUrl from "../../../utils/baseURL";


const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${getBaseUrl()}/api/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${getBaseUrl()}/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire("Success", "Order status updated", "success");
      fetchOrders();
    } catch (error) {
      Swal.fire("Error", "Failed to update order status", "error");
    }
  };

  const handleTrackingIdChange = async (orderId, trackingId) => {
    try {
      await axios.patch(
        `${getBaseUrl()}/api/orders/${orderId}`,
        { trackingId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire("Success", "Tracking ID updated", "success");
      fetchOrders();
    } catch (error) {
      Swal.fire("Error", "Failed to update tracking ID", "error");
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl mb-6 font-bold">Order Management</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Order ID</th>
            <th className="border border-gray-300 p-2">Customer Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Tracking ID</th>
            <th className="border border-gray-300 p-2">Update Status</th>
            <th className="border border-gray-300 p-2">Update Tracking</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No orders found.
              </td>
            </tr>
          )}
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{order._id}</td>
              <td className="border border-gray-300 p-2">{order.name}</td>
              <td className="border border-gray-300 p-2">{order.email}</td>
              <td className="border border-gray-300 p-2">{order.status}</td>
              <td className="border border-gray-300 p-2">{order.trackingId || "N/A"}</td>
              <td className="border border-gray-300 p-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  defaultValue={order.trackingId || ""}
                  placeholder="Enter Tracking ID"
                  onBlur={(e) => handleTrackingIdChange(order._id, e.target.value)}
                  className="border rounded p-1 w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderPage;
