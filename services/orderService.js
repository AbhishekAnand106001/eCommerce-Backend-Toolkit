import Order from '../models/orderModel.js';

export const createOrder = async (userId, orderData) => {
  const { orderItems, shippingAddress, totalPrice } = orderData;

  // Validate if there are products in the order
  if (orderItems.length === 0) {
    throw new Error('No items in the order');
  }

  // Create a new order
  const newOrder = new Order({
    user: userId,
    orderItems,
    shippingAddress,
    totalPrice,
  });

  const savedOrder = await newOrder.save();
  return savedOrder;
};

export const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate('user', 'name email') // Populate user details for the order
    .populate('orderItems.product', 'name price'); // Assuming your product schema has 'name' and 'price'

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // Update order status
  order.status = status;
  const updatedOrder = await order.save();

  return updatedOrder;
};

export const listOrders = async (filters = {}, page = 1, limit = 10) => {
  const query = {};

  // Filter by status if provided
  if (filters.status) {
    query.status = filters.status;
  }

  // Filter by date range if provided (createdAt field)
  if (filters.startDate && filters.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  const orders = await Order.find(query)
    .populate('user', 'name email') // Include user details
    .sort({ createdAt: -1 }) // Sort by most recent
    .skip((page - 1) * limit)
    .limit(limit);

  const totalOrders = await Order.countDocuments(query); // Count total for pagination

  return { orders, totalOrders };
};