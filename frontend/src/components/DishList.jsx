import React from 'react';
import { deleteDish } from '../utils/api';

const DishList = ({ dishes, onDelete }) => {
  return (
    <div>
      <h3>All Dishes</h3>
      {dishes.map((dish) => (
        <div key={dish._id}>
          {dish.name} - ₹{dish.price}
          <button onClick={() => {
            deleteDish(dish._id);
            onDelete(dish._id);
          }}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default DishList;
