const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get general student dashboard data (course, notices, important dates)
router.get('/dashboard/:studentId', async (req, res) => {
    console.log('Request received:', req.params);
    const studentId = req.params.studentId;

    // SQL queries to get the necessary data
    const courseQuery = `
        SELECT C.course_name 
        FROM Courses C 
        JOIN Students S ON C.course_id = S.course_id 
        WHERE S.student_id = ?`;

    const noticesQuery = 'SELECT * FROM Notices';
    const datesQuery = 'SELECT * FROM ImportantDates';

    try {
        // Fetch course data
        const [courseResult] = await db.query(courseQuery, [studentId]);

        if (courseResult.length === 0) {
            return res.status(404).json({ message: 'Course not found for the specified student.' });
        }

        // Fetch notices
        const [noticesResult] = await db.query(noticesQuery);

        // Fetch important dates
        const [datesResult] = await db.query(datesQuery);

        // Send all data as one response
        res.status(200).json({
            course: courseResult[0]?.course_name || '',
            notices: noticesResult,
            importantDates: datesResult
        });
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch subjects for a given semester
router.get('/:studentId/subjects', async (req, res) => {
    const studentId = req.params.studentId;
    const selectedSemester = req.query.semester;

    if (!selectedSemester) {
        return res.status(400).json({ message: 'Semester not provided' });
    }

    const subjectsQuery = `
        SELECT * 
        FROM Subjects 
        WHERE course_id = (SELECT course_id FROM Students WHERE student_id = ?) 
        AND semester = ?`;

    try {
        const [subjectsResult] = await db.query(subjectsQuery, [studentId, selectedSemester]);

        if (subjectsResult.length === 0) {
            return res.status(404).json({ message: 'No subjects found for the selected semester' });
        }

        res.status(200).json({ subjects: subjectsResult });
    } catch (err) {
        console.error('Error fetching subjects:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get attendance for a specific subject
router.get('/:studentId/attendance/:subjectId', async (req, res) => {
    const { studentId, subjectId } = req.params;

    const attendanceQuery = `
        SELECT no_present, tot_no_class 
        FROM Attendance 
        WHERE student_id = ? AND subject_id = ?`;

    try {
        const [results] = await db.query(attendanceQuery, [studentId, subjectId]);

        if (results.length > 0) {
            return res.status(200).json(results[0]); // Assuming one record per student-subject
        } else {
            return res.status(404).json({ message: 'No attendance records found' });
        }
    } catch (err) {
        console.error('Error fetching attendance records:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get grades for a specific subject
router.get('/:studentId/grades/:subjectId', async (req, res) => {
    const studentId = req.params.studentId;
    const subjectId = req.params.subjectId;

    const query = `
        SELECT grade 
        FROM Grades 
        WHERE student_id = ? AND subject_id = ?`;

    try {
        const [result] = await db.query(query, [studentId, subjectId]);

        res.status(200).json({ grade: result[0]?.grade || null });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching grades' });
    }
});

// Get assignments for a specific subject
router.get('/:studentId/subjects/:subjectId/assignments', async (req, res) => {
    const { studentId, subjectId } = req.params;

    const assignmentsQuery = `
        SELECT assignment_id, assignment_details, due_date 
        FROM Assignments 
        WHERE subject_id = ?`;

    try {
        const [results] = await db.query(assignmentsQuery, [subjectId]);

        if (results.length > 0) {
            res.status(200).json({ assignments: results });
        } else {
            res.status(404).json({ message: 'No assignments found for this subject' });
        }
    } catch (err) {
        console.error('Error fetching assignments:', err);
        res.status(500).json({ message: 'Error fetching assignments' });
    }
});

// Get study resources for a specific subject
router.get('/:studentId/subjects/:subjectId/resources', async (req, res) => {
    const studentId = req.params.studentId;
    const subjectId = req.params.subjectId;

    const query = `
        SELECT resource_link 
        FROM Resources 
        WHERE subject_id = ?`;

    try {
        const [result] = await db.query(query, [subjectId]);

        res.status(200).json({ resources: result });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching resources' });
    }
});

// Submit leave request
router.post('/:studentId/apply-leave', async (req, res) => {
    const studentId = req.params.studentId;
    const { leaveRequest } = req.body;

    const query = `INSERT INTO LeaveRequests (student_id, leave_dates) VALUES (?, ?)`;

    try {
        await db.query(query, [studentId, leaveRequest]);

        res.status(200).json({ message: 'Leave request submitted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting leave request' });
    }
});

module.exports = router;

// Route to fetch personal details of a student
router.get('/:studentId/details', async (req, res) => {
    const studentId = req.params.studentId;

    const query = `
        SELECT name, department, current_semester, email, contact_number, accommodation_status 
        FROM Students 
        WHERE student_id = ?`;

    try {
        const [result] = await db.query(query, [studentId]);

        if (result.length > 0) {
            res.status(200).json(result[0]); // Send the student's details
        } else {
            res.status(404).json({ message: 'Student details not found' });
        }
    } catch (err) {
        console.error('Error fetching student details:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Route to fetch all notices
router.get('/notices', async (req, res) => {
    const query = `
        SELECT notice_id, posted_by, notice_content, date_posted 
        FROM Notices 
        ORDER BY date_posted DESC`;

    try {
        const [result] = await db.query(query);

        if (result.length > 0) {
            res.status(200).json(result); // Send all the notices
        } else {
            res.status(404).json({ message: 'No notices found' });
        }
    } catch (err) {
        console.error('Error fetching notices:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Route to fetch important dates
router.get('/important-dates', async (req, res) => {
    const query = `
        SELECT id, title, date, description 
        FROM ImportantDates 
        ORDER BY date ASC`;

    try {
        const [result] = await db.query(query);

        if (result.length > 0) {
            res.status(200).json(result); // Send all the important dates
        } else {
            res.status(404).json({ message: 'No important dates found' });
        }
    } catch (err) {
        console.error('Error fetching important dates:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
