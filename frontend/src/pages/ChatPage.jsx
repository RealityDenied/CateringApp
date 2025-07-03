import ChatInbox from '../components/Chatinbox';
import ChatWindow from '../components/ChatWindow';
import '../styles/chat.css';

const ChatPage = () => {
  return (
    <div className="chat-container">
      <ChatInbox />
      <ChatWindow />
    </div>
  );
};

export default ChatPage;
