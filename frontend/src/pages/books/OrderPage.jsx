import React, { useEffect } from "react";
import { useGetOrderByEmailQuery } from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

// MUI Icons
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

const OrderPage = () => {
  const { currentUser } = useAuth();

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useGetOrderByEmailQuery(currentUser?.email, {
    skip: !currentUser?.email,
  });

  useEffect(() => {
    console.log("Current User:", currentUser);
    console.log("Orders Data:", orders);
  }, [currentUser, orders]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex justify-center items-center text-center px-4">
        <p className="text-lg sm:text-xl text-gray-600">
          You need to be logged in to view your orders.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg sm:text-xl font-medium text-gray-600">
        Loading your orders...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg sm:text-xl font-semibold text-red-500">
        Error fetching orders! {error?.data?.message || ""}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl w-full bg-white rounded-lg p-4 mx-auto mt-6 text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1">
          You have no orders yet!
        </h2>
        <p className="text-base sm:text-lg mb-4 text-gray-700">
          Once you place an order, it will appear here. Start exploring and shop your favorite books!
        </p>
        <Link
          to="/publications"
          className="inline-flex items-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] no-underline text-white px-5 py-2 rounded-md text-center font-medium transition-colors duration-300 text-base sm:text-lg"
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="max-w-8xl mx-auto flex flex-col items-center px-4">

        {/* Title Section */}
        <div className="relative inline-block text-center mt-10 mb-6 w-full">
          <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug">
            Your Orders
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto opacity-15"
          />
        </div>

        {/* Orders */}
        {orders.map((order, index) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border mt-4 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 w-full flex flex-col lg:flex-row gap-4 mb-6"
          >
            {/* LEFT: Customer Info */}
            <div className="flex-1 flex flex-col gap-2 sm:gap-2">
              <p className="bg-[#C76F3B] text-white text-base sm:text-lg w-fit px-3 py-1 rounded-full font-semibold shadow-sm">
                Order # {index + 1}
              </p>
              <p className="flex flex-wrap items-center gap-2 text-base sm:text-lg text-gray-700">
                <PersonOutlineOutlinedIcon fontSize="small" /> {order.name}
              </p>
              <p className="flex items-start gap-2 text-base sm:text-lg text-gray-700">
                <EmailOutlinedIcon fontSize="small" />
                <span className="break-all">{order.email}</span>
              </p>
              <p className="flex flex-wrap items-center gap-2 text-base sm:text-lg text-gray-700">
                <PhoneOutlinedIcon fontSize="small" /> {order.phone}
              </p>
              <p className="flex flex-wrap items-center gap-2 text-base sm:text-lg text-gray-700">
                <LocationOnOutlinedIcon fontSize="small" /> {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}
              </p>
            </div>

            {/* RIGHT: Products & Price */}
            <div className="flex-1 border-t lg:border-t-0 lg:border-l pt-2 lg:pt-0 lg:pl-4 flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 break-words">
                Order ID : <span className="text-[#C76F3B] font-semibold">{order._id}</span>
              </h3>
              {order.status && (
                <p className="flex items-center gap-2 text-base sm:text-xl font-semibold text-[#C76F3B] mt-1">
                  <AssignmentTurnedInOutlinedIcon fontSize="small" />
                  Status : {order.status}
                </p>
              )}
              {order.trackingId && (
                <p className="text-base sm:text-lg text-gray-700 mt-0.5 break-words">
                  Tracking ID : <span className="font-medium">{order.trackingId}</span>
                </p>
              )}
              <h4 className="flex items-center gap-2 font-semibold text-gray-800 text-base sm:text-lg md:text-xl mb-1">
                <ShoppingBagOutlinedIcon fontSize="small" /> Products
              </h4>
              <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 font-Figtree space-y-1 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {order.products?.map((item, idx) => (
                  <li key={idx} className="hover:text-[#C76F3B] transition-colors break-words">
                    {item.title} - ₹{item.price} × {item.quantity || 1}
                  </li>
                ))}
              </ul>
              <p className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 mt-1">
                <MonetizationOnOutlinedIcon fontSize="small" /> Total Price : ₹{order.totalPrice}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default OrderPage;
