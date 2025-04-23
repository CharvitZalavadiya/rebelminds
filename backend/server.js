import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import restaurantsRoute from './routes/restaurants.js';
import menuItemsRoute from './routes/menuItems.route.js';
import ordersRoute from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send(`Server is running on port ${PORT}`);
});

app.use('/restaurants', restaurantsRoute);
app.use('/menu-items', menuItemsRoute);
app.use('/orders', ordersRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});