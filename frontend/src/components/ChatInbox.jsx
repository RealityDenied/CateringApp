import { useEffect, useState, useMemo } from 'react';
import { useSelectedLead } from '../context/SelectedLeadContext';
import { API } from '../utils/api';

const ChatInbox = () => {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Event Date');

  const { setSelectedLead } = useSelectedLead();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await API.get('/leads');
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
    const diffTime = today - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays}d`;
  };

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (statusFilter !== 'All') {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    if (eventFilter !== 'All') {
      result = result.filter((lead) => {
        const type = (lead.eventType || '').trim();
        if (eventFilter === 'Casual') {
          return !['Birthday', 'Wedding/Marriage', 'Corporate Event'].includes(type);
        }
        return type === eventFilter;
      });
    }

    if (searchQuery) {
      result = result.filter((lead) =>
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'Event Date') {
      result.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    } else {
      result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return result;
  }, [leads, statusFilter, eventFilter, sortBy, searchQuery]);

  const eventIcons = [
    { type: 'Birthday', icon: '/icons/birthday.png' },
    { type: 'Corporate Event', icon: '/icons/corporate.png' },
    { type: 'Wedding/Marriage', icon: '/icons/wedding.png' },
  ];

  return (
    <div className="inbox-inside">
      {/* HEADER SECTION */}
      <div className="inbox-header">
        {/* Row 1: Title + Search */}
        <div className="inbox-header-top">
          <span className="inbox-title">INBOX</span>
          <div className="inbox-search">
            <input
              type="text"
              placeholder="Search Name"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src="/icons/loupe.png" alt="search" className="search-icon" />
          </div>
        </div>

        {/* Row 2: Status Filter Buttons */}
        <div className="inbox-header-middle">
          {['All', 'Confirmed', 'Pending', 'Expired'].map((status) => (
            <button
              key={status}
              className={`status-filter ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Row 3: Sort + Event Filters */}
        <div className="inbox-header-bottom">
          <span className="sort-label">Sort by:</span>
          <button
            className={`sort-button ${sortBy === 'Event Date' ? 'active' : ''}`}
            onClick={() => setSortBy('Event Date')}
          >
            Event Date
          </button>
          <button
            className={`sort-button ${sortBy === 'Last Updated' ? 'active' : ''}`}
            onClick={() => setSortBy('Last Updated')}
          >
            Last Updated
          </button>

          {eventIcons.map(({ type, icon }) => (
            <button
              key={type}
              className={`event-type-icon ${eventFilter === type ? 'active' : ''}`}
              onClick={() => setEventFilter((prev) => (prev === type ? 'All' : type))}
            >
              <img src={icon} alt={type} />
            </button>
          ))}
        </div>
      </div>

      {/* BODY: Leads List */}
      <div className="inbox-body">
        {filteredLeads.length === 0 ? (
          <div className="no-leads">No leads found.</div>
        ) : (
          filteredLeads.map((lead) => (
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
                    <span className={`lead-status ${lead.status?.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="lead-days">{getDaysAgo(lead.createdAt)}</div>
                </div>

                <div className="down-inbox-item">
                  <img
                    src={getEventIcon(lead.eventType)}
                    alt=""
                    className="event-icon"
                  />
                  <span className="event-type">
                    {lead.eventType === 'Wedding/Marriage'
                      ? 'Wedding'
                      : lead.eventType === 'Corporate Event'
                      ? 'Corporate'
                      : lead.eventType === 'Birthday'
                      ? 'Birthday'
                      : 'Casual'}
                  </span>

                  <span className="event-date">
                    <img
                      src="/icons/calendar.png"
                      alt=""
                      className="event-icon"
                    />
                    {new Date(lead.eventDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>

                  <span className="event-location">
                    <img
                      src="/icons/location.png"
                      alt=""
                      className="event-icon"
                    />
                    {lead.location}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatInbox;
