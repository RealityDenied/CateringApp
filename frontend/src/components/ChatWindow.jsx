import { useEffect, useState } from 'react';
import ChatProfile from './ChatProfile';
import QuoteBubble from '../components/QuoteBubble';
import { useSelectedLead } from '../context/SelectedLeadContext';
import { API } from '../utils/api';
import '../styles/chatwindow.css';

function ChatWindow() {
  const { selectedLead } = useSelectedLead();
  const quote = selectedLead?.quote;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (!selectedLead?._id) return;

    const fetchMessages = async () => {
      const res = await API.get(`/messages/lead/${selectedLead._id}`);
      setMessages(res.data);
    };

    fetchMessages();
  }, [selectedLead]);

  //  New useEffect for scrolling to bottom when messages update
useEffect(() => {
  const thread = document.querySelector('.message-thread');
  if (thread) thread.scrollTop = thread.scrollHeight;
}, [messages]);


  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const payload = {
      leadId: selectedLead._id,
      phone: selectedLead.phone,
      sender: 'chef',
      text: inputMessage
    };

    // Send to backend + WhatsApp
    await API.post('/messages/send', payload);

    setMessages(prev => [...prev, { ...payload, timestamp: new Date() }]);
    setInputMessage('');
  };

  return (
        <div className="chat-box">
  <ChatProfile />

  <div className="chat-body">
    <div className="chat-left">
      {quote ? (
          <QuoteBubble quote={quote} lead={selectedLead} />
        ) : (
          <div className="no-quote-box">
            <p>No quote available for this lead.</p>
            <button
              onClick={async () => {
                try {
                  const configRes = await API.get('/config');
                  const clientUrl = configRes.data.CLIENT_URL;
                  const url = `${clientUrl}/quote-editor/${selectedLead?.sessionToken}`;
                  navigator.clipboard.writeText(url);
                  alert('📋 Quote session link copied to clipboard!');
                } catch (error) {
                  console.error('Error fetching config:', error);
                  // Fallback to original behavior
                  const url = `${window.location.origin}/quote-editor/${selectedLead?.sessionToken}`;
                  navigator.clipboard.writeText(url);
                  alert('📋 Quote session link copied to clipboard!');
                }
              }}
            >
              Copy Quote Session
            </button>
          </div>
        )}

    </div>

    <div className="chat-right">
      <div className="message-thread">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.sender === 'chef' ? 'right' : 'left'}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Type your message…"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  </div>
</div>


  );
}

export default ChatWindow;
