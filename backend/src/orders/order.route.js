const express = require('express');
const {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrderById,
} = require('./order.controller');

const router = express.Router();

// Create a new order
router.post('/', createAOrder);

// Get orders by user email
router.get('/email/:email', getOrderByEmail);

// ✅ Admin: Get all orders
router.get('/', getAllOrders);

// ✅ Admin: Update order by ID
router.patch('/:id', updateOrderById);

module.exports = router;