import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { removeFromCart, updateCartQty, removeSoldOut } from "../../redux/features/cart/cartSlice";
import IconButton from "@mui/material/IconButton";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [isGift, setIsGift] = useState(false);
  const [giftDetails, setGiftDetails] = useState({ from: "", to: "", message: "" });

  useEffect(() => {
    dispatch(removeSoldOut());
  }, [dispatch]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.newPrice * item.qty, 0);
  const originalTotal = cartItems.reduce((acc, item) => acc + (item.oldPrice || item.newPrice) * item.qty, 0);
  const discount = originalTotal - subtotal;
  const finalAmount = subtotal;

  const PriceTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: '#fff',
      color: '#333',
      fontSize: 12,
      padding: '8px 14px',
      borderRadius: 8,
      border: '1px solid #ddd',
      maxWidth: 320,
      whiteSpace: 'normal',
      lineHeight: 2,
      textAlign: 'left',
    },
  }));

  const handleQtyChange = (product, type) => {
    if (type === "increase" && product.qty >= product.stock) return;
    dispatch(updateCartQty({ _id: product._id, type }));
  };

  const handleShare = async (product) => {
    const shareData = {
      title: product.title,
      text: `Check out this book: ${product.title}`,
      url: `${window.location.origin}/books/${product._id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="container">
      <div className="max-w-9xl mx-auto py-0 text-center flex flex-col justify-center items-center px-0 mb-20">
        {/* Title Section */}
        <div className="relative inline-block">
          <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-4 mt-10">
            Shopping Cart
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-1"
          />
        </div>

        {cartItems.length > 0 ? (
          // Two-column layout when cart has items
          <div className="max-w-8xl rounded-md p-4 mx-auto grid grid-cols-1 mt-2 lg:grid-cols-3 gap-20">
            {/* LEFT: Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-lg transition-all duration-300">
              <ul className="space-y-6">
                {cartItems.map((product) => (
                  <li
                    key={product._id}
                    className="flex flex-col sm:flex-row gap-6 border-b pb-6 transition hover:border p-2 rounded-lg"
                  >
                    {/* Image */}
                    <img
                      src={getImgUrl(product.coverImage)}
                      alt={product.title}
                      className="w-38 h-44 object-cover rounded-md border shadow-sm transition-transform duration-300 hover:scale-105"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[21px] xl:text-[21px] font-playfair font-regular leading-snug text-left text-gray-800">
                        {product.title}
                      </h3>

                      <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] text-gray-800 font-Figtree font-regular leading-tight text-left mt-0">
                        by {product.author || "Unknown Author"}
                      </p>

                      {/* Info Section */}
                      <div className="text-left mt-0 px-0 mb-0">
                        <div className="inline-flex justify-start items-center gap-2 w-full flex-wrap md:flex-nowrap">
                          <span className="text-gray-500 line-through text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px] font-Figtree font-regular">
                            ₹{product?.oldPrice}
                          </span>
                          <span className="text-black font-Figtree font-bold text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] flex items-center">
                            ₹{product?.newPrice}
                          </span>
                          {product?.oldPrice > product?.newPrice && (
                            <span className="text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px] text-green-600 px-0 py-0 font-Figtree font-bold ">
                              {Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)}% off
                            </span>
                          )}
                          <PriceTooltip
                            title={
                              <div className="w-52">
                                <div className="flex justify-between">
                                  <span>Selling Price</span>
                                  <span className="line-through">₹{product.oldPrice}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                  <span>Extra Discount</span>
                                  <span>- ₹{(product.oldPrice - product.newPrice) * product.qty}</span>
                                </div>
                                <div className="flex justify-between font-bold mt-1">
                                  <span>Special Price</span>
                                  <span>₹{product.newPrice}</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between font-bold">
                                  <span>Total</span>
                                  <span>₹{product.newPrice * product.qty}</span>
                                </div>
                              </div>
                            }
                            arrow
                          >
                            <InfoOutlinedIcon className="text-gray-600 cursor-pointer ml-0" fontSize="smaller" />
                          </PriceTooltip>
                        </div>
                      </div>

                      {/* Stock */}
                      <p className={`text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px] mt-1 font-Figtree font-regular text-left ${product.stock <= 10 ? "text-[#993333]" : "text-green-600"}`}>
                        {product.stock <= 10
                          ? `In Stock - Only ${product.stock} left`
                          : "In Stock"}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border rounded-md">
                          {product.qty > 1 ? (
                            <IconButton
                              size="small"
                              onClick={() => handleQtyChange(product, "decrease")}
                              className="text-gray-700 hover:bg-gray-200 transition p-1"
                            >
                              <RemoveOutlinedIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton
                              size="small"
                              onClick={() => dispatch(removeFromCart(product))}
                              className="text-gray-700 hover:bg-gray-200 transition p-1"
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                          )}

                          <span className="px-2 w-8 text-center text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
                            {product.qty}
                          </span>

                          <IconButton
                            size="small"
                            onClick={() => handleQtyChange(product, "increase")}
                            disabled={product.qty >= product.stock}
                            className={`text-gray-700 transition p-1 ${product.qty >= product.stock ? "opacity-50" : "hover:bg-gray-200"}`}
                          >
                            <AddOutlinedIcon fontSize="small" />
                          </IconButton>
                        </div>

                        <IconButton
                          size="small"
                          onClick={() => handleShare(product)}
                          className="text-gray-600 hover:text-indigo-600 p-0"
                        >
                          <ShareOutlinedIcon fontSize="smaller" />
                        </IconButton>
                      </div>
                    </div>
                  </li>
                ))}
                <div className="flex justify-between items-center mb-6">
                  <Link
                    to="/publications"
                    className="mt-0 flex items-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] text-white px-6 py-2 no-underline rounded-md font-medium transition-colors duration-300 text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px]"
                  >
                    <ArrowBackOutlinedIcon fontSize="small" />
                    CONTINUE SHOPPING
                  </Link>
                  <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] font-Figtree font-regular">
                    Subtotal (
                    <span className="font-bold">
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)} item
                      {cartItems.reduce((acc, item) => acc + item.qty, 0) > 1 ? "s" : ""}
                    </span>
                    ): ₹
                    <span className="font-bold">{subtotal.toFixed(2)}</span>
                  </p>
                </div>
              </ul>
            </div>

            {/* RIGHT: Gift & Price Summary */}
            <div className="flex flex-col gap-3">
              {/* Gift Section */}
              <div className="bg-white rounded-lg border p-6 flex flex-col gap-3">
                <div className="flex justify-center">
                  <label className="flex items-center gap-2 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] font-Figtree font-regular">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={() => setIsGift(!isGift)}
                      className="accent-[#C76F3B] w-4 h-4"
                    />
                    This will be a gift <CardGiftcardOutlinedIcon className="text-gray-600" />
                  </label>
                </div>

                {isGift && (
                  <div className="flex flex-col gap-3 mt-2">
                    <TextField
                      label="Gift To"
                      variant="outlined"
                      size="small"
                      value={giftDetails.to}
                      onChange={(e) => setGiftDetails({ ...giftDetails, to: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Gift From"
                      variant="outlined"
                      size="small"
                      value={giftDetails.from}
                      onChange={(e) => setGiftDetails({ ...giftDetails, from: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Message"
                      variant="outlined"
                      size="small"
                      multiline
                      rows={3}
                      value={giftDetails.message}
                      onChange={(e) => setGiftDetails({ ...giftDetails, message: e.target.value })}
                      fullWidth
                    />

                    <button
                      onClick={() => {
                        console.log("Gift details saved:", giftDetails);
                        alert("Gift details saved & applied!");
                      }}
                      className="mt-1 bg-[#C76F3B] hover:bg-[#A35427] text-white py-2 rounded-md font-medium transition-colors duration-300 text-[14px] sm:text-[16px] lg:text-[18px]"
                    >
                      Save & Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-white rounded-lg border p-4 flex flex-col gap-2">
                <h3 className="text-[16px] sm:text-[20px] md:text-[22px] lg:text-[23px] xl:text-[23px] font-playfair font-regular mb-3 mt-0">
                  Price Details
                </h3>
                <div className="flex justify-between text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] text-gray-700">
                  <span>Price ({cartItems.reduce((a, b) => a + b.qty, 0)} items)</span>
                  <span>₹ {originalTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
                  <span>Discount</span>
                  <span>- ₹ {discount.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-gray-900 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
                  <span>Total Amount</span>
                  <span>₹ {finalAmount.toFixed(2)}</span>
                </div>
                <p className="text-green-600 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
                  You will save ₹ {discount.toFixed(2)} on this order
                </p>
                <Link
                  to="/checkout"
                  className="mt-0 block w-full bg-[#C76F3B] hover:bg-[#A35427] text-white px-6 py-2 no-underline rounded-md text-center font-medium transition-colors duration-300 text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px]"
                >
                  PROCEED TO CHECKOUT
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Single centered container when cart is empty
          <div className="bg-white p-6 mt-20 text-center w-full md:w-2/3 lg:w-1/2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
              Your cart is empty!
            </h2>
            <p className="text-base sm:text-lg mb-4 text-gray-700">
              Looks like you haven’t added anything yet. Start exploring and add your favorite books to the cart!
            </p>
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] no-underline text-white px-5 py-2 rounded-md text-center font-medium transition-colors duration-300 text-base sm:text-lg"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
