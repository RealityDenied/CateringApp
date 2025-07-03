// src/DishManager.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DishManager = () => {
  const [dishes, setDishes] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // Fetch all dishes
  const fetchDishes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/dishes');
      setDishes(res.data);
    } catch (err) {
      console.error('Error fetching dishes:', err);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  // Add a new dish
  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      const newDish = { name, price: Number(price) };
      await axios.post('http://localhost:3000/api/dishes', newDish);
      setName('');
      setPrice('');
      fetchDishes();
    } catch (err) {
      console.error('Error adding dish:', err);
    }
  };

  // Delete a dish
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/dishes/${id}`);
      fetchDishes();
    } catch (err) {
      console.error('Error deleting dish:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add New Dish</h2>
      <form onSubmit={handleAddDish}>
        <input
          type="text"
          placeholder="Dish Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Add Dish</button>
      </form>

      <h3>All Dishes</h3>
      <ul>
        {dishes.map((dish) => (
          <li key={dish._id}>
            {dish.name} - ₹{dish.price}
            <button onClick={() => handleDelete(dish._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DishManager;
