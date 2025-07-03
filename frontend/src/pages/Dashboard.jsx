import '../styles/dashboard.css';
import ChatInbox from '../components/Chatinbox.jsx'
import ChatWindow from '../components/ChatWindow';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="left">
        <div className="navbar">+ New Booking | Leads | Menu | Payments | Search</div>
        <div className="chatbar">
            <div className="inbox"><ChatInbox /></div>
            <div className="chatbox"><ChatWindow/></div>
        </div>
        
      </div>

      <div className="right">
        <div className="eventbox">Event Manager</div>
      </div>
    </div>
  );
};

export default Dashboard;
