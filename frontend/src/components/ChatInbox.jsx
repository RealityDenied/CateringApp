import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelectedLead } from '../context/SelectedLeadContext';

const Inbox = () => {
  const [leads, setLeads] = useState([]);
  const { setSelectedLead } = useSelectedLead();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/leads');
        setLeads(res.data);
      } catch (err) {
        console.error('Failed to fetch leads:', err);
      }
    };

    fetchLeads();
  }, []);

  const getEventIcon = (eventType) => {
    if (eventType === 'Birthday') return '/icons/birthday.png';
    if (eventType === 'Wedding/Marriage') return '/icons/wedding.png';
    if (eventType === 'Corporate Event') return '/icons/corporate.png';
    return '/icons/other.png';
  };

  const getDaysAgo = (timestamp) => {
  const createdDate = new Date(timestamp);
  const today = new Date();

  // Get difference in milliseconds and convert to full days
  const diffTime = today - createdDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 0 ? "Today" : `${diffDays}d`;
};


  return (
    <div className="inbox-inside">
          <div className="inbox-header">
      {/* Row 1: Title + Search */}
      <div className="inbox-header-top">
        <span className="inbox-title">INBOX</span>
        <div className="inbox-search">
          <input type="text" placeholder="Search Manas Raj" className="search-input" />
          <img src="/icons/loupe.png" alt="search" className="search-icon" />
        </div>
      </div>

      {/* Row 2: Status Filter */}
      <div className="inbox-header-middle">
        <button className="status-filter active">All</button>
        <button className="status-filter">Confirmed</button>
        <button className="status-filter">Pending</button>
        <button className="status-filter">Expired</button>
      </div>

      {/* Row 3: Sort + Event Filter */}
      <div className="inbox-header-bottom">
        <span className="sort-label">Sort by:</span>
        <button className="sort-button">Event Date</button>
        <button className="sort-button">Last Updated</button>

        <button className="event-type-icon">
          <img src="/icons/birthday.png" alt="birthday" />
        </button>
        <button className="event-type-icon">
          <img src="/icons/corporate.png" alt="corporate" />
        </button>
        <button className="event-type-icon">
          <img src="/icons/wedding.png" alt="wedding" />
        </button>
      </div>
    </div>


      <div className="inbox-body">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="inbox-item"
            onClick={() => setSelectedLead(lead)}
          >
            <div className="left-inbox-item">
              {lead.name?.charAt(0).toUpperCase()}
            </div>

            <div className="right-inbox-item">
              <div className="up-inbox-item">
                <div className="inbox-name-status">
                  <span className="lead-name">{lead.name}</span>
                  <span className="lead-status pending">Pending</span>
                </div>
                <div className="lead-days">
                  {getDaysAgo(lead.createdAt)}
                </div>

              </div>

              <div className="down-inbox-item">
                <img src={getEventIcon(lead.eventType)} alt="" className="event-icon" />
                <span className="event-type">
                  {lead.eventType === "Wedding/Marriage"
                    ? "Wedding"
                    : lead.eventType === "Corporate Event"
                    ? "Corporate"
                    : lead.eventType}
                </span>

                <span className="event-date">
                  <img src="/icons/calendar.png" alt="" className="event-icon" />
                  {new Date(lead.eventDate).toLocaleDateString("en-GB", {
                    day: '2-digit',
                    month: 'short'
                  })}
                </span>

                <span className="event-location">
                  <img src="/icons/location.png" alt="" className="event-icon" />
                  {lead.location}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
