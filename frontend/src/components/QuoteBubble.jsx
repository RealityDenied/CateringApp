import React from 'react';
import QuoteDetails from './QuoteDetails';
import '../styles/quotebubble.css';

const QuoteBubble = ({ quote, lead }) => {
  const isChef = quote.updatedBy === 'chef'; // corrected from lastEditedBy

  return (
    <div className={`quote-bubble ${isChef ? 'right' : 'left'}`}>
      <QuoteDetails quote={quote} lead={lead} />
      <div className="quote-meta">
        Edited by {quote.updatedBy || 'unknown'} on {new Date(quote.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default QuoteBubble;
