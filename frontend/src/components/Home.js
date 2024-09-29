import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Math Function Plotter</h1>
      <p>This application allows you to plot mathematical functions.</p>
      <Link to="/plotter">Go to Plotter</Link>
    </div>
  );
};

export default Home;