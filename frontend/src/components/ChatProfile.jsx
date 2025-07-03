// ChatProfile.jsx
import { useSelectedLead } from '../context/SelectedLeadContext';
import '../styles/chatprofile.css';

function ChatProfile() {
  const { selectedLead } = useSelectedLead();
  if (!selectedLead) return null;

  const { name, eventDate, eventTime, location } = selectedLead;
  const lastMessageDate = "10 July 2025"; // placeholder; update with actual msg timestamp

  return (
    <div className="chat-profile">
      <div className="profile-left">
        <div className="lead-name">{name}</div>
        <div className="last-msg">Last message: {lastMessageDate}</div>
      </div>
      <div className="profile-right">
        <div className="event-detail">{eventDate}</div>
        <div className="event-detail">{eventTime}</div>
        <div className="event-detail">{location}</div>
      </div>
    </div>
  );
}

export default ChatProfile;
