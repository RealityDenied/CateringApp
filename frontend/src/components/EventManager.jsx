import EventCalendar from '../components/EventCalendernew';

const EventManager = () => {
  const handleDateClick = (day, month, year) => {
    console.log(`Selected date: ${day}/${month + 1}/${year}`);
  };

  return (
    <div className="eventbox">
      <EventCalendar onClick={handleDateClick} />
    </div>
  );
};

export default EventManager;
