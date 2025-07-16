import ChatInbox from '../components/ChatInbox';
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
