import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelectedLead } from '../context/SelectedLeadContext'; // 👈 import the hook

const Inbox = () => {
  const [leads, setLeads] = useState([]);
  const { setSelectedLead } = useSelectedLead(); // 👈 use the context

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

  return (
    <div className="inbox-inside">
      <h3>Inbox</h3>
      {leads.map((lead) => (
        <div
          key={lead._id}
          className="inbox-item"
          onClick={() => setSelectedLead(lead)} // 👈 set lead on click
        >
          <div className="lead-name">{lead.name}</div>
          <div className="lead-event">{lead.eventType}</div>
          <div className="lead-date">{lead.eventDate}</div>
        </div>
      ))}
    </div>
  );
};

export default Inbox;
