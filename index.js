import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from  './routes/productsRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import cartRoutes from "./routes/cartRoutes.js"
import { errorHandler } from './utils/errorHandling.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});