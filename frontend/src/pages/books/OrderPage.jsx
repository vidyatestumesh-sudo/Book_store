import React from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useAuth } from '../../context/AuthContext';

const OrderPage = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);

  if (isLoading)
    return <div className="text-center py-10 text-lg font-medium text-gray-600">Loading your orders...</div>;
  if (isError)
    return <div className="text-center py-10 text-lg font-semibold text-red-500">Error fetching orders!</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-blue-50 to-white py-16 px-4 font-['Poppins']">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">🧾 Your Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">No orders found!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg border hover:border-indigo-400 transition-all duration-300 p-6 space-y-3"
              >
                <p className="bg-indigo-600 text-white text-sm w-fit px-3 py-1 rounded-full font-semibold">
                  #{index + 1}
                </p>
                <h3 className="text-lg font-semibold text-gray-800">
                  Order ID: <span className="text-indigo-600">{order._id}</span>
                </h3>
                <p className="text-sm text-gray-700">👤 Name: {order.name}</p>
                <p className="text-sm text-gray-700">📧 Email: {order.email}</p>
                <p className="text-sm text-gray-700">📞 Phone: {order.phone}</p>
                <p className="text-sm text-gray-700 font-medium">
                  💰 Total Price: ₹{order.totalPrice}
                </p>

                <div>
                  <h4 className="font-semibold text-gray-800 mt-2">📍 Address:</h4>
                  <p className="text-sm text-gray-600">
                    {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mt-2">📦 Products:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {order.productIds.map((productId) => (
                      <li key={productId}>{productId}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
