import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';

const CheckoutPage = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice, 0).toFixed(2);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async (data) => {
    const newOrder = {
      name: data.name,
      email: data.email,
      address: {
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
        street: data.address,
      },
      phone: data.phone,
      productIds: cartItems.map(item => item?._id),

      // ✅ Include book titles and prices
      products: cartItems.map(item => ({
        title: item.title,
        price: item.newPrice,
      })),

      totalPrice: totalPrice,
    };

    try {
      await createOrder(newOrder).unwrap();
      Swal.fire({
        title: "Confirmed Order",
        text: "Your order placed successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Great!",
      });
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order", error);
      alert("Failed to place an order");
    }
  };

  if (isLoading) return <div className="text-center py-10 text-lg font-semibold">Loading....</div>;

  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 font-['Poppins']">
      <div className="container max-w-screen-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-indigo-700 text-center mb-8">🛒 Checkout</h2>

        <div className="text-center mb-8">
          <h3 className="font-semibold text-xl text-gray-700 mb-2">Cash On Delivery</h3>
          <p className="text-gray-600 mb-1">Total Price: <span className="font-semibold">₹ {totalPrice}</span></p>
          <p className="text-gray-600">Items: <span className="font-semibold">{cartItems.length || 0}</span></p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <p className="font-semibold text-lg text-gray-700 mb-2">Personal Details</p>
            <p className="text-gray-500 mb-4">Please fill out all the fields.</p>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 font-medium text-gray-600">Full Name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  id="name"
                  className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-indigo-500"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 font-medium text-gray-600">Email Address</label>
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  id="email"
                  className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-indigo-500"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col md:col-span-2">
                <label htmlFor="phone" className="mb-1 font-medium text-gray-600">Phone Number</label>
                <input
                  {...register("phone", { required: "Phone number is required" })}
                  type="tel"
                  id="phone"
                  className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-indigo-500"
                  placeholder="Phone Number"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div className="flex flex-col md:col-span-2">
                <label htmlFor="address" className="mb-1 font-medium text-gray-600">Address / Street</label>
                <input
                  {...register("address", { required: "Address is required" })}
                  type="text"
                  id="address"
                  className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-indigo-500"
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
              </div>

              <div className="flex flex-col">
                <label htmlFor="city" className="mb-1 font-medium text-gray-600">City</label>
                <input
                  {...register("city", { required: "City is required" })}
                  type="text"
                  id="city"
                  className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-indigo-500"
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
              </div>

              <div className="flex flex-col">
                <label htmlFor="country" className="mb-1 font-medium text-gray-600">Country / Region</label>
                <input
                  {...register("country", { required: "Country is required" })}
                  id="country"
                  className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-indigo-500"
                  placeholder="Country"
                />
                {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>}
              </div>

              <div className="flex flex-col">
                <label htmlFor="state" className="mb-1 font-medium text-gray-600">State / Province</label>
                <input
                  {...register("state", { required: "State is required" })}
                  id="state"
                  className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-indigo-500"
                  placeholder="State"
                />
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
              </div>

              <div className="flex flex-col">
                <label htmlFor="zipcode" className="mb-1 font-medium text-gray-600">Pincode</label>
                <input
                  {...register("zipcode", { required: "Pincode is required" })}
                  type="text"
                  id="zipcode"
                  className="h-10 border border-gray-300 rounded px-4 bg-gray-50 focus:outline-indigo-500"
                />
                {errors.zipcode && <p className="text-red-600 text-sm mt-1">{errors.zipcode.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="billing_same"
              onChange={(e) => setIsChecked(e.target.checked)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <label htmlFor="billing_same" className="text-gray-700">
              I agree to the{' '}
              <Link to="#" className="underline text-blue-600 hover:text-blue-800">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link to="#" className="underline text-blue-600 hover:text-blue-800">
                Shopping Policy
              </Link>.
            </label>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={!isChecked}
              className={`bg-indigo-600 text-white font-bold py-2 px-6 rounded hover:bg-indigo-700 transition disabled:bg-gray-400`}
            >
              Place an Order
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
