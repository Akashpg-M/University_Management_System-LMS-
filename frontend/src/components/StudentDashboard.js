import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Import the configured Axios instance
import { useLocation } from 'react-router-dom';
import './student.css';

const StudentDashboard = () => {
    const { state } = useLocation();
    const { studentId, studentName } = state || {}; // Destructure studentId and studentName from state

    // Check if studentId is present

    const [course, setCourse] = useState('');
    const [semesters] = useState(Array.from({ length: 8 }, (_, i) => i + 1));
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [grades, setGrades] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [resources, setResources] = useState([]);
    const [personalDetails, setPersonalDetails] = useState({});
    const [notices, setNotices] = useState([]);
    const [importantDates, setImportantDates] = useState([]);
    const [leaveRequest, setLeaveRequest] = useState('');
    const [loading, setLoading] = useState(true); // Loading state

    const [showSubjects, setShowSubjects] = useState(false);
    const [showSubjectDetails, setShowSubjectDetails] = useState(false);
    const [showOtherActions, setShowOtherActions] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchCourseInfo();
            await fetchPersonalDetails();
            await fetchNotices();
            await fetchImportantDates();
            setLoading(false);
        };

        fetchData();
    }, []);

    const fetchCourseInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/student/dashboard/${studentId}`);
            setCourse(response.data.course);
        } catch (error) {
            alert('Could not fetch course information. Please try again later.');
        }
    };

    const fetchPersonalDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/student/${studentId}/details`);
            setPersonalDetails(response.data);
        } catch (error) {
            alert('Could not fetch personal details. Please try again later.');
        }
    };

    const fetchNotices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/student/notices');
            setNotices(response.data);
        } catch (error) {
            alert('Could not fetch notices. Please try again later.');
        }
    };

    const fetchImportantDates = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/student/important-dates');
            setImportantDates(response.data);
        } catch (error) {
            alert('Could not fetch important dates. Please try again later.');
        }
    };

    const fetchSubjects = async (semester) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/student/${studentId}/subjects`, {
                params: { semester }
            });
            setSubjects(response.data.subjects);
            setSelectedSemester(semester);
            setShowSubjects(true);
        } catch (error) {
            alert('Could not fetch subjects. Please try again later.');
        }
    };    

    const fetchAttendance = async (subjectId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/student/${studentId}/attendance/${subjectId}`);
            const attendanceData = response.data; // Ensure this returns { no_present, tot_no_class }
    
            // Check if the data is in the expected format
            if (attendanceData && attendanceData.no_present !== undefined && attendanceData.tot_no_class !== undefined) {
                setAttendance(attendanceData); // Set attendance state
            } else {
                console.error('Unexpected attendance data format:', attendanceData);
                setAttendance({ no_present: 0, tot_no_class: 0 }); // Default values
            }
        } catch (error) {
            console.error('Could not fetch attendance records:', error);
            alert('Could not fetch attendance records. Please try again later.');
        }
    };
    

    const fetchGrades = async (subjectId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/student/${studentId}/grades/${subjectId}`);
            setGrades(response.data.grade);
        } catch (error) {
            alert('Could not fetch grades. Please try again later.');
        }
    };

    // const fetchAssignments = async (subjectId) => {
    //     try {
    //         const response = await axios.get(`http://localhost:5000/api/student/${studentId}/subjects/${subjectId}/assignments`, {
    //             params: { subjectId }
    //         });
    //         setAssignments(response.data.assignments);
    //     } catch (error) {
    //         alert('Could not fetch assignments. Please try again later.');
    //     }
    // };

    
    const fetchAssignments = async (subjectId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/student/${studentId}/subjects/${subjectId}/assignments`);
            setAssignments(response.data.assignments); // Ensure this line receives the expected data
        } catch (error) {
            alert('Could not fetch assignments. Please try again later.');
        }
    };
    
    const fetchResources = async (subjectId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/student/${studentId}/subjects/${subjectId}/resources`, {
                params: { subjectId }
            });
            setResources(response.data.resources);
        } catch (error) {
            alert('Could not fetch resources. Please try again later.');
        }
    };

    const handleLeaveRequestSubmit = async () => {
        try {
            await axios.post(`http://localhost:5000/api/student/${studentId}/apply-leave`, { leave_dates: leaveRequest });
            alert('Leave request submitted successfully');
            setLeaveRequest('');
        } catch (error) {
            alert('Could not submit leave request. Please try again later.');
        }
    };

    return (
        // <div style={{ display: 'flex', flexDirection: 'row' }}>
        //     <div style={{ marginRight: '20px', width: '200px' }}>
        //         <h1>Welcome {studentName}</h1>
        //         <h2>Course: {course}</h2>

        //         <h3>Semester Options:</h3>
        //         {semesters.map((semester) => (
        //             <button key={semester} onClick={() => fetchSubjects(semester)}>
        //                 Semester {semester}
        //             </button>
        //         ))}

        //         {showSubjects && (
        //             <>
        //                 <h3>Subjects for Semester {selectedSemester}:</h3>
        //                 {subjects.map((subject) => (
        //                     <button key={subject.subject_id} onClick={() => {
        //                         fetchAttendance(subject.subject_id);
        //                         fetchGrades(subject.subject_id);
        //                         fetchAssignments(subject.subject_id);
        //                         fetchResources(subject.subject_id);
        //                         setShowSubjectDetails(true); // Show subject details
        //                     }}>
        //                         {subject.subject_name}
        //                     </button>
        //                 ))}
        //             </>
        //         )}

        //         {showOtherActions ? (
        //             <>
        //                 <h3>Other Actions:</h3>
        //                 <button onClick={() => alert(JSON.stringify(personalDetails))}>View Details</button>
        //                 <button onClick={() => alert(JSON.stringify(notices))}>View Notices</button>
        //                 <button onClick={() => alert(JSON.stringify(importantDates))}>View Important Dates</button>
        //                 <h4>Leave Request:</h4>
        //                 <textarea
        //                     placeholder="Enter leave dates (comma separated)"
        //                     value={leaveRequest}
        //                     onChange={(e) => setLeaveRequest(e.target.value)}
        //                 />
        //                 <button onClick={handleLeaveRequestSubmit}>Submit Leave Request</button>
        //             </>
        //         ) : (
        //             <button onClick={() => setShowOtherActions(true)}>Show Other Actions</button>
        //         )}
        //     </div>

        //     <div>
        //         {loading ? (
        //             <p>Loading...</p>
        //         ) : showSubjectDetails ? (
        //             <div>
        //                 <h3>Details:</h3>
        
        //                 <h3>Attendance:</h3>
        //                 <p>{attendance.no_present !== undefined && attendance.tot_no_class !== undefined ? `${attendance.no_present}/${attendance.tot_no_class}` : 'No attendance data available'}</p>
                        
        //                 <h3>Grade:</h3>
        //                 <p>{grades !== null ? grades : 'Grade not yet uploaded'}</p>

        //                 <h3>Assignments:</h3>
        //                 {assignments.length > 0 ? (
        //                     <ul>
        //                         {assignments.map((assignment) => (
        //                             <li key={assignment.assignment_id}>
        //                                 {assignment.assignment_details} - Due: {assignment.due_date}
        //                             </li>
        //                         ))}
        //                     </ul>
        //                 ) : (
        //                     <p>No assignments available</p>
        //                 )}

        //                 <h3>Resources:</h3>
        //                 {resources.length > 0 ? (
        //                     <ul>
        //                         {resources.map((resource) => (
        //                             <li key={resource.resource_link}>
        //                                 <a href={resource.resource_link} target="_blank" rel="noopener noreferrer">
        //                                     {resource.resource_link}
        //                                 </a>
        //                             </li>
        //                         ))}
        //                     </ul>
        //                 ) : (
        //                     <p>No resources available</p>
        //                 )}
        //                 <button onClick={() => setShowSubjectDetails(false)}>Back to Semester Options</button>
        //             </div>
        //         ) : null}
        //     </div>
        // </div>
        <div className="student-dashboard">
    <div className="sidebar">
        <h1>Welcome {studentName}</h1>
        <h2>Course: {course}</h2>

        <h3>Semester Options:</h3>
        {semesters.map((semester) => (
            <button
                key={semester}
                onClick={() => fetchSubjects(semester)}
                className="semester-button"
            >
                Semester {semester}
            </button>
        ))}

        {showSubjects && (
            <>
                <h3>Subjects for Semester {selectedSemester}:</h3>
                {subjects.map((subject) => (
                    <button
                        key={subject.subject_id}
                        onClick={() => {
                            fetchAttendance(subject.subject_id);
                            fetchGrades(subject.subject_id);
                            fetchAssignments(subject.subject_id);
                            fetchResources(subject.subject_id);
                            setShowSubjectDetails(true);
                        }}
                        className="subject-button"
                    >
                        {subject.subject_name}
                    </button>
                ))}
            </>
        )}

        {showOtherActions ? (
            <>
                <h3>Other Actions:</h3>
                <button onClick={() => alert(JSON.stringify(personalDetails))} className="action-button">View Details</button>
                <button onClick={() => alert(JSON.stringify(notices))} className="action-button">View Notices</button>
                <button onClick={() => alert(JSON.stringify(importantDates))} className="action-button">View Important Dates</button>
                <h4>Leave Request:</h4>
                <textarea
                    placeholder="Enter leave dates (comma separated)"
                    value={leaveRequest}
                    onChange={(e) => setLeaveRequest(e.target.value)}
                    className="leave-textarea"
                />
                <button onClick={handleLeaveRequestSubmit} className="submit-button">Submit Leave Request</button>
            </>
        ) : (
            <button onClick={() => setShowOtherActions(true)} className="action-button">Show Other Actions</button>
        )}
    </div>

    <div className="main-content">
        {loading ? (
            <p>Loading...</p>
        ) : showSubjectDetails ? (
            <div className="subject-details">
                <h3>Details:</h3>

                <h3>Attendance:</h3>
                <p>{attendance.no_present !== undefined && attendance.tot_no_class !== undefined ? `${attendance.no_present}/${attendance.tot_no_class}` : 'No attendance data available'}</p>

                <h3>Grade:</h3>
                <p>{grades !== null ? grades : 'Grade not yet uploaded'}</p>

                <h3>Assignments:</h3>
                {assignments.length > 0 ? (
                    <ul>
                        {assignments.map((assignment) => (
                            <li key={assignment.assignment_id}>
                                {assignment.assignment_details} - Due: {assignment.due_date}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No assignments available</p>
                )}

                <h3>Resources:</h3>
                {resources.length > 0 ? (
                    <ul>
                        {resources.map((resource) => (
                            <li key={resource.resource_link}>
                                <a href={resource.resource_link} target="_blank" rel="noopener noreferrer">
                                    {resource.resource_link}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No resources available</p>
                )}
                <button onClick={() => setShowSubjectDetails(false)} className="back-button">Back to Semester Options</button>
            </div>
        ) : null}
    </div>
</div>
    );
};

export default StudentDashboard;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// const StudentDashboard = () => {
//     const location = useLocation();
//     const { studentId } = location.state || {}; // Access studentId from state

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [semesters, setSemesters] = useState([]);
//     const [selectedSemester, setSelectedSemester] = useState(null);
//     const [subjects, setSubjects] = useState([]);
//     const [attendance, setAttendance] = useState({});
//     const [grades, setGrades] = useState({});
//     const [assignments, setAssignments] = useState([]);
//     const [resources, setResources] = useState([]);
//     const [personalDetails, setPersonalDetails] = useState({});

//     useEffect(() => {
//         if (!studentId) {
//             setError('Student ID is required to access the dashboard.');
//             setLoading(false);
//             return;
//         }

//         const fetchData = async () => {
//             try {
//                 const dashboardResponse = await axios.get(`/api/dashboard/${studentId}`);
//                 setPersonalDetails(dashboardResponse.data);
//                 setSemesters(dashboardResponse.data.importantDates); // Adjust based on your data structure
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [studentId]);

//     useEffect(() => {
//         if (selectedSemester) {
//             const fetchSubjects = async () => {
//                 try {
//                     const response = await axios.get(`/api/${studentId}/subjects?semester=${selectedSemester}`);
//                     setSubjects(response.data.subjects);
//                 } catch (err) {
//                     setError(err.message);
//                 }
//             };

//             fetchSubjects();
//         }
//     }, [selectedSemester, studentId]);

//     const handleSemesterClick = (semester) => {
//         setSelectedSemester(semester);
//         setSubjects([]);
//         setAttendance({});
//         setGrades({});
//         setAssignments([]);
//         setResources([]);
//     };

//     useEffect(() => {
//         if (selectedSemester) {
//             const fetchDataForSubject = async () => {
//                 try {
//                     const subjectId = subjects[0]?.subject_id; // Example logic
//                     if (subjectId) {
//                         const [attendanceResponse, gradesResponse, assignmentsResponse, resourcesResponse] = await Promise.all([
//                             axios.get(`/api/${studentId}/attendance/${subjectId}`),
//                             axios.get(`/api/${studentId}/grades/${subjectId}`),
//                             axios.get(`/api/${studentId}/subjects/${subjectId}/assignments`),
//                             axios.get(`/api/${studentId}/subjects/${subjectId}/resources`),
//                         ]);

//                         setAttendance(attendanceResponse.data);
//                         setGrades(gradesResponse.data);
//                         setAssignments(assignmentsResponse.data.assignments);
//                         setResources(resourcesResponse.data.resources);
//                     }
//                 } catch (err) {
//                     setError(err.message);
//                 }
//             };

//             fetchDataForSubject();
//         }
//     }, [selectedSemester, subjects, studentId]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div>
//             <h2>Welcome to the Student Dashboard</h2>
//             <h3>Your Personal Details</h3>
//             <div>
//                 Name: {personalDetails.name}
//                 <br />
//                 Email: {personalDetails.email}
//             </div>

//             <h3>Select Semester</h3>
//             <div>
//                 {semesters.map(semester => (
//                     <button key={semester.id} onClick={() => handleSemesterClick(semester.id)}>
//                         Semester {semester.name}
//                     </button>
//                 ))}
//             </div>

//             {selectedSemester && (
//                 <div>
//                     <h3>Subjects:</h3>
//                     <ul>
//                         {subjects.map(subject => (
//                             <li key={subject.subject_id}>{subject.subject_name}</li>
//                         ))}
//                     </ul>

//                     <h3>Attendance:</h3>
//                     <p>{attendance.no_present}/{attendance.tot_no_class}</p>

//                     <h3>Grades:</h3>
//                     <p>{grades.grade || "Grade not yet uploaded"}</p>

//                     <h3>Assignments:</h3>
//                     <ul>
//                         {assignments.length > 0 ? assignments.map(assignment => (
//                             <li key={assignment.assignment_id}>{assignment.assignment_details} (Due: {assignment.due_date})</li>
//                         )) : <li>No assignments found.</li>}
//                     </ul>

//                     <h3>Resources:</h3>
//                     <ul>
//                         {resources.length > 0 ? resources.map(resource => (
//                             <li key={resource.resource_id}>
//                                 <a href={resource.resource_link} target="_blank" rel="noopener noreferrer">{resource.resource_name}</a>
//                             </li>
//                         )) : <li>No resources available.</li>}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default StudentDashboard;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// const StudentDashboard = () => {
//     const location = useLocation();
//     const { studentId } = location.state || {};
    
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [semesters, setSemesters] = useState([]);
//     const [selectedSemester, setSelectedSemester] = useState(null);
//     const [subjects, setSubjects] = useState([]);
//     const [attendance, setAttendance] = useState({});
//     const [grades, setGrades] = useState({});
//     const [assignments, setAssignments] = useState([]);
//     const [resources, setResources] = useState([]);
//     const [personalDetails, setPersonalDetails] = useState({});

//     useEffect(() => {
//         if (!studentId) {
//             setError('Student ID is required to access the dashboard.');
//             setLoading(false);
//             return;
//         }

//         const fetchData = async () => {
//             try {
//                 const dashboardResponse = await axios.get(`/api/dashboard/${studentId}`);
//                 setPersonalDetails(dashboardResponse.data);
//                 setSemesters(dashboardResponse.data.importantDates || []);
//             } catch (err) {
//                 setError('Failed to load personal details. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [studentId]);

//     useEffect(() => {
//         if (selectedSemester) {
//             const fetchSubjects = async () => {
//                 try {
//                     const response = await axios.get(`/api/${studentId}/subjects?semester=${selectedSemester}`);
//                     setSubjects(response.data.subjects);
//                 } catch (err) {
//                     setError('Failed to load subjects. Please try again.');
//                 }
//             };
//             fetchSubjects();
//         }
//     }, [selectedSemester, studentId]);

//     const handleSemesterClick = (semester) => {
//         setSelectedSemester(semester);
//         // Reset states when a new semester is selected
//         setSubjects([]);
//         setAttendance({});
//         setGrades({});
//         setAssignments([]);
//         setResources([]);
//     };

//     useEffect(() => {
//         if (selectedSemester && subjects.length > 0) {
//             const fetchDataForSubject = async () => {
//                 try {
//                     const subjectId = subjects[0]?.subject_id; // Select the first subject for now
//                     if (subjectId) {
//                         const [attendanceResponse, gradesResponse, assignmentsResponse, resourcesResponse] = await Promise.all([
//                             axios.get(`/api/${studentId}/attendance/${subjectId}`),
//                             axios.get(`/api/${studentId}/grades/${subjectId}`),
//                             axios.get(`/api/${studentId}/subjects/${subjectId}/assignments`),
//                             axios.get(`/api/${studentId}/subjects/${subjectId}/resources`),
//                         ]);
//                         setAttendance(attendanceResponse.data);
//                         setGrades(gradesResponse.data);
//                         setAssignments(assignmentsResponse.data.assignments);
//                         setResources(resourcesResponse.data.resources);
//                     }
//                 } catch (err) {
//                     setError('Failed to load subject data. Please try again.');
//                 }
//             };
//             fetchDataForSubject();
//         }
//     }, [selectedSemester, subjects, studentId]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div>
//             <h2>Welcome to the Student Dashboard</h2>
//             <h3>Your Personal Details</h3>
//             <div>
//                 Name: {personalDetails.name} <br />
//                 Email: {personalDetails.email}
//             </div>
//             <h3>Select Semester</h3>
//             <div>
//                 {semesters.map(semester => (
//                     <button key={semester.id} onClick={() => handleSemesterClick(semester.id)}>
//                         Semester {semester.name}
//                     </button>
//                 ))}
//             </div>
//             {selectedSemester && (
//                 <div>
//                     <h3>Subjects:</h3>
//                     <ul>
//                         {subjects.map(subject => (
//                             <li key={subject.subject_id}>{subject.subject_name}</li>
//                         ))}
//                     </ul>
//                     <h3>Attendance:</h3>
//                     <p>{attendance.no_present}/{attendance.tot_no_class}</p>
//                     <h3>Grades:</h3>
//                     <p>{grades.grade || "Grade not yet uploaded"}</p>
//                     <h3>Assignments:</h3>
//                     <ul>
//                         {assignments.length > 0 ? assignments.map(assignment => (
//                             <li key={assignment.assignment_id}>{assignment.assignment_details} (Due: {assignment.due_date})</li>
//                         )) : <li>No assignments found.</li>}
//                     </ul>
//                     <h3>Resources:</h3>
//                     <ul>
//                         {resources.length > 0 ? resources.map(resource => (
//                             <li key={resource.resource_id}>
//                                 <a href={resource.resource_link} target="_blank" rel="noopener noreferrer">{resource.resource_name}</a>
//                             </li>
//                         )) : <li>No resources available.</li>}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default StudentDashboard;





