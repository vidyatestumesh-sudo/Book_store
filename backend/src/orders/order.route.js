const express = require('express');
const {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrderById,
} = require('./order.controller');

const router = express.Router();

router.post('/', createAOrder);
router.get('/email/:email', getOrderByEmail);
router.get('/', getAllOrders);
router.patch('/:id', updateOrderById);

module.exports = router;
