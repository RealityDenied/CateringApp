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
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const [leadRes, tierRes] = await Promise.all([
          API.get(`/leads/by-token/${token}`),
          API.get('/tiers'),
        ]);

        setLead(leadRes.data);
        setTiers(tierRes.data);

        const pre = leadRes.data.quote?.tierId?._id;
        if (pre) setSelectedTierId(pre);
      } catch (err) {
        console.error('Error loading session:', err);
        alert('Could not load your session. Please try again.');
      }
    };

    load();
  }, [token]);

  useEffect(() => {
    if (!selectedTierId) {
      setSelectedTier(null);
      setSelectedDishes({});
      setSelectedAddOns([]);
      return;
    }

    const tier = tiers.find(t => t._id === selectedTierId);
    setSelectedTier(tier);

    const initial = {};
    tier.categories.forEach(c => {
      const prev = lead?.quote?.selectedDishes?.find(x => x.category === c.category);
      initial[c.category] = prev
        ? prev.dishIds.map(d => (typeof d === 'string' ? d : d._id))
        : [];
    });
    setSelectedDishes(initial);

    const prevAddOns = lead?.quote?.selectedAddOns || [];
    setSelectedAddOns(prevAddOns);
  }, [selectedTierId, tiers, lead]);

  const handleCheckbox = (category, dishId) => {
    const current = selectedDishes[category] || [];
    const isChecked = current.includes(dishId);
    const limit = selectedTier.categories.find(c => c.category === category)?.maxSelectable || Infinity;

    if (!isChecked && current.length >= limit) return;

    setSelectedDishes(prev => ({
      ...prev,
      [category]: isChecked
        ? prev[category].filter(id => id !== dishId)
        : [...prev[category], dishId]
    }));
  };

  const handleAddOnToggle = (dish) => {
    const exists = selectedAddOns.find(d => d.dishId === dish._id);
    if (exists) {
      setSelectedAddOns(prev => prev.filter(d => d.dishId !== dish._id));
    } else {
      setSelectedAddOns(prev => [...prev, { dishId: dish._id, unit: dish.unit }]);
    }
  };

  const calculateTotal = () => {
    if (!selectedTier) return 0;
    const guests = lead?.numberOfGuests || 0;
    let base = selectedTier.pricePerPlate * guests;

    for (const item of selectedAddOns) {
      const dish = selectedTier.categories
        .flatMap(c => c.dishIds)
        .find(d => d._id === item.dishId);
      if (!dish) continue;
      if (item.unit === 'per guest') {
        base += dish.price * guests;
      } else {
        base += dish.price;
      }
    }

    return base;
  };

  const handleSubmit = async () => {
    const formatted = Object.entries(selectedDishes).map(([cat, ids]) => ({
      category: cat,
      dishIds: ids
    }));

    try {
      const res = await API.post('/quotesNew', {
        tierId: selectedTierId,
        selectedDishes: formatted,
        selectedAddOns,
        updatedBy: 'lead'
      });
      await API.patch(`/leads/${lead._id}/attach-quote`, { quoteId: res.data._id });
      alert('✅ Your menu selection has been saved!');
    } catch (err) {
      console.error('Submit error:', err);
      alert('❌ Failed to save. Please try again.');
    }
  };

  if (!lead) return <div>Loading your session…</div>;

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
            <div
              key={cat.category}
              style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}
            >
              <h4>{cat.category} {cat.maxSelectable ? `(max ${cat.maxSelectable})` : '(Flexible Add-ons)'}</h4>
              {cat.dishIds.map(dish => (
                <label key={dish._id} style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={
                      cat.maxSelectable
                        ? selectedDishes[cat.category]?.includes(dish._id)
                        : selectedAddOns.some(d => d.dishId === dish._id)
                    }
                    onChange={() =>
                      cat.maxSelectable
                        ? handleCheckbox(cat.category, dish._id)
                        : handleAddOnToggle(dish)
                    }
                  />
                  {dish.name}
                  {!cat.maxSelectable && ` — ₹${dish.price} (${dish.unit})`}
                </label>
              ))}
            </div>
          ))}
          <p><strong>Total Price:</strong> ₹{calculateTotal()}</p>
          <button onClick={handleSubmit}>Submit My Selection</button>
        </div>
      )}
    </div>
  );
};

export default QuoteSession;
