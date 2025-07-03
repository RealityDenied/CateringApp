import React, { useState, useEffect } from "react";
import { getDishes, createMenu } from "../utils/api";

function MenuForm({ onMenuCreated }) {
  const [name, setName] = useState("");
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    getDishes().then(setDishes);
  }, []);

  const handleDishToggle = (dishId) => {
    setSelectedDishes((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createMenu({ name, dishes: selectedDishes });
    setName("");
    setSelectedDishes([]);
    onMenuCreated(); // refresh parent
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Menu Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <h4>Select Dishes</h4>
      {dishes.map((dish) => (
        <div key={dish._id}>
          <label>
            <input
              type="checkbox"
              checked={selectedDishes.includes(dish._id)}
              onChange={() => handleDishToggle(dish._id)}
            />
            {dish.name} - ₹{dish.price}
          </label>
        </div>
      ))}
      <button type="submit">Create Menu</button>
    </form>
  );
}

export default MenuForm;
