import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../utils/api';

const QuoteSession = () => {
  const { token } = useParams();
  const [lead, setLead] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [selectedTierId, setSelectedTierId] = useState('');
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedDishes, setSelectedDishes] = useState({});

  // Fetch lead and tiers
  useEffect(() => {
    if (!token) return;

    API.get(`/leads/by-token/${token}`).then(res => {
      setLead(res.data);
    });

    API.get('/tiers').then(res => {
      setTiers(res.data);
    });
  }, [token]);

  // When user selects tier
//   useEffect(() => {
//     if (selectedTierId && tiers.length > 0) {
//       const tier = tiers.find(t => t._id === selectedTierId);
//       setSelectedTier(tier);

//       const initial = {};
//       tier.categories.forEach(c => {
//         initial[c.category] = [];
//       });
//       setSelectedDishes(initial);
//     }
//   }, [selectedTierId, tiers]);



  //new useeffect to handle lead selection
  useEffect(() => {
  if (!token) return;

  API.get(`/leads/by-token/${token}`)
    .then(res => {
      console.log('📦 Lead loaded:', res.data);
      setLead(res.data);
    })
    .catch(err => {
      console.error('❌ Error fetching lead:', err);
      alert('Could not load lead. Please try again.');
    });

  API.get('/tiers')
    .then(res => setTiers(res.data))
    .catch(err => {
      console.error('❌ Error fetching tiers:', err);
    });
}, [token]);
//till here


  const handleCheckbox = (category, dishId) => {
    const current = selectedDishes[category] || [];
    const isChecked = current.includes(dishId);
    const max = selectedTier.categories.find(c => c.category === category)?.maxSelectable || Infinity;

    if (!isChecked && current.length >= max) return;

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
        updatedBy: 'lead'
      });

      const quoteId = res.data._id;

      await API.patch(`/leads/${lead._id}/attach-quote`, { quoteId });

      alert('✅ Your menu selection has been saved!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save your selection. Please try again.');
    }
  };

  if (!lead) return <div>Loading lead info...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Hello, {lead.name || lead.phone}</h2>
      <h3>Select your Menu</h3>

      <div>
        <label>Select Tier:</label>
        <select
          value={selectedTierId}
          onChange={e => setSelectedTierId(e.target.value)}
        >
          <option value="">-- Select Tier --</option>
          {tiers.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
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
          <button onClick={handleSubmit}>Submit My Selection</button>
        </div>
      )}
    </div>
  );
};

export default QuoteSession;
