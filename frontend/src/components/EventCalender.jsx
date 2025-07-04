import React from "react";
import "../styles/calenderr.css"; // Create this file for calendar-specific styles

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

const EventCalendar = ({ year, month, leads = [], converted = [] }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // Convert event arrays to sets for fast lookup
  const leadSet = new Set(leads.map(d => d.getDate()));
  const convertedSet = new Set(converted.map(d => d.getDate()));

  // Build calendar grid
  const boxes = [];
  for (let i = 0; i < firstDay; i++) boxes.push(null);
  for (let d = 1; d <= daysInMonth; d++) boxes.push(d);

  // Pad to full weeks
  while (boxes.length % 7 !== 0) boxes.push(null);

  return (
    <div className="event-calendar">
      <div className="ec-header">
        <span>{new Date(year, month).toLocaleString("default", { month: "long" })} {year}</span>
      </div>
      <div className="ec-days-row">
        {daysOfWeek.map(d => <div key={d} className="ec-day">{d}</div>)}
      </div>
      <div className="ec-grid">
        {boxes.map((d, i) => (
          <div key={i} className="ec-cell">
            {d && (
              <>
                <span className="ec-date">{d}</span>
                <div className="ec-dots">
                  {leadSet.has(d) && <span className="ec-dot lead"></span>}
                  {convertedSet.has(d) && <span className="ec-dot converted"></span>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;