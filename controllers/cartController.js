import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

export const addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;  // Assuming user is authenticated and user ID is available

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find user's cart or create a new one
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product is already in the cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      // If item exists in cart, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Else add the product to the cart
      cart.items.push({ product: productId, quantity });
    }

    // Save the updated cart
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export const getCartItems = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Assuming user is authenticated and user ID is available

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price'); // Populate product details

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart.items);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated
    const { id } = req.params;  // Product ID from the URL
    const { quantity } = req.body;  // New quantity from request body

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the product exists in the cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    // Update the quantity if the product exists in the cart
    cart.items[itemIndex].quantity = quantity;

    // Save the updated cart
    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export const removeItemFromCart = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Assuming user is authenticated
    const { id } = req.params;    // Product ID from the URL

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the product in the cart items
    const itemIndex = cart.items.findIndex(item => item.product.toString() === id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    // Remove the item from the cart array
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};
