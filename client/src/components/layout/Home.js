import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './home.css';

const Home = () => {
  const { authenticated, role } = useContext(AuthContext);

  // Redirect if already logged in
  if (authenticated) {
    if (role === 'student') {
      return <Navigate to="/student/dashboard" />;
    } else if (role === 'teacher') {
      return <Navigate to="/teacher/dashboard" />;
    }
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Student Attendance Management System</h1>
        <p className="lead">
          A comprehensive platform for tracking and managing student attendance
        </p>
        
        <div className="features">
          <div className="feature-card">
            <h3>For Students</h3>
            <ul>
              <li>View your attendance across all courses</li>
              <li>Track attendance percentage in real-time</li>
              <li>Get alerts for low attendance</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <h3>For Teachers</h3>
            <ul>
              <li>Mark attendance for multiple classes</li>
              <li>View detailed reports by student and course</li>
              <li>Quick attendance management tools</li>
            </ul>
          </div>
        </div>
        
        <div className="cta-buttons">
          <Link to="/login" className="btn btn-primary">
            Login Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
