import React, { useState } from 'react';
import '../styles/calender.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function EventCalendar({ onClick }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
  const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  setCurrentMonth(newMonth);
  setCurrentYear(newYear);
};

const handleNextMonth = () => {
  const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  setCurrentMonth(newMonth);
  setCurrentYear(newYear);
};


  const handleTodayClick = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleDateClick = (day) => {
    if (onClick) onClick(day, currentMonth, currentYear);
  };

  const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`b-${i}`} className="calendar-day empty" />);
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = i + 1;
    const isToday =
      date === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    return (
      <div
        key={date}
        className={`calendar-day ${isToday ? 'today' : ''}`}
        onClick={() => handleDateClick(date)}
      >
        {date}
      </div>
    );
  });

  return (
    <div className="calendar-container">
      <div className="calendar-toolbar">
        <button onClick={handlePrevMonth}>←</button>
        <h3>{monthNames[currentMonth]} {currentYear}</h3>
        <button onClick={handleNextMonth}>→</button>
        <button onClick={handleTodayClick}>Today</button>
        <button>+ Add Event</button>
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
    </div>
  );
}

export default EventCalendar;
