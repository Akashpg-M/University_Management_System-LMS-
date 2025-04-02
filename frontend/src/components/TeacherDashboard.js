import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Import Axios configuration
import { useLocation } from 'react-router-dom';
// import './teacher.css';
const TeacherDashboard = () => {
    const { state } = useLocation();
    const { teacherId, teacherName } = state || {};
    
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [showSubjectDetails, setShowSubjectDetails] = useState(false);
    const [noticeText, setNoticeText] = useState('');
    const [attendanceEmail, setAttendanceEmail] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState('Present');
    const [resourceText, setResourceText] = useState('');
    const [assignmentText, setAssignmentText] = useState('');
    const [gradeEmail, setGradeEmail] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    
    // Fetch assigned subjects for the teacher
    useEffect(() => {
        const fetchAssignedSubjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/teacher/${teacherId}/assigned-subjects`);
                setAssignedSubjects(response.data.subjects);
            } catch (error) {
                alert('Could not fetch assigned subjects. Please try again later.');
            }
        };
        fetchAssignedSubjects();
    }, [teacherId]);

    const handleSubjectClick = (subjectId) => {
        setSelectedSubjectId(subjectId);
        setShowSubjectDetails(true);
    };

    // Handle posting notices
    const handleNoticeSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/teacher/post-notice', {
                postedBy: teacherName,
                noticeContent: noticeText,
                subject_id: selectedSubjectId,
            });
            alert('Notice posted successfully!');
            setNoticeText('');
        } catch (error) {
            alert('Failed to post notice. Please try again.');
        }
    };

    // Handle attendance submission
    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/teacher/attendance', {
                studentEmail: attendanceEmail,
                status: attendanceStatus,
                subject_id: selectedSubjectId,
            });
            alert('Attendance updated successfully!');
            setAttendanceEmail('');
        } catch (error) {
            alert('Failed to update attendance. Please try again.');
        }
    };

    // Handle resource upload
    const handleResourceSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/teacher/resources', {
                resourceContent: resourceText,
                subject_id:  selectedSubjectId,
            });
            alert('Resource uploaded successfully!');
            setResourceText('');
        } catch (error) {
            alert('Failed to upload resource. Please try again.');
        }
    };

    // Handle assignment upload
    const handleAssignmentSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/teacher/assignments', {
                assignmentDetails: assignmentText,
                subject_id: selectedSubjectId,
            });
            alert('Assignment uploaded successfully!');
            setAssignmentText('');
        } catch (error) {
            alert('Failed to upload assignment. Please try again.');
        }
    };

    
    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        
        console.log("Submitting Grade:", { 
            email: gradeEmail, 
            grade: selectedGrade, 
            subjectId: selectedSubjectId 
        });
    
        if (!gradeEmail || !selectedGrade || !selectedSubjectId) {
            alert("All fields are required!");
            return;
        }
    
        try {
            await axios.post('http://localhost:5000/api/teacher/grades', {
                email: gradeEmail,  
                grade: selectedGrade,
                subjectId: selectedSubjectId,  
            });
            alert('Grade updated successfully!');
            setGradeEmail('');
        } catch (error) {
            console.error("Grade Update Error:", error.response?.data || error);
            alert('Failed to update grade. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ marginRight: '20px', width: '200px' }}>
                <h1>Welcome {teacherName}</h1>
                <h3>Assigned Subjects:</h3>
                {assignedSubjects.map((subject) => (
                    <button key={subject.subject_id} onClick={() => handleSubjectClick(subject.subject_id)}>
                        {subject.subject_name}
                    </button>
                ))}
            </div>
            {showSubjectDetails && (
                <div style={{ marginLeft: '20px' }}>
                    <h3>Manage Subject ID: {selectedSubjectId}</h3>

                    {/* Manage Attendance */}
                    <form onSubmit={handleAttendanceSubmit}>
                        <h4>Manage Attendance:</h4>
                        <input
                            type="email"
                            placeholder="Student Email"
                            value={attendanceEmail}
                            onChange={(e) => setAttendanceEmail(e.target.value)}
                            required
                        />
                        <select
                            value={attendanceStatus}
                            onChange={(e) => setAttendanceStatus(e.target.value)}
                        >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                        <button type="submit">Update Attendance</button>
                    </form>

                    {/* Manage Resources */}
                    <form onSubmit={handleResourceSubmit}>
                        <h4>Manage Resources:</h4>
                        <textarea
                            rows="4"
                            cols="50"
                            placeholder="Add resource content here..."
                            value={resourceText}
                            onChange={(e) => setResourceText(e.target.value)}
                            required
                        />
                        <button type="submit">Upload Resource</button>
                    </form>

                    {/* Manage Assignments */}
                    <form onSubmit={handleAssignmentSubmit}>
                        <h4>Manage Assignments:</h4>
                        <textarea
                            rows="4"
                            cols="50"
                            placeholder="Add assignment details here..."
                            value={assignmentText}
                            onChange={(e) => setAssignmentText(e.target.value)}
                            required
                        />
                        <button type="submit">Upload Assignment</button>
                    </form>

                    {/* Post Notices */}
                    <form onSubmit={handleNoticeSubmit}>
                        <h4>Post Notice:</h4>
                        <textarea
                            rows="4"
                            cols="50"
                            placeholder="Post notice here..."
                            value={noticeText}
                            onChange={(e) => setNoticeText(e.target.value)}
                            required
                        />
                        <button type="submit">Post Notice</button>
                    </form>

                    {/* Manage Grades */}
                    <form onSubmit={handleGradeSubmit}>
                        <h4>Manage Grades:</h4>
                        <input
                            type="email"
                            placeholder="Student Email"
                            value={gradeEmail}
                            onChange={(e) => setGradeEmail(e.target.value)}
                            required
                        />
                        <select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                            <option value="">Select Grade</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                        </select>
                        <button type="submit">Update Grade</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
