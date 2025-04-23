import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { restaurant_id, customer_name, order_type, items } = req.body;

    // Validate restaurant_id
    if (!mongoose.Types.ObjectId.isValid(restaurant_id)) {
      return res.status(400).json({ error: 'Invalid restaurant_id format' });
    }
    
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    let totalPrice = 0;
    const enrichedItems = [];

    // Loop through each item in the order and calculate price and check availability
    for (const item of items) {
      // Validate if menu_item_id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(item.menu_item_id)) {
        return res.status(400).json({ error: `Invalid menu_item_id: ${item.menu_item_id}` });
      }

      // Find the menu item in the MenuItem collection
      const menuItem = await MenuItem.findOne({ 
        _id: item.menu_item_id, 
        is_available: true 
      });

      if (!menuItem) {
        return res.status(400).json({ 
          error: `Menu item ${item.menu_item_id} is unavailable or doesn't exist.` 
        });
      }

      // Calculate item total price
      const itemTotal = menuItem.price * item.quantity;
      totalPrice += itemTotal;

      // Store the enriched item details
      enrichedItems.push({
        menu_item_id: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        total: itemTotal
      });
    }

    // Create the order document
    const order = new Order({
      restaurant_id,
      customer_name,
      order_type,
      items: enrichedItems,
      total_price: totalPrice
    });

    // Save the order in MongoDB
    const savedOrder = await order.save();

    // Return the order details in the response
    res.status(201).json({
      customer_name: savedOrder.customer_name,
      order_type: savedOrder.order_type,
      created_at: savedOrder.created_at,
      items: enrichedItems.map(({ name, quantity, total }) => ({
        name,
        quantity,
        item_total: total
      })),
      total_price: savedOrder.total_price
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order creation failed', details: err.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get orders by restaurant_id
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurant_id format' });
    }
    
    const orders = await Order.find({ restaurant_id: restaurantId });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;