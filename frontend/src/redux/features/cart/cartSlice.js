import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

// Load cart from localStorage
const savedCart = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const initialState = {
  cartItems: savedCart,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = { ...action.payload, qty: 1 };
      const existingItem = state.cartItems.find((item) => item._id === newItem._id);

      if (existingItem) {
        if (existingItem.qty < newItem.stock) {
          existingItem.qty += 1;
          Swal.fire({
            position: "top-end",
            icon: "info",
            title: "Increased quantity in cart",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Stock limit reached",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        state.cartItems.push(newItem);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Product Added to the Cart",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },

    updateCartQty: (state, action) => {
      const { _id, type } = action.payload;
      const item = state.cartItems.find(p => p._id === _id);

      if (item) {
        if (type === "increase" && item.qty < item.stock) item.qty += 1;
        else if (type === "decrease") {
          item.qty -= 1;
          if (item.qty <= 0) state.cartItems = state.cartItems.filter(p => p._id !== _id);
        }
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeSoldOut: (state) => {
      state.cartItems = state.cartItems.filter(item => item.stock > 0);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    updateCartStock: (state, action) => {
      const { bookId, newStock } = action.payload;
      state.cartItems = state.cartItems.map(item =>
        item._id === bookId ? { ...item, stock: newStock } : item
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    updateCartProductDetails: (state, action) => {
      const { _id, stock, newPrice, oldPrice } = action.payload;
      const index = state.cartItems.findIndex((item) => item._id === _id);
      if (index !== -1) {
        state.cartItems[index].stock = stock;
        state.cartItems[index].newPrice = newPrice;
        state.cartItems[index].oldPrice = oldPrice;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});

export const { 
  addToCart, removeFromCart, clearCart, updateCartQty, 
  removeSoldOut, updateCartStock, updateCartProductDetails 
} = cartSlice.actions;
export default cartSlice.reducer;
