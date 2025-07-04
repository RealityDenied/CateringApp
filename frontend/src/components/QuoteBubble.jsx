import React from 'react';
import QuoteDetails from './QuoteDetails';
import '../styles/quotebubble.css'; // You can style left/right alignment here

const QuoteBubble = ({ quote, lead }) => {
  const isChef = quote.lastEditedBy === 'chef';

  return (
    <div className={`quote-bubble ${isChef ? 'right' : 'left'}`}>
      <QuoteDetails quote={quote} lead={lead} />
      <div className="quote-meta">
        Edited by {quote.lastEditedBy} on {new Date(quote.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default QuoteBubble;
