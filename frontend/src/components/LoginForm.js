import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [mailid, setMailid] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role is student
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous errors

        // Validate input fields before sending request
        if (!mailid || !password) {
            setErrorMessage('Email and password are required.');
            return;
        }

        // Optional: Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(mailid)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mailid, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                setErrorMessage('');

                // Navigate to respective dashboard based on role
                if (role === 'student') {
                    navigate('/student-dashboard', { state: { studentId: data.studentId } }); // Pass student ID
                } else if (role === 'teacher') {
                    navigate('/teacher-dashboard', { state: { teacherId: data.teacherId } }); // Pass teacher ID
                } else if (role === 'admin') {
                    navigate('/admin-dashboard');
                }
            } else {
                setErrorMessage(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred. Please check your connection and try again.');
        }
    };

    return (
        
<div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={mailid}
                        onChange={(e) => {
                            setMailid(e.target.value);
                            if (errorMessage) setErrorMessage(''); // Clear error on change
                        }}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errorMessage) setErrorMessage(''); // Clear error on change
                        }}
                        required
                    />
                </div>
                <div>
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
        );
};

export default LoginForm;
