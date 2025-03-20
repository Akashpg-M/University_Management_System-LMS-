// import React, { useState, useEffect } from 'react';
// import axios from '../axiosConfig'; // Import the configured Axios instance
// import { useLocation } from 'react-router-dom';

// const TeacherDashboard = () => {
//     const { state } = useLocation();
//     const { teacherId, teacherName } = state||{}; // Destructure teacherId and teacherName from state

//     const [assignedSubjects, setAssignedSubjects] = useState([]); // State for assigned subjects
//     const [attendanceData, setAttendanceData] = useState([]); // State for attendance data
//     const [resources, setResources] = useState([]); // State for resources
//     const [assignments, setAssignments] = useState([]); // State for assignments
//     const [grades, setGrades] = useState([]); // State for grades
//     const [notices, setNotices] = useState([]); // State for notices
//     const [loading, setLoading] = useState(true); // Loading state
//     const [selectedSubjectId, setSelectedSubjectId] = useState(null); // State for selected subject ID
//     const [showSubjectDetails, setShowSubjectDetails] = useState(false); // State for showing subject details
//     const [noticeText, setNoticeText] = useState(''); // State for notice text

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             await fetchAssignedSubjects();
//             setLoading(false);
//         };

//         fetchData(); // Call the fetchData function
//     }, []);

//     const fetchAssignedSubjects = async () => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/teacher/${teacherId}/assigned-subjects`);
//             setAssignedSubjects(response.data.subjects); // Update assigned subjects state
//         } catch (error) {
//             alert('Could not fetch assigned subjects. Please try again later.');
//         }
//     };

//     const handleNoticeSubmit = async (e) => {
//         e.preventDefault(); // Prevent default form submission

//         try {
//             const postedBy = 'Teacher'; // Role of the user posting the notice

//             // Make a POST request to the backend to post the notice
//             await axios.post('http://localhost:5000/api/teacher/notices', {
//                 postedBy, // Role of the user
//                 noticeContent: noticeText, // Notice content
//                 subject_id: selectedSubjectId, // Selected subject ID
//             });

//             alert('Notice posted successfully!'); // Success message
//             setNoticeText(''); // Clear the notice text area
//         } catch (error) {
//             alert('Failed to post notice. Please try again.'); // Error message
//             console.error('Error posting notice:', error); // Log error for debugging
//         }
//     };

//     const fetchAttendance = async (subjectId) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/teacher/${teacherId}/attendance/${subjectId}`);
//             setAttendanceData(response.data); // Update attendance data state
//         } catch (error) {
//             alert('Could not fetch attendance data. Please try again later.');
//         }
//     };

//     const fetchResources = async (subjectId) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/teacher/${teacherId}/resources/${subjectId}`);
//             setResources(response.data); // Update resources state
//         } catch (error) {
//             alert('Could not fetch resources. Please try again later.');
//         }
//     };

//     const fetchAssignments = async (subjectId) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/teacher/${teacherId}/assignments/${subjectId}`);
//             setAssignments(response.data); // Update assignments state
//         } catch (error) {
//             alert('Could not fetch assignments. Please try again later.');
//         }
//     };

//     const fetchGrades = async (subjectId) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/teacher/${teacherId}/grades/${subjectId}`);
//             setGrades(response.data); // Update grades state
//         } catch (error) {
//             alert('Could not fetch grades. Please try again later.');
//         }
//     };

//     const handleSubjectClick = (subjectId) => {
//         setSelectedSubjectId(subjectId); // Set selected subject ID
//         fetchAttendance(subjectId);
//         fetchResources(subjectId);
//         fetchAssignments(subjectId);
//         fetchGrades(subjectId);
//         setShowSubjectDetails(true); // Show subject details
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'row' }}>
//             <div style={{ marginRight: '20px', width: '200px' }}>
//                 <h1>Welcome {teacherName}</h1>

//                 <h3>Assigned Subjects:</h3>
//                 {assignedSubjects.map((subject) => (
//                     <button key={subject.subject_id} onClick={() => handleSubjectClick(subject.subject_id)}>
//                         {subject.subject_name}
//                     </button>
//                 ))}

//                 <h3>Notices:</h3>
//                 <ul>
//                     {notices.map((notice) => (
//                         <li key={notice.notice_id}>{notice.notice_text}</li>
//                     ))}
//                 </ul>

//                 {selectedSubjectId && (
//                     <div>
//                         <h3>Post Notice for Subject ID: {selectedSubjectId}</h3>
//                         <form onSubmit={handleNoticeSubmit}>
//                             <textarea
//                                 rows="4"
//                                 cols="30"
//                                 placeholder="Write your notice here..."
//                                 value={noticeText}
//                                 onChange={(e) => setNoticeText(e.target.value)} // Update notice text
//                                 required // Make textarea required
//                             />
//                             <button type="submit">Post Notice</button>
//                         </form>
//                     </div>
//                 )}
//             </div>

//             <div>
//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : showSubjectDetails ? (
//                     <div>
//                         <h3>Subject Details:</h3>
//                         <h3>Attendance:</h3>
//                         <p>{attendanceData.no_present}/{attendanceData.tot_no_class}</p>

//                         <h3>Assignments:</h3>
//                         {assignments.length > 0 ? (
//                             <ul>
//                                 {assignments.map((assignment) => (
//                                     <li key={assignment.assignment_id}>
//                                         {assignment.assignment_details} - Due: {assignment.due_date}
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p>No assignments available</p>
//                         )}

//                         <h3>Resources:</h3>
//                         {resources.length > 0 ? (
//                             <ul>
//                                 {resources.map((resource) => (
//                                     <li key={resource.resource_link}>
//                                         <a href={resource.resource_link} target="_blank" rel="noopener noreferrer">
//                                             {resource.resource_link}
//                                         </a>
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p>No resources available</p>
//                         )}
//                         <button onClick={() => setShowSubjectDetails(false)}>Back to Subjects</button>
//                     </div>
//                 ) : null}
//             </div>
//         </div>
//     );
// };

// export default TeacherDashboard;
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

    // Handle grade submission
    // const handleGradeSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await axios.post('http://localhost:5000/api/teacher/grades', {
    //             studentEmail: gradeEmail,
    //             grade: selectedGrade,
    //             subject_id: selectedSubjectId,
    //         });
    //         alert('Grade updated successfully!');
    //         setGradeEmail('');
    //     } catch (error) {
    //         alert('Failed to update grade. Please try again.');
    //     }
    // };
    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/teacher/grades', {
                email: gradeEmail,  // Update to `email` to match backend
                grade: selectedGrade,
                subjectId: selectedSubjectId,  // Update to `subjectId` to match backend
            });
            alert('Grade updated successfully!');
            setGradeEmail('');
        } catch (error) {
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
