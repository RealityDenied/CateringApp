import { useEffect, useState } from 'react';
import ChatProfile from './ChatProfile';
import QuoteBubble from '../components/QuoteBubble';
import { useSelectedLead } from '../context/SelectedLeadContext';
import '../styles/chatwindow.css';

function ChatWindow() {
  const { selectedLead } = useSelectedLead();

  const quote = selectedLead?.quote; // ✅ lead.quote is already populated

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
