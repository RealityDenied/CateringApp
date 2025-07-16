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
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!selectedLead?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/lead/${selectedLead._id}`);
        const newMessages = res.data;
        
        // Update online status
        setIsOnline(true);
        
        // Check if we have new messages
        if (newMessages.length > 0) {
          const latestMessageTime = new Date(newMessages[newMessages.length - 1].timestamp).getTime();
          
          // Only update if we have new messages or this is the first load
          if (!lastMessageTime || latestMessageTime > lastMessageTime) {
            setMessages(newMessages);
            setLastMessageTime(latestMessageTime);
          }
        } else if (messages.length > 0) {
          // If we had messages before but now there are none, clear the messages
          setMessages([]);
          setLastMessageTime(null);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsOnline(false);
      }
    };

    // Initial fetch
    fetchMessages();

    // Set up polling for new messages every 3 seconds
    const pollInterval = setInterval(fetchMessages, 3000);

    // Cleanup interval on unmount or when selectedLead changes
    return () => clearInterval(pollInterval);
  }, [selectedLead, lastMessageTime, messages.length]);

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

    try {
      // Send to backend + WhatsApp
      await API.post('/messages/send', payload);

      // Add the message immediately to the UI
      const newMessage = { ...payload, timestamp: new Date() };
      setMessages(prev => [...prev, newMessage]);
      setLastMessageTime(new Date().getTime());
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
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
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
        {!isOnline && (
          <span style={{ 
            fontSize: '12px', 
            color: '#ff6b6b', 
            marginLeft: '10px',
            display: 'flex',
            alignItems: 'center'
          }}>
            ⚠️ Offline
          </span>
        )}
      </div>
    </div>
  </div>
</div>


  );
}

export default ChatWindow;
