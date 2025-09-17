const Order = require("./order.model");

const createAOrder = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      productIds,
      products,
      totalPrice,
    } = req.body;

    const guestOrderCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const newOrder = new Order({
      name,
      email,
      phone,
      address,
      productIds,
      products,
      totalPrice,
      guestOrderCode,
    });

    const savedOrder = await newOrder.save();

    res.status(200).json({
      message: "Order created successfully!",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// ✅ Get orders by user email
const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const orders = await Order.find({ email }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this email." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// ✅ Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ✅ Update order by ID (Admin)
const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrderById,
};
