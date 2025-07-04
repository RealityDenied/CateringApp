// ChatWindow.jsx
import { useEffect, useState } from 'react';
import ChatProfile from './ChatProfile';
import QuoteBubble from '../components/QuoteBubble';
import { useSelectedLead } from '../context/SelectedLeadContext';
import '../styles/chatwindow.css';

function ChatWindow() {
  const { selectedLead } = useSelectedLead();
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (!selectedLead?._id) return;

    const fetchQuote = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/quotes/${selectedLead._id}`);
        const data = await res.json();
        setQuote(data);
      } catch (err) {
        console.error('Failed to fetch quote:', err);
      }
    };

    fetchQuote();
  }, [selectedLead]);

  return (
    <div className="chat-box">
      <ChatProfile />
      <div className="chat-messages">
        {quote ? (
          <QuoteBubble quote={quote} lead={selectedLead} />
        ) : (
          <p style={{ padding: '20px', color: '#666' }}>
            No quote available for this lead yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
