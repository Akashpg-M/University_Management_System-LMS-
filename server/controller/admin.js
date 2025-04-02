const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assume this is where your database connection and queries are handled

// Get all students
router.get('/students', async (req, res) => {
    try {
        const [students] = await db.query('SELECT * FROM Students'); // Fixed destructuring
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Add new student
router.post('/students', async (req, res) => {
    const { name, email, department, semester, contact, accommodation } = req.body;
    try {
        await db.query(
        'INSERT INTO Students (name, email, department, current_semester, contact_number, accommodation_status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, department, semester, contact, accommodation]
        );
        res.status(201).send('Student added');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Get all courses
router.get('/courses', async (req, res) => {
    try {
        const [courses] = await db.query(`
            SELECT c.course_id, c.course_name, COUNT(e.student_id) as enrolled_students
            FROM Courses c
            LEFT JOIN Classes cl ON c.course_id = cl.course_id
            LEFT JOIN ClassEnrollment e ON cl.class_id = e.class_id
            GROUP BY c.course_id;
        `);
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Get all leave requests
router.get('/leave-requests', async (req, res) => {
    try {
        const [leaveRequests] = await db.query(`
            SELECT l.leave_request_id AS id, s.name as student_name, l.status 
            FROM LeaveRequests l 
            JOIN Students s ON l.student_id = s.student_id;
        `);
        res.json(leaveRequests);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Approve leave request
router.post('/leave-requests/approve/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE LeaveRequests SET status = "approved" WHERE leave_request_id = ?', [id]); // Corrected column name to `leave_request_id`
        res.send('Leave request approved');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Reject leave request
router.post('/leave-requests/reject/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE LeaveRequests SET status = "rejected" WHERE leave_request_id = ?', [id]); // Corrected to "rejected" and fixed column name
        res.send('Leave request rejected');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Get important dates
router.get('/important-dates', async (req, res) => {
    try {
        const [importantDates] = await db.query('SELECT * FROM ImportantDates'); // Fixed destructuring
        res.json(importantDates);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Get all notices
router.get('/notices', async (req, res) => {
    try {
        const [notices] = await db.query('SELECT * FROM Notices'); // Fixed destructuring
        res.json(notices);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Search for a teacher by email
router.get('/teachers/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const [teacher] = await db.query(`
            SELECT t.name, t.department, GROUP_CONCAT(s.subject_name) as subjects 
            FROM Teachers t 
            LEFT JOIN TeacherSubjects ts ON t.teacher_id = ts.teacher_id
            LEFT JOIN Subjects s ON ts.subject_id = s.subject_id
            WHERE t.email = ? 
            GROUP BY t.teacher_id;
        `, [email]);

        if (teacher.length === 0) {
            return res.status(404).send('Teacher not found');
        }

        res.json(teacher[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
