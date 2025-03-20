const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust the path according to your project structure

// 1. Get Assigned Subjects for a Teacher
router.get('/:teacherId/assigned-subjects', async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
        const [subjects] = await db.query(
            `SELECT s.subject_id, s.subject_name 
             FROM Subjects s 
             JOIN TeacherSubjects ts ON s.subject_id = ts.subject_id 
             WHERE ts.teacher_id = ?`, 
            [teacherId]
        );
        
        if (subjects.length === 0) {
            return res.status(404).json({ message: 'No subjects found for this teacher.' });
        }

        res.json({ subjects });
    } catch (error) {
        console.error('Error fetching assigned subjects:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// 2. Update Attendance for a Student

router.post('/attendance', async (req, res) => {
    const { studentEmail, status, subject_id } = req.body;

    // Log the incoming data
    console.log('Email:', studentEmail, 'Status:', status, 'Subject ID:', subject_id); 

    // Validate incoming data
    if (!studentEmail || !status || !subject_id) {
        return res.status(400).json({ error: 'Email, status, and subjectId are required.' });
    }

    try {
        const [student] = await db.query('SELECT student_id FROM Students WHERE email = ?', [studentEmail]);
        if (student.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const studentId = student[0].student_id;

        // Update attendance based on the status
        if (status === 'Present') {
            await db.query(
                `UPDATE Attendance 
                 SET no_present = no_present + 1, tot_no_class = tot_no_class + 1 
                 WHERE student_id = ? AND subject_id = ?`, 
                [studentId, subject_id]
            );
        } else if (status === 'Absent') {
            await db.query(
                `UPDATE Attendance 
                 SET tot_no_class = tot_no_class + 1 
                 WHERE student_id = ? AND subject_id = ?`, 
                [studentId, subject_id]
            );
        } else {
            return res.status(400).json({ error: 'Invalid status provided' });
        }

        res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// 3. Upload Assignments for a Subject

router.post('/assignments', async (req, res) => {
    console.log('Request Body:', req.body);
    const { assignmentDetails, subject_id } = req.body;
    try {
        await db.query(
            `INSERT INTO Assignments (subject_id, assignment_details) VALUES (?, ?)`, 
            [subject_id, assignmentDetails]
        );
        res.status(201).json({ message: 'Assignment uploaded successfully' });
    } catch (error) {
        console.error('Error uploading assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// 4. Post a Notice for Students

router.post('/post-notice', async (req, res) => {
    const { subject_id, noticeContent } = req.body;
    console.log('Request Body:', req.body);
    try {
        // Insert the notice into the TeacherNotices table
        await db.query(
            'INSERT INTO TeacherNotices (subject_id, notice) VALUES (?, ?)',
            [subject_id, noticeContent]
        );
        res.status(201).json({ message: 'Notice posted successfully.' });
    } catch (error) {
        console.error('Error posting notice:', error);
        res.status(500).json({ error: 'Failed to post notice.' });
    }
});


router.post('/grades', async (req, res) => {
    console.log('Request Body:', req.body);
    const { email, grade, subjectId } = req.body;
    try {
        const [student] = await db.query('SELECT student_id FROM Students WHERE email = ?', [email]);
        if (student.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const studentId = student[0].student_id;

        await db.query(
            `UPDATE Grades SET grade = ? WHERE student_id = ? AND subject_id = ?`, 
            [grade, studentId, subjectId]
        );
        res.status(200).json({ message: 'Grade updated successfully' });
    } catch (error) {
        console.error('Error updating grade:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/resources', async (req, res) => {
    const { resourceContent, subject_id } = req.body;  // Extract the submitted resource and subject ID

    if (!resourceContent || !subject_id) {
        return res.status(400).json({ error: 'Resource content and subject ID are required' });
    }

    try {
        // Insert the resource into the Resources table
        await db.query(
            `INSERT INTO Resources (resource_link, subject_id) VALUES (?, ?)`,
            [resourceContent, subject_id]
        );

        res.status(201).json({ message: 'Resource uploaded successfully' });
    } catch (error) {
        console.error('Error uploading resource:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;


