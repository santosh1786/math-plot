// frontend/src/App.js
import React from 'react';
import Plotter from './components/Plotter';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';

const App = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <div className="flex-grow flex">
                <Plotter />
            </div>
            <Footer />
        </div>
    );
};

export default App;
