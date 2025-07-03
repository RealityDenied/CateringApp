// ChatWindow.jsx
import ChatProfile from './ChatProfile';
import '../styles/chatwindow.css';

function ChatWindow() {
  return (
    <div className="chat-box">
      <ChatProfile />
      {/* Rest of chat messages below */}
    </div>
  );
}

export default ChatWindow;
