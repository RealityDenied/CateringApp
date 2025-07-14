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
        <div className="up-downstack">
        <div className="meta-box">⏰ {eventTime}</div>
        <div className="meta-box">📍 <strong>{location}</strong></div>
        </div>
        <div className="meta-box calendar-box">
          📅 <strong>{day}</strong>
          <div className="meta-sub">{month}</div>
        </div>
      </div>
    </div>
  );
}

export default ChatProfile;
