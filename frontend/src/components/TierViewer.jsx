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
    if (!newTierName) return;
    const res = await API.post('/tiers', { name: newTierName });
    setTiers(prev => [...prev, res.data]);
    setNewTierName('');
  };

  const handleDrop = async (tierId, category) => {
    const dishRes = await API.get('/dishes');
    const matchingDishes = dishRes.data.filter(d => d.category === category);

    const maxSelectable = parseInt(prompt(`How many dishes can be selected from "${category}"?`)) || matchingDishes.length;

    const res = await API.put(`/tiers/${tierId}/categories`, {
      category,
      maxSelectable,
      dishIds: matchingDishes.map(d => d._id),
    });

    fetchTiers(); // refresh
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
            <h3>{tier.name}</h3>
            {tier.categories.map(cat => (
              <div key={cat.category}>
                <h4>{cat.category} (max: {cat.maxSelectable})</h4>
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
