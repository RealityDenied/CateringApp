import React from 'react';
import '../styles/quotedetails.css';

const QuoteDetails = ({ quote, lead }) => {
  return (
    <div className="quote-details">
      <div className="quote-tier">
        🎖 Tier: <strong>{quote?.tierId?.name || 'Untitled Tier'}</strong>
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
