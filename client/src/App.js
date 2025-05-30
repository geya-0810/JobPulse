// src/App.js
import { useState, React } from "react";
// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import NotFoundPage from './components/common/NotFoundPage';
import Home from './components/common/Home';

import Login from './components/auth/Login';
import Register from './components/auth/Register';

import CampanyProfile from './components/employer/CompanyProfile';
import PostRecruitment from './components/employer/PostRecruitment';
import Application from './components/employer/Application';


import Apply from './components/jobseeker/Applied';
import Resume from './components/jobseeker/Resume';
import Profile from './components/jobseeker/Profile';

import './App.css';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);
  // const [userType, setUserType] = useState(localStorage.getItem('userType') || null);

  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Navbar />

        <div className='maincontent-container'>
          <Routes>
            <Route path="*" element={<NotFoundPage />} /> 

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />

            <Route path="/company-profile" element={<CampanyProfile />} />
            <Route path="/post-recruitment" element={<PostRecruitment />} />
            <Route path="/applications" element={<Application />} />


            <Route path="/apply-job" element={<Apply />} />
            <Route path="/resumes" element={<Resume />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;