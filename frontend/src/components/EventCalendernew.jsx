import React, { useState, useEffect } from 'react';
import '../styles/calender.css';
import AddEventModal from './AddEventModel';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const eventIcons = {
  'Birthday': '/icons/birthday.png',
  'Wedding/Marriage': '/icons/wedding.png',
  'Engagement': '/icons/engagement.png',
  'Corporate Event': '/icons/corporate.png',
  'Others': '/icons/others.png'
};

function EventCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/leads');
    const data = await res.json();
    setEvents(data);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
    setCurrentYear(currentMonth === 0 ? currentYear - 1 : currentYear);
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
    setCurrentYear(currentMonth === 11 ? currentYear + 1 : currentYear);
  };

  const handleTodayClick = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleEventCreated = () => {
    closeModal();
    fetchEvents();
  };

  const hasEvent = (day) => {
    return events.find(ev => {
      const d = new Date(ev.eventDate);
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth &&
        d.getDate() === day
      );
    });
  };

  const blanks = Array.from({ length: firstDay }, (_, i) => (
    <div key={`b-${i}`} className="calendar-day empty" />
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = i + 1;
    const isToday =
      date === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    const matchedEvent = hasEvent(date);
    const icon = matchedEvent ? eventIcons[matchedEvent.eventType] : null;

    return (
  <div
    key={date}
    className={`calendar-day ${isToday ? 'today' : ''}`}
  >
    {icon && <img src={icon} alt="event" className="event-icon-img" />}

    {date}
    {matchedEvent && <span className="event-dot" />}
    
    {matchedEvent && (
  <div className="hover-card">
    <div className="hover-card-name">{matchedEvent.name}</div>
    <div className="hover-card-row">
      <span className="hover-icon">🎯</span>
      <span>{matchedEvent.eventType}</span>
    </div>
    <div className="hover-card-row">
      <span className="hover-icon">📅</span>
      <span>{new Date(matchedEvent.eventDate).toLocaleDateString()}</span>
    </div>
    <div className="hover-card-row">
      <span className="hover-icon">⏰</span>
      <span>{new Date(matchedEvent.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div className="hover-card-row">
      <span className="hover-icon">👥</span>
      <span>{matchedEvent.numberOfGuests} Guests</span>
    </div>
    <div className="hover-card-row">
      <span className="hover-icon">📍</span>
      <span>{matchedEvent.location}</span>
    </div>
    <div className="hover-card-row">
      <span className="hover-icon">📞</span>
      <span>{matchedEvent.contactNumber}</span>
    </div>
  </div>
)}

  </div>
);
  });

  return (
    <div className="calendar-container">
      <div className="calendar-toolbar">
        <div className="calendar-nav">
          <button className="arrow-btn" onClick={handlePrevMonth}>←</button>
          <div className="calendar-header">{monthNames[currentMonth]} {currentYear}</div>
          <button className="arrow-btn" onClick={handleNextMonth}>→</button>
        </div>

        <div className="calendar-actions">
          <button className="today-btn" onClick={handleTodayClick}>Today</button>
          <button className="add-event-btn" onClick={openModal}>+ Add Event</button>
        </div>
      </div>



      <div className="weekdays">
        {daysOfWeek.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {blanks}
        {days}
      </div>

      {showModal && (
        <AddEventModal onClose={closeModal} onEventCreated={handleEventCreated} />
      )}
    </div>
  );
}

export default EventCalendar;
