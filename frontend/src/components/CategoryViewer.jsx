import React, { useState, useEffect } from 'react';
import { API } from '../utils/api';
import '../styles/CategoryViewer.css';

const CategoryViewer = ({ onCategoryDragStart }) => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIsFlexible, setNewCategoryIsFlexible] = useState(false);
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
    await API.post('/categories', {
      name: newCategoryName.trim(),
      isFlexible: newCategoryIsFlexible
    });
    setNewCategoryName('');
    setNewCategoryIsFlexible(false);
    fetchData();
  };

  const handleAddDish = async (category, isFlexible) => {
    const data = newDish[category];
    if (!data || !data.name) return;

    await API.post('/dishes', {
      name: data.name,
      category,
      price: isFlexible ? Number(data.price) : 0,
      unit: isFlexible ? data.unit : 'per guest'
    });

    setNewDish(prev => ({ ...prev, [category]: {} }));
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
        <label>
          <input
            type="checkbox"
            checked={newCategoryIsFlexible}
            onChange={e => setNewCategoryIsFlexible(e.target.checked)}
          />
          Flexible (Add-ons)
        </label>
        <button onClick={handleAddCategory}>Create Category</button>
      </div>

      <div className="category-list">
        {categories.map(cat => {
          const isFlexible = cat.isFlexible;
          return (
            <div
              key={cat._id}
              className="category-block"
              draggable
              onDragStart={() => onCategoryDragStart(cat.name)}
            >
              <h3>
                {cat.name}
                {isFlexible && ' (Flexible)'}
              </h3>

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
                {isFlexible && (
                  <>
                    <input
                      type="number"
                      placeholder="Price"
                      value={newDish[cat.name]?.price || ''}
                      onChange={e =>
                        setNewDish(prev => ({
                          ...prev,
                          [cat.name]: { ...prev[cat.name], price: e.target.value }
                        }))
                      }
                    />
                    <select
                      value={newDish[cat.name]?.unit || 'per guest'}
                      onChange={e =>
                        setNewDish(prev => ({
                          ...prev,
                          [cat.name]: { ...prev[cat.name], unit: e.target.value }
                        }))
                      }
                    >
                      <option value="per guest">per guest</option>
                      <option value="per stall">per stall</option>
                    </select>
                  </>
                )}
                <button onClick={() => handleAddDish(cat.name, isFlexible)}>Add Dish</button>
              </div>

              <ul>
                {dishes
                  .filter(d => d.category === cat.name)
                  .map(d => (
                    <li key={d._id}>
                      {d.name}
                      {isFlexible && ` — ₹${d.price} (${d.unit})`}
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryViewer;
