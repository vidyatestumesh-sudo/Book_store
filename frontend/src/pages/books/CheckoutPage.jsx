import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";

const CheckoutPage = () => {
  const cartItems = useSelector(state => state.cart.cartItems);

  const subtotal = cartItems.reduce((acc, item) => acc + item.newPrice * item.qty, 0);
  const originalTotal = cartItems.reduce((acc, item) => acc + (item.oldPrice || item.newPrice) * item.qty, 0);
  const discount = originalTotal - subtotal;
  const finalAmount = subtotal;

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftDetails, setGiftDetails] = useState({ from: "", to: "", message: "" });

  const onSubmit = async (data) => {
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
    };

    try {
      await createOrder(newOrder).unwrap();
      Swal.fire({
        title: "Confirmed Order",
        text: "Your order placed successfully!",
        icon: "success",
        confirmButtonColor: "#C76F3B",
        confirmButtonText: "Great!",
      });
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order", error);
      alert("Failed to place an order");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading....</div>;
  }

  return (
    <div className="container">
      <div className="max-w-9xl mx-auto py-0 text-center flex flex-col justify-center items-center px-0 mb-20">
        {/* Title Section */}
        <div className="relative inline-block">
          <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-4 mt-10">
            Checkout
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-1"
          />
        </div>

        <div className="max-w-8xl w-full rounded-md p-4 mx-auto mt-2 grid grid-cols-1 gap-6">
          {/* Full width Form */}
          <div className="bg-white rounded-lg p-6 shadow-md transition-all duration-300">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
              {/* Personal Details */}
              <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[23px] xl:text-[23px] font-playfair font-regular mb-4 text-left">
                Personal Details
              </h2>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 text-left">
                {[
                  { label: "Full Name", id: "name", type: "text" },
                  { label: "Email Address", id: "email", type: "email" },
                  { label: "Phone Number", id: "phone", type: "tel" },
                  { label: "Street / Address", id: "street", type: "text"},
                  { label: "City", id: "city", type: "text" },
                  { label: "Country / Region", id: "country", type: "text" },
                  { label: "State / Province", id: "state", type: "text" },
                  { label: "Pincode", id: "zipcode", type: "text" },
                ].map(field => (
                  <div key={field.id} className={`flex flex-col ${field.col === 2 ? 'md:col-span-2' : ''}`}>
                    <label htmlFor={field.id} className="mb-1 font-Figtree font-regular text-gray-700">{field.label}</label>
                    <input
                      {...register(field.id, { required: `${field.label} is required` })}
                      type={field.type}
                      id={field.id}
                      className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-[#C76F3B]"
                    />
                    {errors[field.id] && <p className="text-red-600 text-sm mt-1">{errors[field.id].message}</p>}
                  </div>
                ))}
              </div>

              {/* Gift Option */}
              <div className="mt-4 bg-white rounded-lg border p-4">
                <label className="flex items-center gap-2 text-gray-700 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
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
                      className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-[#C76F3B]"
                      value={giftDetails.to}
                      onChange={(e) => setGiftDetails({ ...giftDetails, to: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Gift From"
                      className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-[#C76F3B]"
                      value={giftDetails.from}
                      onChange={(e) => setGiftDetails({ ...giftDetails, from: e.target.value })}
                    />
                    <textarea
                      placeholder="Message"
                      className="h-24 border border-gray-300 rounded px-4 py-2 bg-gray-50 focus:outline-[#C76F3B]"
                      value={giftDetails.message}
                      onChange={(e) => setGiftDetails({ ...giftDetails, message: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => alert("Gift details saved & applied!")}
                      className="mt-1 bg-[#C76F3B] hover:bg-[#A35427] text-white py-2 rounded-md font-medium transition-colors duration-300"
                    >
                      Save & Apply
                    </button>
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
                <label htmlFor="terms" className="text-gray-700 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
                  I agree to the <Link to="#" className="underline text-[#C76F3B]">Terms & Conditions</Link> and <Link to="#" className="underline text-[#C76F3B]">Shopping Policy</Link>.
                </label>
              </div>

              {/* Total and Place Order */}
              <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3 bg-gray-50 p-4 rounded-md">
                <div className="flex flex-col items-start md:items-start">
                  <span className="text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] font-Figtree font-semibold">
                    Total: ₹ {finalAmount.toFixed(2)}
                  </span>
                  <span className="text-green-600 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
                    You Save: ₹ {discount.toFixed(2)}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={!isChecked}
                  className={`bg-[#C76F3B] hover:bg-[#A35427] text-white px-6 py-2 rounded-md font-medium transition-colors duration-300 ${!isChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Place Order
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
