import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;