import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import getBaseUrl from "../../utils/baseURL";
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import {
  updateCartProductDetails,
  clearCart,
  clearGiftDetails,
  saveGiftDetails
} from "../../redux/features/cart/cartSlice";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const giftDetails = useSelector((state) => state.cart.giftDetails);
  const [isGift, setIsGift] = useState(!!giftDetails?.to);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ local loading state

  const { data: allBooks } = useFetchAllBooksQuery();

  useEffect(() => {
    if (allBooks && cartItems.length > 0) {
      cartItems.forEach((cartItem) => {
        const book = allBooks.find((b) => b._id === cartItem._id);
        if (book) {
          dispatch(
            updateCartProductDetails({
              _id: book._id,
              stock: book.stock,
              newPrice: book.newPrice,
              oldPrice: book.oldPrice,
            })
          );
        }
      });
    }
  }, [allBooks, cartItems, dispatch]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.newPrice * item.qty, 0);
  const originalTotal = cartItems.reduce((acc, item) => acc + (item.oldPrice || item.newPrice) * item.qty, 0);
  const discount = originalTotal - subtotal;
  const finalAmount = subtotal;

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [createOrder] = useCreateOrderMutation();

  useEffect(() => {
    if (!giftDetails?.to && !giftDetails?.from && !giftDetails?.message) {
      setIsGift(false);
    }
  }, [giftDetails]);

  const onSubmit = async (data) => {
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    if (totalItems === 0 || finalAmount <= 0) {
      Swal.fire({
        title: "Cart is Empty",
        text: "Please add some products to your cart before placing an order.",
        icon: "warning",
        confirmButtonColor: "#C76F3B",
      });
      return;
    }

    if (!isChecked) {
      Swal.fire({
        title: "Terms Not Agreed",
        text: "You must agree to the Terms & Conditions before placing an order.",
        icon: "warning",
        confirmButtonColor: "#C76F3B",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Order",
      html: `
        Total Amount: <strong>₹${finalAmount.toFixed(2)}</strong><br/>
        Total Items: <strong>${totalItems}</strong>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, place order",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#C76F3B",
      cancelButtonColor: "#888",
    });

    if (result.isConfirmed) {
      setLoading(true); // ✅ start loading

      const newOrder = {
        name: data.name,
        email: data.email,
        address: {
          city: data.city,
          country: data.country,
          state: data.state,
          zipcode: data.zipcode,
          street: data.street,
        },
        phone: data.phone,
        productIds: cartItems.map(item => item._id),
        products: cartItems.map(item => ({
          bookId: item._id,
          title: item.title,
          price: item.newPrice,
          quantity: item.qty,
        })),
        totalPrice: finalAmount,
        giftTo: isGift ? giftDetails.to : null,
        giftFrom: isGift ? giftDetails.from : null,
        giftMessage: isGift ? giftDetails.message : null,
      };

      try {
        await createOrder(newOrder).unwrap();

        await Swal.fire({
          title: "Order Confirmed!",
          html: `
            Your order has been placed successfully.<br/>
            Total Amount: <strong>₹${finalAmount.toFixed(2)}</strong><br/>
            Total Items: <strong>${totalItems}</strong>
          `,
          icon: "success",
          confirmButtonColor: "#C76F3B",
        });

        setLoading(false); // stop loader immediately
        dispatch(clearCart());
        dispatch(clearGiftDetails());
        navigate("/orders");

        // ✅ Update stock in background without blocking
        cartItems.forEach(async (item) => {
          try {
            const newStock = item.stock - item.qty;
            await axios.put(
              `${getBaseUrl()}/api/books/edit/${item._id}`,
              { stock: newStock },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
          } catch (err) {
            console.error("Stock update failed for", item._id, err);
          }
        });

      } catch (error) {
        console.error("Error placing order", error);

        Swal.fire({
          title: "Error",
          text: "Failed to place an order. Please try again.",
          icon: "error",
          confirmButtonColor: "#C76F3B",
        });

        setLoading(false);
      }

    }
  };

  return (
    <div className="container">
      <div className="max-w-9xl mx-auto py-0 text-center flex flex-col justify-center items-center px-0 mb-20">

        {/* Title */}
        <div className="relative inline-block">
          <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-snug mb-4 mt-10">
            Checkout
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 h-auto [opacity:0.15]"
          />
        </div>

        <div className="max-w-8xl w-full rounded-md p-4 mx-auto mt-2 grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg p-6 border transition-all duration-300">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
              <h2 className="text-[21px] md:text-[24px] font-playfair mb-4 text-left">
                Personal Details
              </h2>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 text-left">
                {[
                  { label: "Full Name", id: "name", type: "text" },
                  { label: "Email Address", id: "email", type: "email" },
                  { label: "Phone Number", id: "phone", type: "tel" },
                  { label: "Street / Address", id: "street", type: "text" },
                  { label: "City", id: "city", type: "text" },
                  { label: "Country / Region", id: "country", type: "text" },
                  { label: "State / Province", id: "state", type: "text" },
                  { label: "Pincode", id: "zipcode", type: "text" },
                ].map(field => (
                  <div key={field.id} className="flex flex-col">
                    <label htmlFor={field.id} className="mb-1 font-Figtree text-gray-700">{field.label}</label>
                    <input
                      {...register(field.id, { required: `${field.label} is required` })}
                      type={field.type}
                      id={field.id}
                      className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-[#C76F3B]"
                    />
                    {errors[field.id] && (
                      <p className="text-red-600 text-sm mt-1">{errors[field.id].message}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Gift Option */}
              <div className="mt-4 bg-white rounded-lg border p-4">
                <label className="flex items-center gap-2 text-gray-700 text-[16px]">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={() => setIsGift(!isGift)}
                    className="accent-[#C76F3B] w-4 h-4"
                  />
                  This is a gift <CardGiftcardOutlinedIcon className="text-gray-600" />
                </label>

                {isGift && (
                  <div className="flex flex-col gap-3 mt-2">
                    <input
                      type="text"
                      placeholder="Gift To"
                      value={giftDetails?.to || ""}
                      onChange={(e) =>
                        dispatch(saveGiftDetails({ ...giftDetails, to: e.target.value }))
                      }
                      className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-[#C76F3B]"
                    />
                    <input
                      type="text"
                      placeholder="Gift From"
                      value={giftDetails?.from || ""}
                      onChange={(e) =>
                        dispatch(saveGiftDetails({ ...giftDetails, from: e.target.value }))
                      }
                      className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-[#C76F3B]"
                    />
                    <textarea
                      placeholder="Message"
                      value={giftDetails?.message || ""}
                      onChange={(e) =>
                        dispatch(saveGiftDetails({ ...giftDetails, message: e.target.value }))
                      }
                      className="h-24 border border-gray-300 rounded px-4 py-2 bg-gray-50 focus:outline-[#C76F3B]"
                    />
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-5 h-5 accent-[#C76F3B]"
                />
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the <Link to="#" className="underline text-[#C76F3B]">Terms & Conditions</Link> and <Link to="#" className="underline text-[#C76F3B]">Shopping Policy</Link>.
                </label>
              </div>

              {/* Total + Place Order */}
              <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3 bg-gray-50 p-4 rounded-md">
                <div className="flex flex-col items-center">
                  <span className="text-[20px] font-Figtree font-semibold">
                    Total: ₹ {finalAmount.toFixed(2)}
                  </span>
                  <span className="text-green-600 text-[18px]">
                    You Save: ₹ {discount.toFixed(2)}
                  </span>
                </div>
                <button
                  type="submit"
                  onClick={onSubmit}
                  disabled={!isChecked || loading}
                  className={`bg-[#C76F3B] hover:bg-[#A35427] text-white px-6 py-2 rounded-md font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${!isChecked || loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
