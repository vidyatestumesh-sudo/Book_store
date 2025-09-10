import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../../utils/getImgUrl';
import { clearCart, removeFromCart } from '../../redux/features/cart/cartSlice';

const CartPage = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice, 0).toFixed(2);

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-4 font-['Poppins']">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
         <h2 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center mx-auto w-full">🛒 Shopping Cart</h2>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="bg-red-500 hover:bg-red-500 text-white px-6 py-1 rounded-md transition-all duration-300"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length > 0 ? (
          <ul className="space-y-6">
            {cartItems.map((product) => (
              <li
                key={product._id}
                className="flex flex-col sm:flex-row gap-4 items-center sm:items-start bg-gray-50 rounded-lg p-4 border hover:shadow-md transition"
              >
                <img
                  src={getImgUrl(product.coverImage)}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded-md border"
                />

                <div className="flex-1 w-full">
                  <div className="flex justify-between flex-wrap items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                    <p className="text-indigo-600 font-semibold text-base">₹ {product.newPrice}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Author :</strong> {product?.author || 'N/A'}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-600">
                      <strong>Qty:</strong> 1
                    </p>
                    <button
                      onClick={() => handleRemoveFromCart(product)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-medium mb-2">🛍️ Your cart is empty!</h2>
            <p className="mb-6">Start adding products to see them here.</p>
            <Link
              to="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium transition"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="mt-10 border-t pt-6">
            <div className="flex justify-between text-lg font-semibold text-gray-800 mb-4">
              <span>Subtotal:</span>
              <span>₹ {totalPrice}</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                to="/checkout"
                className="w-full sm:w-auto inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-center font-medium transition"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto text-indigo-600 hover:underline text-center text-sm font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
