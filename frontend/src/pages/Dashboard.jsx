import '../styles/dashboard.css';
import ChatInbox from '../components/Chatinbox.jsx'
import ChatWindow from '../components/ChatWindow';

import EventCalendar from '../components/EventCalender';
import EventManager from '../components/EventManager.jsx'; 






const leads = [new Date(2025, 7, 2), new Date(2025, 7, 5)];
const converted = [new Date(2025, 7, 2), new Date(2025, 7, 7)];

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
         {/* <div className="eventbox"><EventCalendar year={2025} month={7} leads={leads} converted={converted} /></div>  */}
         <div><EventManager /></div>
       
      </div>
    </div>
  );
};

export default Dashboard;
