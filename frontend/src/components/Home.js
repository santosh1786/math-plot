import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Math Function Plotter</h1>
      <p className="text-lg mb-4">This application allows you to plot mathematical functions.</p>
      <Link to="/plotter" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Go to Plotter
      </Link>
    </div>
  );
};

export default Home;
