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
      <h2>Category Management</h2>

      <div className="category-create">
        <h3>Create New Category</h3>
        <div className="category-form">
          <input
            type="text"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="flexible-checkbox"
              checked={newCategoryIsFlexible}
              onChange={e => setNewCategoryIsFlexible(e.target.checked)}
            />
            <label htmlFor="flexible-checkbox">Flexible (Add-ons)</label>
          </div>
          <button onClick={handleAddCategory}>Create Category</button>
        </div>
      </div>

      <div className="category-list">
        {categories.length === 0 ? (
          <div className="empty-state">
            <h3>No Categories Yet</h3>
            <p>Create your first category to get started</p>
          </div>
        ) : (
          categories.map(cat => {
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
                  <div className="dish-input-row">
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
                </div>

                <ul className="dish-list">
                  {dishes
                    .filter(d => d.category === cat.name)
                    .map(d => (
                      <li key={d._id} className="dish-item">
                        <span className="dish-name">{d.name}</span>
                        {isFlexible && (
                          <span className="dish-price">
                            ₹{d.price}
                            <span className="dish-unit">({d.unit})</span>
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryViewer;
