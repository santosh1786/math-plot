// frontend/src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
<nav>
    <ul className="flex space-x-4"> {/* Add flex and spacing */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/plotter">Plotter</Link></li>
    </ul>
</nav>

  );
};

export default Navigation;
