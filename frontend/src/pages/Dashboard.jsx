import React, { useState } from 'react';
import '../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';

import ChatInbox from '../components/ChatInbox.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import ChatInterface from '../components/ChatInterface.jsx';
import QuoteBubble from '../components/QuoteBubble.jsx';
import EventManager from '../components/EventManager.jsx';
import AddEventModal from '../components/AddEventModel.jsx';
import { useSelectedLead } from '../context/SelectedLeadContext.jsx';

const leads = [new Date(2025, 7, 2), new Date(2025, 7, 5)];
const converted = [new Date(2025, 7, 2), new Date(2025, 7, 7)];

const Dashboard = () => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const { selectedLead } = useSelectedLead();
  const navigate = useNavigate();

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeSection < 2) {
      setActiveSection(activeSection + 1);
    }
    if (isRightSwipe && activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };

  return (
    <div className="dashboard">
      {showAddEvent && <AddEventModal onClose={() => setShowAddEvent(false)} />}
      {showCalendar && (
        <div className="calendar-modal">
          <div className="calendar-modal-content">
            <button className="calendar-close" onClick={() => setShowCalendar(false)}>×</button>
            <EventManager />
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="desktop-layout">
        <div className="left">
          <div className="navbar">
            <button onClick={() => setShowAddEvent(true)}>+ New Booking</button>
            <button onClick={() => {}}>Leads</button>
            <button onClick={() => navigate('/menumodule')}>Menu</button>
            <button onClick={() => alert(' Payments module coming soon')}>Payments</button>
            <button onClick={() => alert(' Search coming soon')}>Search</button>
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

      {/* Mobile Layout */}
      <div className="mobile-layout">
        <div 
          className="mobile-content"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="mobile-sections" style={{ transform: `translateX(-${activeSection * 100}%)` }}>
            {/* Section 1: Inbox */}
            <div className="mobile-section">
              <ChatInbox />
            </div>
            
            {/* Section 2: Quote Bubble */}
            <div className="mobile-section">
              {selectedLead?.quote ? (
                <QuoteBubble quote={selectedLead.quote} lead={selectedLead} />
              ) : (
                <div className="no-quote">
                  <p>No quote available</p>
                  <p>Select a lead with a quote to view details</p>
                </div>
              )}
            </div>
            
            {/* Section 3: Chat Interface */}
            <div className="mobile-section">
              <ChatInterface />
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="mobile-navbar">
          <button 
            className={activeSection === 0 ? 'active' : ''} 
            onClick={() => setActiveSection(0)}
          >
            <span>📥</span>
            <span>Inbox</span>
          </button>
          <button 
            className={activeSection === 1 ? 'active' : ''} 
            onClick={() => setActiveSection(1)}
          >
            <span>💰</span>
            <span>Quote</span>
          </button>
          <button 
            className={activeSection === 2 ? 'active' : ''} 
            onClick={() => setActiveSection(2)}
          >
            <span>💬</span>
            <span>Chat</span>
          </button>
          <button onClick={() => setShowCalendar(true)}>
            <span>📅</span>
            <span>Calendar</span>
          </button>
          <button onClick={() => setShowAddEvent(true)}>
            <span>➕</span>
            <span>New</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
