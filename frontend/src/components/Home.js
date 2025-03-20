import React from 'react';
import { Link } from 'react-router-dom';
// import '../styles.css'; // Import your CSS for styling

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to the University Management System</h1>
            <p>
                This application allows students, teachers, and admins to manage their respective
                functionalities efficiently.
            </p>
            <div className="home-buttons">
                <Link to="/login">
                    <button className="home-button">Login</button>
                </Link>
                <Link to="/signup">
                    <button className="home-button">Sign Up</button>
                </Link>
            </div>
            <div className="home-description">
                <h3>Features:</h3>
                <ul>
                    <li>View and manage courses and subjects</li>
                    <li>Track attendance and grades</li>
                    <li>Submit assignments and resources</li>
                    <li>Request leaves and check important dates</li>
                </ul>
            </div>
        </div>
    );
};

export default Home;
