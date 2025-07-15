import React from 'react';
import '../styles/Navbar.css'; // We'll style with Flexbox here
import { useNavigate } from 'react-router-dom';
import AddEventModal from './AddEventModel';

const Navbar = ({ onOpenAddEvent }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <button onClick={onOpenAddEvent}>+ New Booking</button>
      <button onClick={() => navigate('/dashboard')}>Leads</button>
      <button onClick={() => navigate('/menu-module')}>Menu</button>
      <button onClick={() => alert('🧾 Payments module coming soon')}>Payments</button>
      <button onClick={() => alert('🔍 Search coming soon')}>Search</button>
    </div>
  );
};

export default Navbar;
