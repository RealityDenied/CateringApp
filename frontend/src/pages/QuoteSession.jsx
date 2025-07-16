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

  // Internal CSS styles
  const styles = {
    quoteSessionWrapper: {
      maxWidth: '850px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f7f9fc',
      minHeight: '100vh'
    },
    quoteSessionCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      padding: '25px',
      margin: '0 auto'
    },
    quoteSessionHeader: {
      textAlign: 'center',
      marginBottom: '25px',
      paddingBottom: '15px',
      borderBottom: '2px solid #e6f3f0'
    },
    quoteSessionTitle: {
      color: '#1BAA96',
      fontSize: '24px',
      margin: '0 0 8px 0',
      fontWeight: '600'
    },
    quoteSessionSubtitle: {
      color: '#666',
      fontSize: '16px',
      margin: '0',
      fontWeight: '400'
    },
    quoteSessionTierSelector: {
      marginBottom: '20px'
    },
    quoteSessionTierLabel: {
      display: 'block',
      fontWeight: '600',
      color: '#333',
      marginBottom: '6px',
      fontSize: '14px'
    },
    quoteSessionTierSelect: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'border-color 0.2s ease'
    },
    quoteSessionMenuSection: {
      marginTop: '18px'
    },
    quoteSessionCategoryBox: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #e3e6ea',
      borderRadius: '8px',
      padding: '14px',
      marginBottom: '12px',
      transition: 'box-shadow 0.2s ease'
    },
    quoteSessionCategoryTitle: {
      color: '#1BAA96',
      fontSize: '15px',
      fontWeight: '600',
      margin: '0 0 10px 0',
      paddingBottom: '6px',
      borderBottom: '1px solid #e3e6ea'
    },
    quoteSessionDishItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px 0',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    quoteSessionDishCheckbox: {
      width: '16px',
      height: '16px',
      accentColor: '#1BAA96',
      cursor: 'pointer'
    },
    quoteSessionDishName: {
      flex: '1',
      fontSize: '13px',
      color: '#333'
    },
    quoteSessionDishPrice: {
      fontWeight: '600',
      color: '#1BAA96',
      fontSize: '12px'
    },
    quoteSessionChefAddons: {
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '14px',
      marginBottom: '18px'
    },
    quoteSessionChefAddonsTitle: {
      color: '#e17000',
      fontSize: '14px',
      fontWeight: '600',
      margin: '0 0 10px 0'
    },
    quoteSessionChefAddonsList: {
      listStyle: 'none',
      padding: '0',
      margin: '0'
    },
    quoteSessionChefAddonsItem: {
      padding: '3px 0',
      fontSize: '13px',
      color: '#666'
    },
    quoteSessionTotalSection: {
      background: 'linear-gradient(135deg, #1BAA96 0%, #16947d 100%)',
      color: 'white',
      padding: '18px',
      borderRadius: '8px',
      textAlign: 'center',
      marginTop: '18px'
    },
    quoteSessionTotalPrice: {
      fontSize: '18px',
      fontWeight: '700',
      margin: '0 0 12px 0'
    },
    quoteSessionSubmitBtn: {
      backgroundColor: 'white',
      color: '#1BAA96',
      border: 'none',
      padding: '10px 25px',
      borderRadius: '18px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(255, 255, 255, 0.2)'
    },
    quoteSessionLoading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      fontSize: '16px',
      color: '#666'
    }
  };

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

    // Add price for lead-selected add-ons
    for (const item of selectedAddOns) {
      const dish = selectedTier.categories
        .flatMap(c => c.dishIds)
        .find(d => d._id === item.dishId);
      if (!dish) continue;
      base += item.unit === 'per guest' ? dish.price * guests : dish.price;
    }

    // ✅ Add price for chef-added add-ons
    for (const item of (lead?.quote?.selectedAddOns || [])) {
      const dish = item.dishId;
      if (!dish || !dish.price) continue;
      base += item.unit === 'per guest' ? dish.price * guests : dish.price;
    }

    return base;
  };


  const handleSubmit = async () => {
  if (lead?.quote) {
    alert('🚫 Quote already submitted. Please contact us if you want to make changes.');
    return;
  }

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

  if (!lead) return <div style={styles.quoteSessionLoading}>Loading your session…</div>;

  return (
    <div style={styles.quoteSessionWrapper}>
      <div style={styles.quoteSessionCard}>
        <div style={styles.quoteSessionHeader}>
          <h2 style={styles.quoteSessionTitle}>Hello, {lead.name || lead.phone}</h2>
          <h3 style={styles.quoteSessionSubtitle}>Select your Menu</h3>
        </div>

        <div style={styles.quoteSessionTierSelector}>
          <label style={styles.quoteSessionTierLabel}>Select Tier:</label>
          <select
            style={styles.quoteSessionTierSelect}
            value={selectedTierId}
            onChange={e => setSelectedTierId(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#1BAA96'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          >
            <option value="">-- Select Tier --</option>
            {tiers.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>

        {selectedTier && (
          <div style={styles.quoteSessionMenuSection}>
            {selectedTier.categories.map(cat => (
              <div
                key={cat.category}
                style={styles.quoteSessionCategoryBox}
                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
              >
                <h4 style={styles.quoteSessionCategoryTitle}>
                  {cat.category} {cat.maxSelectable ? `(max ${cat.maxSelectable})` : '(Flexible Add-ons)'}
                </h4>
                {cat.dishIds.map(dish => (
                  <label
                    key={dish._id}
                    style={styles.quoteSessionDishItem}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(27, 170, 150, 0.05)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      style={styles.quoteSessionDishCheckbox}
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
                    <span style={styles.quoteSessionDishName}>{dish.name}</span>
                    {!cat.maxSelectable && (
                      <span style={styles.quoteSessionDishPrice}>₹{dish.price} ({dish.unit})</span>
                    )}
                  </label>
                ))}
              </div>
            ))}

            {(lead?.quote?.selectedAddOns || []).length > 0 && (
              <div style={styles.quoteSessionChefAddons}>
                <h4 style={styles.quoteSessionChefAddonsTitle}>Chef Added Add-Ons</h4>
                <ul style={styles.quoteSessionChefAddonsList}>
                  {lead.quote.selectedAddOns.map((add, i) => (
                    <li key={i} style={styles.quoteSessionChefAddonsItem}>
                      ➕ {add.dishId?.name} — ₹{add.dishId?.price} ({add.unit})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={styles.quoteSessionTotalSection}>
              <p style={styles.quoteSessionTotalPrice}>
                Total Price: ₹{calculateTotal()}
              </p>
              <button
                style={styles.quoteSessionSubmitBtn}
                onClick={handleSubmit}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(255, 255, 255, 0.2)';
                }}
              >
                Submit My Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteSession;
