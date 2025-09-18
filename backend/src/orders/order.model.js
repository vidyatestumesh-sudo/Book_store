const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: {
      type: String,
      required: true,
    },
    country: String,
    state: String,
    zipcode: String,
  },
  phone: {
    type: Number,
    required: true,
  },

  // ✅ Keep product IDs for reference
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    }
  ],

  // ✅ Add book titles and prices at the time of order
  products: [
    {
      title: String,
      price: Number,
    }
  ],

  totalPrice: {
    type: Number,
    required: true,
  },

  trackingId: {
    type: String,
    default: null,
  },

  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },

  guestOrderCode: {
    type: String,
    default: null,
  }

}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
