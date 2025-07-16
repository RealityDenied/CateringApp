// ChatProfile.jsx
import { useSelectedLead } from '../context/SelectedLeadContext';
import '../styles/chatprofile.css';

function ChatProfile() {
  const { selectedLead } = useSelectedLead();
  if (!selectedLead) return null;

  const {
    name,
    phone,
    eventType,
    numberOfGuests,
    eventDate,
    eventTime,
    location,
  } = selectedLead;

  const formattedDate = new Date(eventDate);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString('default', { month: 'short' });
  
  // Format time to show like "4 PM"
  const formattedTime = new Date(`2000-01-01T${eventTime}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="chat-profile">
      {/* Left Section */}
      <div className="event-core-info">
        <div className="left-event-core-info">
          <div className="event-avatar">{name?.charAt(0)}</div>
        </div>

        <div className="right-event-core-info">
          <div className="event-name-profile">{name}</div>
          <div className="event-details-profile">
            <span className="profile-tag">🎉 {eventType}</span>
            <span className="profile-tag">👥 {numberOfGuests} Guests</span>
            <span className="profile-tag">📞 {phone}</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="event-core-info2">
        <div className="meta-box">
          <img src="/icons/location.png" alt="location" className="location-icon" />
          {location}
        </div>
        <div className="meta-box calendar-box">
          <div className="calendar-icon-container">
            <img src="/icons/calendar.png" alt="calendar" className="calendar-icon" />
            <div className="calendar-date">{day}</div>
          </div>
          <div className="calendar-month">{month}</div>
        </div>
      </div>
    </div>
  );
}

export default ChatProfile;
