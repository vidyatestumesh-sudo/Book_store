import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery } from '../../../redux/features/orders/ordersApi';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);

  if (isLoading)
    return (
      <div className="text-center py-10 text-lg font-medium text-gray-600">
        Loading your dashboard...
      </div>
    );
  if (isError)
    return (
      <div className="text-center py-10 text-lg font-semibold text-red-500">
        Error loading your data!
      </div>
    );

  // ✅ Pick only the latest 2 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-blue-50 to-white py-16 font-['Poppins']">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl px-8 py-10 transition duration-300">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700">
            Hello, {currentUser?.displayName || 'Valued User'} 👋
          </h1>
          <p className="text-gray-500 mt-2 text-base">
            Welcome back! Here's a quick look at your profile and recent orders.
          </p>
        </div>

        {/* User Info */}
        <div className="mb-12 bg-indigo-50 border border-indigo-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            👤 Your Information
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-bold">Name:</span>{' '}
              {currentUser?.displayName || 'N/A'}
            </p>
            <p>
              <span className="font-bold">Email:</span> {currentUser?.email}
            </p>
            <p>
              <span className="font-bold">Phone:</span>{' '}
              {currentUser?.phoneNumber || 'Not provided'}
            </p>
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            🧾 Recent Orders
          </h2>
          {recentOrders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white border border-gray-200 p-5 rounded-xl shadow-md hover:shadow-lg hover:border-indigo-400 transition-all duration-300 ease-in-out"
                >
                  <p className="text-gray-800 font-medium">
                    <span className="font-bold text-indigo-600">Order ID:</span>{' '}
                    {order._id}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    📅 {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-blue-600 font-semibold">
                    Total: ₹{order.totalPrice}
                  </p>
                  <div className="mt-3">
                    <p className="font-semibold text-sm text-gray-700 mb-1">
                      🛍 Products:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {order.productIds.map((productId) => (
                        <li key={productId}>{productId}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-6">
              You have no recent orders.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
