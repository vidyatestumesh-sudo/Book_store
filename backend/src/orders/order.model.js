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
    city: { type: String, required: true },
    country: String,
    state: String,
    zipcode: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    }
  ],
  products: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
      title: String,
      price: Number,
      quantity: Number,
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
  },
  giftTo: {
    type: String,
    required: false,
  },
  giftFrom: {
    type: String,
    required: false,
  },
  giftMessage: {
    type: String,
    required: false,
  }
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
