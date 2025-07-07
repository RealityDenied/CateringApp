import React, { useState, useEffect } from 'react';
import { API } from '../utils/api';
import '../styles/TierViewer.css';

const TierViewer = ({ draggedCategory }) => {
  const [tiers, setTiers] = useState([]);
  const [newTierName, setNewTierName] = useState('');

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    const res = await API.get('/tiers');
    setTiers(res.data);
  };

  const createTier = async () => {
    if (!newTierName.trim()) return;
    await API.post('/tiers', { name: newTierName });
    setNewTierName('');
    fetchTiers();
  };

  const handleDrop = async (tierId, category) => {
    const dishRes = await API.get('/dishes');
    const matchingDishes = dishRes.data.filter(d => d.category === category);

    const maxSelectable = parseInt(prompt(`How many dishes can be selected from "${category}"?`)) || matchingDishes.length;

    await API.put(`/tiers/${tierId}/categories`, {
      category,
      maxSelectable,
      dishIds: matchingDishes.map(d => d._id),
    });

    fetchTiers();
  };

  const deleteTier = async (tierId) => {
    await API.delete(`/tiers/${tierId}`);
    fetchTiers();
  };

  const removeCategory = async (tierId, category) => {
    await API.put(`/tiers/${tierId}/categories/remove`, { category });
    fetchTiers();
  };

  const editMaxSelectable = async (tierId, category, currentValue) => {
    const newLimit = parseInt(prompt(`Enter new maxSelectable for "${category}"`, currentValue));
    if (!newLimit) return;

    await API.put(`/tiers/${tierId}/categories/edit`, {
      category,
      maxSelectable: newLimit
    });

    fetchTiers();
  };

  return (
    <div className="tier-viewer">
      <h2>Tier Viewer</h2>
      <div className="create-tier">
        <input
          type="text"
          placeholder="Tier name"
          value={newTierName}
          onChange={e => setNewTierName(e.target.value)}
        />
        <button onClick={createTier}>Create Tier</button>
      </div>

      <div className="tier-list">
        {tiers.map(tier => (
          <div
            key={tier._id}
            className="tier-block"
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(tier._id, draggedCategory)}
          >
            <div className="tier-header">
              <h3>{tier.name}</h3>
              <button onClick={() => deleteTier(tier._id)}>Delete Tier</button>
            </div>

            {tier.categories.map(cat => (
              <div key={cat.category} className="category-section">
                <div className="category-header">
                  <h4>{cat.category} (max: {cat.maxSelectable})</h4>
                  <button onClick={() => editMaxSelectable(tier._id, cat.category, cat.maxSelectable)}>Edit Limit</button>
                  <button onClick={() => removeCategory(tier._id, cat.category)}>Remove</button>
                </div>
                <ul>
                  {cat.dishIds.map(d => (
                    <li key={d._id}>{d.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TierViewer;
