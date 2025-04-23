import express from 'express';
import mongoose from 'mongoose';
import MenuItem from '../models/menuitem.model.js';
import Restaurant from '../models/Restaurant.js';

const router = express.Router();

// Create a new menu item
router.post('/', async (req, res) => {
  try {
    const { restaurant_id, name, price, category, is_available } = req.body;
    
    // Validate restaurant_id
    if (!mongoose.Types.ObjectId.isValid(restaurant_id)) {
      return res.status(400).json({ error: 'Invalid restaurant_id format' });
    }
    
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    const menuItem = new MenuItem({
      restaurant_id,
      name,
      price,
      category,
      is_available: is_available !== undefined ? is_available : true
    });
    
    const savedMenuItem = await menuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Menu item creation failed', details: err.message });
  }
});

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get menu items by restaurant_id
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurant_id format' });
    }
    
    const menuItems = await MenuItem.find({ restaurant_id: restaurantId });
    res.json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

export default router;