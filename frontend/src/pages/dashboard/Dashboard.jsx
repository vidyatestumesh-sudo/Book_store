import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import getBaseUrl from "../../utils/baseURL";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TbCurrencyRupee } from "react-icons/tb";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [totalSales, setTotalSales] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        setData(response.data);
        const ordersRes = await axios.get(`${getBaseUrl()}/api/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const orders = ordersRes.data;

        const total = orders.reduce((sum, order) => {
          if (order.status !== "Cancelled") {
            return sum + (order.totalPrice || 0);
          }
          return sum;
        }, 0);

        setTotalSales(total);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
      {/* Total Books */}
      <div className="group bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="flex items-center gap-4" onClick={() => navigate("/dashboard/inventory")}>
          <div className="bg-purple-100 p-4 rounded-full group-hover:bg-purple-200 transition">
            <MdOutlineLibraryBooks className="text-purple-600 text-3xl group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
              {data?.totalBooks ?? 0}
            </h3>
            <p className="text-gray-500 text-sm">Total Products</p>
          </div>
        </div>
      </div>

      {/* Total Sales */}
      <div className="group bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-200 transition">
            <TbCurrencyRupee className="text-green-600 text-3xl group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 group-hover:text-green-700 transition-colors">
              ₹{totalSales.toFixed(2)}
            </h3>
            <p className="text-gray-500 text-sm">Total Sales</p>
          </div>
        </div>
      </div>

      {/* Total Orders */}
      <div className="group bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="flex items-center gap-4" onClick={() => navigate("/dashboard/orders")}>
          <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200 transition">
            <AiOutlineShoppingCart className="text-blue-600 text-3xl group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
              {data?.totalOrders ?? 0}
            </h3>
            <p className="text-gray-500 text-sm">Total Orders</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-6">
        <button
          onClick={() => navigate("/dashboard/orders")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Track Orders
        </button>
        <button
          onClick={() => navigate("/dashboard/billing-download")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Download Billing
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
