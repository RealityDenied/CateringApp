import React, { useState } from 'react';
import { addDish } from '../utils/api';

const DishForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) return;
    const newDish = await addDish({ name, price: Number(price) });
    onAdd(newDish);
    setName('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Dish Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <button type="submit">Add Dish</button>
    </form>
  );
};

export default DishForm;
