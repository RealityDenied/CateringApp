import React, { useState } from 'react';
import axios from 'axios';
import '../styles/newquotedetails.css';
import { API } from '../utils/api';


const QuoteDetails = ({ quote, lead }) => {
  const guests = lead?.numberOfGuests || 0;
  const tier = quote?.tierId;

  const [newDish, setNewDish] = useState({ name: '', price: '', unit: 'per guest' });

  const handleAddCustomDish = async () => {
    if (!newDish.name || !newDish.price) return;

    try {
      // Step 1: Create the dish in the database
      const dishResponse = await axios.post('/api/dishes', {
        name: newDish.name,
        price: Number(newDish.price),
        category: ''
      });

      const dish = dishResponse.data;

      // Step 2: Attach this dish to the quote as an add-on
      await axios.patch(`/api/quotesNew/${quote._id}/add-addon`, {
        dishId: dish._id,
        unit: newDish.unit
      });

      // Step 3: Update local quote object to reflect change immediately
      quote.selectedAddOns = quote.selectedAddOns || [];
      quote.selectedAddOns.push({
        dishId: dish,
        unit: newDish.unit
      });

      // Reset input
      setNewDish({ name: '', price: '', unit: 'per guest' });
    } catch (error) {
      console.error('Error adding custom dish to quote:', error);
    }
  };

  const calculateAddOnSubtotal = (dish, unit) => {
    const price = dish?.price || 0;
    return unit === 'per guest' ? price * guests : price;
  };

  const total =
    ((tier?.pricePerPlate || 0) * guests) +
    (quote.selectedAddOns || []).reduce(
      (sum, add) => sum + calculateAddOnSubtotal(add.dishId, add.unit),
      0
    );

  return (
    <div className="quote-details">
      <div className="upquote-details">
        <div className="quote-tier-header">
          <div className="tier-title-row">
            <div className="line"></div>
            <div className="tier-combined-text">
              {tier?.name?.toUpperCase() || 'UNTITLED'} <span className="tier-label">TIER</span>
            </div>
            <div className="line"></div>
          </div>

          <div className="tier-info-box">
            <div className="info-block">
              <div className="info-label">Per Plate</div>
              <div className="info-value"><div className="info-icon">🧑‍🍳</div>₹{tier?.pricePerPlate || 0}</div>
            </div>
            <div className="tier-center-icon">🍽️</div>
            <div className="info-block">
              <div className="info-label">Guests</div>
              <div className="info-value"><div className="info-icon">👥</div>{guests}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="midquote-details">
        {(quote.selectedDishes || []).map((group, idx) => (
          <div key={idx} className="quote-category">
            <div className="category-title">{group.category}</div>
            <ul className="dish-list">
              {(group.dishIds || []).map(dish => (
                <li key={dish._id} className="dish-selected">{dish.name}</li>
              ))}
            </ul>
          </div>
        ))}

        {(quote.selectedAddOns || []).length > 0 && (
          <div className="quote-addons">
            <div className="category-title">Add-Ons</div>
            <ul>
              {quote.selectedAddOns.map((add, i) => {
                const subtotal = calculateAddOnSubtotal(add.dishId, add.unit);
                return (
                  <li key={i}>
                    ➕ {add.dishId?.name} — ₹{add.dishId?.price} ({add.unit}) = ₹{subtotal}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {(quote.additionalRequests || []).length > 0 && (
          <div className="quote-extra">
            <div>🍽 Additional Requests:</div>
            <ul>
              {quote.additionalRequests.map((req, i) => (
                <li key={i}>📝 {req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="quote-custom-input">
          <h4>Add Custom Dish</h4>
          <input
            type="text"
            placeholder="Dish Name"
            value={newDish.name}
            onChange={e => setNewDish({ ...newDish, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newDish.price}
            onChange={e => setNewDish({ ...newDish, price: e.target.value })}
          />
          <select
            value={newDish.unit}
            onChange={e => setNewDish({ ...newDish, unit: e.target.value })}
          >
            <option value="per guest">Per Guest</option>
            <option value="fixed">Fixed</option>
          </select>
          <button onClick={handleAddCustomDish}>Add</button>
        </div>
      </div>

      <div className="downquote-details">
        <strong>TOTAL :</strong> ₹{total}
        <a
        href="#"
        className="copy-quote-link"
        onClick={async (e) => {
          e.preventDefault();
          try {
            const configRes = await API.get('/config');
            const clientUrl = configRes.data.CLIENT_URL;
            const url = `${clientUrl}/quote-editor/${lead?.sessionToken}`;
            await navigator.clipboard.writeText(url);
            alert('📋 Quote session link copied to clipboard!');
          } catch (error) {
            console.error('Error fetching config:', error);
            const fallbackUrl = `${window.location.origin}/quote-editor/${lead?.sessionToken}`;
            await navigator.clipboard.writeText(fallbackUrl);
            alert('📋 Quote session link copied to clipboard!');
          }
        }}
      >
        Copy Quote
      </a>

      </div>
    </div>
  );
};

export default QuoteDetails;
