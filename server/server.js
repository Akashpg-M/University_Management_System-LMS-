const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Database connection
const studentRoutes = require('./controller/student');
const teacherRoutes = require('./controller/teacher');
const adminRoutes = require('./controller/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

// Login Route
app.post('/api/login', async (req, res) => {
    const { mailid, password, role } = req.body;
    console.log("Login request received: mailid:", mailid, "password:", password, "role:", role);

    let query;
    let idField; // Field name for ID
    let nameField = 'name'; // Field name for the name

    if (role === 'student') {
        query = 'SELECT * FROM StudentCredentials WHERE mail_id = ? AND password = ?';
        idField = 'student_id';
    } else if (role === 'teacher') {
        query = 'SELECT * FROM StaffCredentials WHERE mail_id = ? AND password = ?';
        idField = 'staff_id';
    } else if (role === 'admin') {
        query = 'SELECT * FROM AdminCredentials WHERE mail_id = ? AND password = ?';
        idField = 'admin_id';
    } else {
        return res.status(400).json({ message: 'Invalid role selected' });
    }

    try {
        const [results] = await db.query(query, [mailid, password]); // Fixed destructuring

        if (results.length > 0) {
            const userId = results[0][idField]; // Get user ID based on role

            // Fetch name and additional data based on the role
            let nameQuery;
            if (role === 'student') {
                nameQuery = 'SELECT name, student_id FROM Students WHERE student_id = ?';
            } else if (role === 'teacher') {
                nameQuery = 'SELECT name, teacher_id FROM Teachers WHERE teacher_id = ?';
            } else if (role === 'admin') {
                nameQuery = 'SELECT name, admin_id FROM AdminCredentials WHERE admin_id = ?';
            }

            const [nameResults] = await db.query(nameQuery, [userId]); // Fixed destructuring

            if (nameResults.length > 0) {
                const userName = nameResults[0][nameField]; // Get user's name

                // Return appropriate data based on the role
                if (role === 'student') {
                    const studentId = nameResults[0]['student_id'];
                    return res.status(200).json({
                        message: 'Login successful',
                        studentId,
                        userName
                    });
                }

                if (role === 'teacher') {
                    const teacherId = nameResults[0]['teacher_id'];
                    return res.status(200).json({
                        message: 'Login successful',
                        teacherId,
                        userName
                    });
                }

                if (role === 'admin') {
                    const adminId = nameResults[0]['admin_id'];
                    return res.status(200).json({
                        message: 'Login successful',
                        adminId,
                        userName
                    });
                }
            } else {
                return res.status(404).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found` });
            }
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
