import React, { useState, useEffect } from 'react';
import { API } from '../utils/api';
import '../styles/CategoryViewer.css';

const CategoryViewer = ({ onCategoryDragStart }) => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newDish, setNewDish] = useState({ name: '', category: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [dishRes, categoryRes] = await Promise.all([
      API.get('/dishes'),
      API.get('/dishes/categories'),
    ]);
    setDishes(dishRes.data);
    setCategories(categoryRes.data);
  };

  const handleAddDish = async () => {
    if (!newDish.name || !newDish.category) return;
    const res = await API.post('/dishes', newDish);
    setDishes(prev => [...prev, res.data]);
    if (!categories.includes(res.data.category)) {
      setCategories(prev => [...prev, res.data.category]);
    }
    setNewDish({ name: '', category: '' });
  };

  return (
    <div className="category-viewer">
      <h2>Category Viewer</h2>
      <div className="add-dish">
        <input
          type="text"
          placeholder="Dish name"
          value={newDish.name}
          onChange={e => setNewDish({ ...newDish, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newDish.category}
          onChange={e => setNewDish({ ...newDish, category: e.target.value })}
        />
        <button onClick={handleAddDish}>Add Dish</button>
      </div>
      <div className="category-list">
        {categories.map(category => (
          <div
            className="category-block"
            key={category}
            draggable
            onDragStart={() => onCategoryDragStart(category)}
          >
            <h4>{category}</h4>
            <ul>
              {dishes
                .filter(d => d.category === category)
                .map(d => (
                  <li key={d._id}>{d.name}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryViewer;
