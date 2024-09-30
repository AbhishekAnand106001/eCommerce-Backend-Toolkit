import Product from '../models/productModel.js';

// List Products with optional filters
export const listProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;

        // Build query based on filters
        const query = {};
        if (category) query.category = category;
        if (minPrice) query.price = { $gte: minPrice };
        if (maxPrice) {
            query.price = query.price ? { ...query.price, $lte: maxPrice } : { $lte: maxPrice };
        }

        // Fetch products from database
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

// Get Product Details by ID (Optimized)
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // Find the product by ID and return a plain JavaScript object
        const product = await Product.findById(productId).lean();

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product details', error });
    }
};

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new product instance
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock
        });

        // Save product to database
        const product = await newProduct.save();

        res.status(201).json({
            message: 'Product created successfully',
            productId: product._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
};

// Update Product by ID
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = req.body;

        // Validate input (optional, customize as needed)
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No updates provided' });
        }

        // Find and update the product
        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
            new: true, // Return the updated document
            runValidators: true // Validate the updates against the schema
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
};

// Delete Product by ID
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        // Delete the product
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};


