import React, { useEffect, useState } from 'react';
import DishForm from '../components/DishForm';
import DishList from '../components/DishList';
import { getAllDishes } from '../utils/api';

const DishManager = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    getAllDishes().then(setDishes);
  }, []);

  const addDish = (dish) => setDishes([...dishes, dish]);
  const removeDish = (id) => setDishes(dishes.filter((dish) => dish._id !== id));

  return (
    <div>
      <h2>Dish Management</h2>
      <DishForm onAdd={addDish} />
      <DishList dishes={dishes} onDelete={removeDish} />
    </div>
  );
};

export default DishManager;
