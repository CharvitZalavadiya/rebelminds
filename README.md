# Rebelminds

# Restaurant Order Management API

This is a RESTful API for managing restaurant orders, menu items, and restaurant information.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or Atlas)

### Installation Steps
1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   PORT=8080
   MONGO_URI=your_mongodb_connection_string
   ```
   Note: For MongoDB Atlas, use format: `mongodb+srv://username:password@cluster0.mongodb.net/main`

4. Start the server:
   ```
   node server.js
   ```
   The server will run on http://localhost:8080

## API Documentation

### Restaurants

#### Create a Restaurant
- **Endpoint:** `POST /restaurants`
- **Request Body:**
  ```json
  {
    "name": "Pizza Palace"
  }
  ```
- **Response (201):**
  ```json
  {
    "_id": "643a9a1f2f1234567890abcd",
    "name": "Pizza Palace"
  }
  ```

#### Get All Restaurants
- **Endpoint:** `GET /restaurants`
- **Response (200):**
  ```json
  [
    {
      "_id": "643a9a1f2f1234567890abcd",
      "name": "Pizza Palace"
    }
  ]
  ```

### Menu Items

#### Create a Menu Item
- **Endpoint:** `POST /menu-items`
- **Request Body:**
  ```json
  {
    "restaurant_id": "643a9a1f2f1234567890abcd",
    "name": "Margherita Pizza",
    "price": 300,
    "category": "Pizza",
    "is_available": true
  }
  ```
- **Response (201):**
  ```json
  {
    "_id": "643a9b2f1d1234567890efgh",
    "restaurant_id": "643a9a1f2f1234567890abcd",
    "name": "Margherita Pizza",
    "price": 300,
    "category": "Pizza",
    "is_available": true
  }
  ```

#### Get Menu Items by Restaurant
- **Endpoint:** `GET /menu-items/restaurant/:restaurantId`
- **Response (200):**
  ```json
  [
    {
      "_id": "643a9b2f1d1234567890efgh",
      "restaurant_id": "643a9a1f2f1234567890abcd",
      "name": "Margherita Pizza",
      "price": 300,
      "category": "Pizza",
      "is_available": true
    }
  ]
  ```

### Orders

#### Create an Order
- **Endpoint:** `POST /orders`
- **Request Body:**
  ```json
  {
    "restaurant_id": "643a9a1f2f1234567890abcd",
    "customer_name": "Alice",
    "order_type": "DINE_IN",
    "items": [
      {
        "menu_item_id": "643a9b2f1d1234567890efgh",
        "quantity": 2
      }
    ]
  }
  ```
- **Response (201):**
  ```json
  {
    "customer_name": "Alice",
    "order_type": "DINE_IN",
    "created_at": "2025-04-23T12:34:56.789Z",
    "items": [
      {
        "name": "Margherita Pizza",
        "quantity": 2,
        "item_total": 600
      }
    ],
    "total_price": 600
  }
  ```

#### Get Orders by Restaurant
- **Endpoint:** `GET /orders/restaurant/:restaurantId`
- **Response (200):**
  ```json
  [
    {
      "_id": "643a9c3f1e1234567890ijkl",
      "restaurant_id": "643a9a1f2f1234567890abcd",
      "customer_name": "Alice",
      "order_type": "DINE_IN",
      "created_at": "2025-04-23T12:34:56.789Z",
      "items": [
        {
          "menu_item_id": "643a9b2f1d1234567890efgh",
          "name": "Margherita Pizza",
          "quantity": 2,
          "price": 300,
          "total": 600
        }
      ],
      "total_price": 600
    }
  ]
  ```

## Testing with Postman

Import the collection in Postman from the `postman_collection.json` file or follow these steps:

1. Create a restaurant
2. Use the returned restaurant ID to create menu items
3. Use both IDs to create an order

## Project Structure
```
project/
├── config/
│   └── db.js             # MongoDB connection setup
├── models/
│   ├── Restaurant.js     # Restaurant schema and model
│   ├── MenuItem.js       # Menu item schema and model
│   └── Order.js          # Order schema and model
├── routes/
│   ├── restaurants.js    # Restaurant endpoints
│   ├── menuitems.js      # Menu item endpoints
│   └── orders.js         # Order endpoints
├── server.js             # Main application entry point
├── .env                  # Environment variables
└── README.md             # Documentation
```