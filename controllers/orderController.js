import expressAsyncHandler from 'express-async-handler';
import asyncHandler from 'express-async-handler';
import { createOrder, getOrderById, listOrders } from '../services/orderService.js';

// @desc Create a new order
// @route POST /api/orders
// @access Private
export const createNewOrder = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming you're using an authentication middleware to attach user to the request
  const orderData = req.body;

  const order = await createOrder(userId, orderData);
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    orderId: order._id,
  });
});

export const getOrderDetails = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
  
    const order = await getOrderById(orderId);
    res.status(200).json({
      success: true,
      order,
    });
  });

  export const updateOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
  
    if (!status) {
      res.status(400);
      throw new Error('Status is required');
    }
  
    const updatedOrder = await updateOrderStatus(orderId, status);
  
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      updatedStatus: updatedOrder.status,
    });
  });

  export const getAllOrders = asyncHandler(async (req, res) => {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
  
    const filters = { status, startDate, endDate };
    
    const { orders, totalOrders } = await listOrders(filters, page, limit);
  
    res.status(200).json({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders,
    });
  });