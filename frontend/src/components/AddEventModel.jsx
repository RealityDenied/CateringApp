import React, { useState } from 'react';

import '../styles/addEventModal.css'; 

function AddEventModal({ onClose, onEventCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    contactNumber: '',
    eventType: 'Birthday',
    eventDate: '',
    eventTime: '',
    numberOfGuests: '',
    location: ''
  });

  const [quoteLink, setQuoteLink] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const fullDate = new Date(`${formData.eventDate}T${formData.eventTime}`);
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, eventDate: fullDate })
      });
      const data = await res.json();
      if (res.ok) {
        setQuoteLink(data.quoteLink);
        if (onEventCreated) onEventCreated();
      } else {
        setError(data.error || 'Failed to create event.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add New Event</h2>
        <form onSubmit={handleSubmit} className="event-form">
          <input name="name" placeholder="Name" onChange={handleChange} required />
          <input name="phone" placeholder="Phone (WhatsApp)" onChange={handleChange} required />
          <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />
          <select name="eventType" onChange={handleChange} required>
            <option>Birthday</option>
            <option>Wedding/Marriage</option>
            <option>Engagement</option>
            <option>Corporate Event</option>
            <option>Others</option>
          </select>
          <input name="eventDate" type="date" onChange={handleChange} required />
          <input name="eventTime" type="time" onChange={handleChange} required />
          <input name="numberOfGuests" placeholder="Number of Guests" onChange={handleChange} required />
          <input name="location" placeholder="Location" onChange={handleChange} required />
          {error && <p className="error">{error}</p>}
          <button type="submit" className='add-event-btn-submit'>CREATE</button>
        </form>
        {quoteLink && (
          <div className="quote-link">
            <p>✅ Quote link created:</p>
            <a href={quoteLink} target="_blank" rel="noopener noreferrer">{quoteLink}</a>
          </div>
        )}
        <button onClick={onClose} className="icon-close-btn">
            <img src="/icons/close.png" alt="close" />
        </button>

      </div>
    </div>
  );
}

export default AddEventModal;
