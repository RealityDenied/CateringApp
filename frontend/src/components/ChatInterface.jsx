import { useEffect, useState } from 'react';
import ChatProfile from './ChatProfile';
import { useSelectedLead } from '../context/SelectedLeadContext';
import { API } from '../utils/api';
import '../styles/chatwindow.css';

function ChatInterface() {
  const { selectedLead } = useSelectedLead();
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
        
        setIsOnline(true);
        
        if (newMessages.length > 0) {
          const latestMessageTime = new Date(newMessages[newMessages.length - 1].timestamp).getTime();
          
          if (!lastMessageTime || latestMessageTime > lastMessageTime) {
            setMessages(newMessages);
            setLastMessageTime(latestMessageTime);
          }
        } else if (messages.length > 0) {
          setMessages([]);
          setLastMessageTime(null);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsOnline(false);
      }
    };

    fetchMessages();
    const pollInterval = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollInterval);
  }, [selectedLead, lastMessageTime, messages.length]);

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
      await API.post('/messages/send', payload);
      const newMessage = { ...payload, timestamp: new Date() };
      setMessages(prev => [...prev, newMessage]);
      setLastMessageTime(new Date().getTime());
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (!selectedLead) {
    return (
      <div className="chat-box">
        <div className="no-lead-selected">
          <p>Select a lead to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-box">
      <ChatProfile />

      <div className="chat-body">
        <div className="chat-right chat-interface-only">
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

export default ChatInterface;
