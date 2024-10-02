import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Plotter from './components/Plotter';
import { useAuth } from './context/AuthContext';
import Footer from './components/Footer';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route 
              path="/plotter" 
              //element={
                //isAuthenticated ? <Plotter /> : <Navigate to="/login" replace />
              //} 
              element={<Plotter />} 
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
