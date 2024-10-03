import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Assuming you have a Product model
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Completed', 'Cancelled'],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
