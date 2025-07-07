import React, { useState, useEffect } from 'react';
import { API } from '../utils/api';
import '../styles/CategoryViewer.css';

const CategoryViewer = ({ onCategoryDragStart }) => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newDish, setNewDish] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [catRes, dishRes] = await Promise.all([
      API.get('/categories'),
      API.get('/dishes')
    ]);
    setCategories(catRes.data);
    setDishes(dishRes.data);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await API.post('/categories', { name: newCategoryName.trim() });
    setNewCategoryName('');
    fetchData();
  };

  const handleAddDish = async (category) => {
    const data = newDish[category];
    if (!data || !data.name) return;

    await API.post('/dishes', {
      name: data.name,
      description: data.description || '',
      category,
    });

    setNewDish(prev => ({ ...prev, [category]: { name: '', description: '' } }));
    fetchData();
  };

  return (
    <div className="category-viewer">
      <h2>Category Viewer</h2>

      <div className="category-create">
        <input
          type="text"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          placeholder="New category name"
        />
        <button onClick={handleAddCategory}>Create Category</button>
      </div>

      <div className="category-list">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="category-block"
            draggable
            onDragStart={() => onCategoryDragStart(cat.name)}
          >
            <h3>{cat.name}</h3>

            <div className="dish-inputs">
              <input
                type="text"
                placeholder="Dish name"
                value={newDish[cat.name]?.name || ''}
                onChange={e =>
                  setNewDish(prev => ({
                    ...prev,
                    [cat.name]: { ...prev[cat.name], name: e.target.value }
                  }))
                }
              />
              
              <button onClick={() => handleAddDish(cat.name)}>Add Dish</button>
            </div>

            <ul>
              {dishes
                .filter(d => d.category === cat.name)
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
