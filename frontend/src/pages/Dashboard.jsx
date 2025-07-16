import React, { useState } from 'react';
import '../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';

import ChatInbox from '../components/ChatInbox.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import EventManager from '../components/EventManager.jsx';
import AddEventModal from '../components/AddEventModel.jsx';

const leads = [new Date(2025, 7, 2), new Date(2025, 7, 5)];
const converted = [new Date(2025, 7, 2), new Date(2025, 7, 7)];

const Dashboard = () => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {showAddEvent && <AddEventModal onClose={() => setShowAddEvent(false)} />}

      <div className="left">
        <div className="navbar">
          <button onClick={() => setShowAddEvent(true)}>+ New Booking</button>
          <button onClick={() => {}}>Leads</button>
          <button onClick={() => navigate('/menumodule')}>Menu</button>
          <button onClick={() => alert('🧾 Payments module coming soon')}>Payments</button>
          <button onClick={() => alert('🔍 Search coming soon')}>Search</button>
        </div>

        <div className="chatbar">
          <div className="inbox"><ChatInbox /></div>
          <div className="chatbox"><ChatWindow /></div>
        </div>
      </div>

      <div className="right">
        <div><EventManager /></div>
      </div>
    </div>
  );
};

export default Dashboard;
