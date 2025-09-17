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

    // ✅ Generate guest order code (optional for non-logged-in users)
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

module.exports = {
  createAOrder,
  getOrderByEmail
};
