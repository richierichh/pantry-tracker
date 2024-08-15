'use client';
import React from 'react';
import { useAuth } from './contexts/authcontexts'; // Ensure the correct path
import Navbar from './components/navbar'; // Ensure the correct path

const Home = () => {
  return (
    <div>
      <Navbar />
      <h1>Welcome to the Home Page</h1>
      {/* Other content */}
    </div>
  );
};

export default Home;
