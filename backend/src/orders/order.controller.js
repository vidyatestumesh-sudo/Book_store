const Order = require("./order.model");
const Book = require("../books/book.model");

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

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid products format." });
    }

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

    for (const item of products) {
      const book = await Book.findById(item.bookId);
      if (book) {
        if (book.stock < item.quantity) {
          return res.status(400).json({ message: `Not enough stock for ${book.title}` });
        }

        book.stock -= item.quantity;
        await book.save();
      }
    }

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

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingOrder = await Order.findById(id);

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = existingOrder.status;
    const newStatus = updateData.status;

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (previousStatus !== "Delivered" && newStatus === "Delivered") {
      for (const item of existingOrder.products) {
        const book = await Book.findById(item.bookId);
        if (book) {
          book.sold = (book.sold || 0) + item.quantity;
          await book.save();
        }
      }
    } else if (previousStatus === "Delivered" && newStatus !== "Delivered") {
      for (const item of existingOrder.products) {
        const book = await Book.findById(item.bookId);
        if (book) {
          book.sold = Math.max(0, (book.sold || 0) - item.quantity);
          await book.save();
        }
      }
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
