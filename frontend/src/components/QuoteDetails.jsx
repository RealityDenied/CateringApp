import React from 'react';
import '../styles/quotedetails.css';

const QuoteDetails = ({ quote, lead }) => {
  const guests = lead?.numberOfGuests || 0;
  const tier = quote?.tierId;

  // Calculate add-on total
  let addOnTotal = 0;

  return (
    <div className="quote-details">
      <div className="quote-tier">
        🎖 Tier: <strong>{tier?.name || 'Untitled Tier'}</strong> — ₹{tier?.pricePerPlate || 0} per plate
      </div>
      <div className="quote-guests">
        👥 Guests: <strong>{guests}</strong>
      </div>

      {(quote.selectedDishes || []).map((group, idx) => (
        <div key={idx} className="quote-category">
          <div className="category-title">{group.category}</div>
          <ul className="dish-list">
            {(group.dishIds || []).map(dish => (
              <li key={dish._id} className="dish-selected">
                ✅ {dish.name}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {(quote.selectedAddOns || []).length > 0 && (
        <div className="quote-addons">
          <div>🧾 Add-ons:</div>
          <ul>
            {quote.selectedAddOns.map((add, i) => {
              const price = add.dishId?.price || 0;
              const unit = add.unit;
              const name = add.dishId?.name || 'Unnamed Dish';

              const subtotal = unit === 'per guest' ? price * guests : price;
              addOnTotal += subtotal;

              return (
                <li key={i}>
                  ➕ {name} — ₹{price} ({unit}) = ₹{subtotal}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="quote-total">
        💰 <strong>Total:</strong> ₹
        {((tier?.pricePerPlate || 0) * guests) + addOnTotal}
      </div>

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
    </div>
  );
};

export default QuoteDetails;
