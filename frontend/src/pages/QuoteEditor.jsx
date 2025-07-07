import React, { useEffect, useState } from 'react';
import { API } from '../utils/api';

const QuoteEditor = () => {
  const [tiers, setTiers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedTierId, setSelectedTierId] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedDishes, setSelectedDishes] = useState({});
  const [mode, setMode] = useState('chef'); // or 'lead'

  useEffect(() => {
    API.get('/tiers').then(res => setTiers(res.data));
    API.get('/leads').then(res => setLeads(res.data));
  }, []);

  useEffect(() => {
    if (selectedTierId) {
      const tier = tiers.find(t => t._id === selectedTierId);
      setSelectedTier(tier);

      // Initialize empty selections
      const initial = {};
      tier.categories.forEach(c => {
        initial[c.category] = [];
      });
      setSelectedDishes(initial);
    }
  }, [selectedTierId, tiers]);

  const handleCheckbox = (category, dishId) => {
    const current = selectedDishes[category] || [];
    const isChecked = current.includes(dishId);

    const categoryLimit = selectedTier.categories.find(c => c.category === category)?.maxSelectable || Infinity;

    if (!isChecked && current.length >= categoryLimit) return;

    const updated = isChecked
      ? current.filter(id => id !== dishId)
      : [...current, dishId];

    setSelectedDishes(prev => ({
      ...prev,
      [category]: updated
    }));
  };

  const handleSubmit = async () => {
    const formatted = Object.keys(selectedDishes).map(cat => ({
      category: cat,
      dishIds: selectedDishes[cat]
    }));

    try {
      const res = await API.post('/quotesNew', {
        tierId: selectedTierId,
        selectedDishes: formatted,
        updatedBy: mode
      });

      const quoteId = res.data._id;

      if (selectedLeadId) {
        await API.patch(`/leads/${selectedLeadId}/attach-quote`, {
          quoteId
        });
        alert('✅ Quote saved and attached to lead!');
      } else {
        alert('✅ Quote saved (not attached to lead)');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save quote');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quote Editor</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>Select Lead: </label>
        <select
          value={selectedLeadId}
          onChange={e => setSelectedLeadId(e.target.value)}
        >
          <option value="">-- Select Lead --</option>
          {leads.map(lead => (
            <option key={lead._id} value={lead._id}>
              {lead.name || lead.phone}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Select Tier: </label>
        <select
          value={selectedTierId}
          onChange={e => setSelectedTierId(e.target.value)}
        >
          <option value="">-- Select Tier --</option>
          {tiers.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>

        <label style={{ marginLeft: '20px' }}>Editor Role: </label>
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="chef">Chef</option>
          <option value="lead">Lead</option>
        </select>
      </div>

      {selectedTier && (
        <div style={{ marginTop: '20px' }}>
          {selectedTier.categories.map(cat => (
            <div key={cat.category} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
              <h4>{cat.category} (max {cat.maxSelectable})</h4>
              {cat.dishIds.map(dish => (
                <label key={dish._id} style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={selectedDishes[cat.category]?.includes(dish._id) || false}
                    onChange={() => handleCheckbox(cat.category, dish._id)}
                  />
                  {dish.name}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Save Quote</button>
        </div>
      )}
    </div>
  );
};

export default QuoteEditor;
