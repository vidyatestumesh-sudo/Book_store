import React, { useEffect, useState } from "react";
import { useGetOrderByEmailQuery } from "../../redux/features/orders/ordersApi";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";

// MUI Icons
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

const OrderPage = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, isError, error } = useGetOrderByEmailQuery(currentUser?.email, {
    skip: !currentUser?.email,
  });

  // Fetch all books to map images
  const { data: books = [] } = useFetchAllBooksQuery();
  const [ordersWithImages, setOrdersWithImages] = useState([]);

  useEffect(() => {
    if (orders.length > 0 && books.length > 0) {
      const updatedOrders = orders.map((order) => {
        const productsWithImages = order.products.map((prod) => {
          const book = books.find((b) => b._id === prod._id || order.productIds.includes(b._id));
          return {
            ...prod,
            coverImage: book?.coverImage || "",
          };
        });
        return { ...order, products: productsWithImages };
      });
      setOrdersWithImages(updatedOrders);
    }
  }, [orders, books]);

  if (!currentUser)
    return (
      <div className="min-h-screen flex justify-center items-center text-center px-4">
        <p className="text-lg sm:text-xl text-gray-600">You need to be logged in to view your orders.</p>
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg sm:text-xl font-medium text-gray-600">
        Loading your orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="container">
        <div className="max-w-8xl mx-auto flex flex-col items-center px-2">
          {/* Title Section */}
          <div className="relative inline-block text-center mt-5 mb-6 w-full">
            <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug">
              Your Orders
            </h1>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto opacity-15 mb-0"
            />
          </div>
          <div className="bg-white p-6 mt-20 text-center w-full md:w-2/3 lg:w-1/2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
              You have no orders yet!
            </h2>
            <p className="text-base sm:text-lg mb-4 text-gray-700">
              Once you place an order, it will appear here. Start exploring and shop your favorite books!
            </p>
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] no-underline text-white px-5 py-2 rounded-md text-center font-medium transition-colors duration-300 text-base sm:text-lg"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );


  return (
    <div className="container">
      <div className="max-w-8xl mx-auto flex flex-col items-center px-2">
        {/* Title Section */}
        <div className="relative inline-block text-center mt-5 mb-6 w-full">
          <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug">
            Your Orders
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto opacity-15 mb-0"
          />
        </div>

        {/* Orders */}
        {ordersWithImages.map((order, index) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border-1 mt-4 border-[#C76F3B] transition-all duration-300 p-4 w-full flex flex-col lg:flex-row gap-4 mb-6"
          >
            {/* LEFT: Products & Price */}
            <div className="flex-1 lg:border-r pt-1 lg:pt-0 lg:pr-4 flex flex-col gap-2">
              <p className="bg-[#C76F3B] text-white text-base sm:text-lg w-fit px-3 py-1 rounded-full font-semibold shadow-sm">
                Order # {index + 1}
              </p>

              <h4 className="flex items-center gap-2 font-semibold text-gray-800 text-base sm:text-lg md:text-xl mb-2">
                <ShoppingBagOutlinedIcon fontSize="small" /> Products
              </h4>
              <ul className="text-base sm:text-lg text-gray-700 font-Figtree space-y-2 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {order.products?.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 hover:text-[#C76F3B] transition-colors break-words">
                    <span className="w-6 text-right font-semibold text-[#C76F3B]">{idx + 1}.</span>
                    {item.coverImage && (
                      <img
                        src={getImgUrl(item.coverImage)}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded-sm"
                      />
                    )}
                    <span className="flex-1">{item.title} - ₹{item.price} × {item.quantity || 1}</span>
                  </li>
                ))}
              </ul>

              {order.status && (
                <p className="flex items-center gap-2 text-base sm:text-lg font-semibold text-[#C76F3B] mt-1">
                  <AssignmentTurnedInOutlinedIcon fontSize="small" /> Status : {order.status}
                </p>
              )}
              {order.trackingId && (
                <p className="text-base sm:text-lg text-gray-700 mt-0.5 break-words">
                  Tracking ID : <span className="font-medium">{order.trackingId}</span>
                </p>
              )}
              <p className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 mt-0">
                <PaymentOutlinedIcon fontSize="small" /> Total Price : ₹{order.totalPrice}
              </p>
            </div>

            {/* RIGHT: Delivery Details */}
            <div className="flex-1 flex flex-col gap-2 sm:gap-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-medium mb-3 text-gray-800 break-all w-full">
                Order ID: <span className="text-[#C76F3B] font-semibold">{order._id}</span>
              </h3>
              <div className="flex-1 flex flex-col gap-1 bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-200">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                  Delivery Details:
                </h4>

                <p className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                  <PersonOutlineOutlinedIcon fontSize="small" className="text-gray-500" /> {order.name}
                </p>
                <p className="flex flex-wrap items-start gap-2 text-sm sm:text-base text-gray-700 w-full">
                  <EmailOutlinedIcon fontSize="small" className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="break-all w-full sm:w-auto">{order.email}</span>
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                  <PhoneOutlinedIcon fontSize="small" className="text-gray-500" /> {order.phone}
                </p>
                <p className="flex flex-wrap items-start gap-2 text-sm sm:text-base text-gray-700 break-words">
                  <LocationOnOutlinedIcon fontSize="small" className="text-gray-500 mt-0.5" />
                  <span>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}</span>
                </p>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );

};

export default OrderPage;
