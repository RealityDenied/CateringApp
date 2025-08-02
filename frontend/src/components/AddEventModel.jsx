import React, { useState } from 'react';
import { API } from '../utils/api';
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
      const res = await API.post('/leads', { ...formData, eventDate: fullDate });
      const data = res.data;
      
      setQuoteLink(data.quoteLink);
      if (onEventCreated) onEventCreated();
    } catch (err) {
      console.error('Error creating event:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create event.';
      setError(errorMessage);
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
