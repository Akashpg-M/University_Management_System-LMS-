import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.css';

function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    // const [clubs, setClubs] = useState([]);
    const [importantDates, setImportantDates] = useState([]);
    const [notices, setNotices] = useState([]);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', department: '', semester: '', contact: '', accommodation: '' });
    const [teacherEmail, setTeacherEmail] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    useEffect(() => {
        fetchStudents();
        fetchCourses();
        fetchLeaveRequests();
        fetchImportantDates();
        fetchNotices();
    }, []);

    useEffect(() => {
        console.log("Fetched Leave Requests:", leaveRequests);
    }, [leaveRequests]);
    

    const fetchStudents = async () => {
        const response = await axios.get('http://localhost:5000/api/admin/students');
        setStudents(response.data);
    };

    const fetchCourses = async () => {
        const response = await axios.get('http://localhost:5000/api/admin/courses');
        setCourses(response.data);
    };

    const fetchLeaveRequests = async () => {
        const response = await axios.get('http://localhost:5000/api/admin/leave-requests');
        setLeaveRequests(response.data);
    };

    const fetchImportantDates = async () => {
        const response = await axios.get('http://localhost:5000/api/admin/important-dates');
        setImportantDates(response.data);
    };

    const fetchNotices = async () => {
        const response = await axios.get('http://localhost:5000/api/admin/notices');
        setNotices(response.data);
    };

    const handleAddStudent = async () => {
        await axios.post('http://localhost:5000/api/admin/students', newStudent);
        fetchStudents(); 
    };

    const handleSearchTeacher = async () => {
        const response = await axios.get(`http://localhost:5000/api/admin/teachers/${teacherEmail}`);
        setSelectedTeacher(response.data);
    };

    const handleApproveLeave = async (leaveId) => {
        if(!leaveId){
            console.error('Leaveid not defined');
        }
        await axios.post(`http://localhost:5000/api/admin/leave-requests/approve/${leaveId}`);
        fetchLeaveRequests();
    };

    const handleRejectLeave = async (leaveId) => {
        await axios.post(`http://localhost:5000/api/admin/leave-requests/reject/${leaveId}`);
        fetchLeaveRequests();
    };

    return (
        <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
            <div className="section">
                <h3>View Student Details</h3>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Semester</th>
                            <th>Contact</th>
                            <th>Accommodation</th>
                        </tr>
                    </thead>
                    <tbody>

                        {(students.map((student) => {
                            console.log(student);
                            return(
                                <tr key={student.student_id}>
                                    <td>{student.student_id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.department}</td>
                                    <td>{student.current_semester}</td>
                                    <td>{student.contact_number}</td>
                                    <td>{student.accommodation_status}</td>
                                </tr> 
                            ) 
                            }
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="section">
                <h3>View Teacher Details</h3>
                <input
                    type="email"
                    placeholder="Enter Teacher Email"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleSearchTeacher} className="search-button">Search Teacher</button>
                {selectedTeacher && (
                    <div className="teacher-details">
                        <p><strong>Name:</strong> {selectedTeacher.name}</p>
                        <p><strong>Department:</strong> {selectedTeacher.department}</p>
                        <p><strong>Assigned Subjects:</strong> {selectedTeacher.subjects ? selectedTeacher.subjects.split(', ').join(', ') : 'No subjects assigned'}</p>
                        <p><strong>Extra Classes:</strong> {selectedTeacher.extra_classes}</p>
                    </div>
                )}
            </div>

            <div className="section">
                <h3>Add New Student</h3>
                <form className="add-student-form">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Department"
                        value={newStudent.department}
                        onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Semester"
                        value={newStudent.semester}
                        onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Contact"
                        value={newStudent.contact}
                        onChange={(e) => setNewStudent({ ...newStudent, contact: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Accommodation"
                        value={newStudent.accommodation}
                        onChange={(e) => setNewStudent({ ...newStudent, accommodation: e.target.value })}
                        className="input-field"
                    />
                    <button type="button" onClick={handleAddStudent} className="add-button">Add Student</button>
                </form>
            </div>

            <div className="section">
                <h3>Manage Courses and Enrollment</h3>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Course ID</th>
                            <th>Course Name</th>
                            <th>Enrolled Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.course_id}>
                                <td>{course.course_id}</td>
                                <td>{course.course_name}</td>
                                <td>{course.enrolled_students}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            
            <div className="section">
                <h3>Manage Leave Requests</h3>

                {leaveRequests.map((request) => {
                    console.log("Leave Request:", request); // Log each request object
                    return (
                        <div key={request.id} className="leave-request">
                            <p>Student: {request.student_name} - Status: {request.status}</p>
                            <button onClick={() => handleApproveLeave(request.id)} className="approve-button">Approve</button>
                            <button onClick={() => handleRejectLeave(request.id)} className="reject-button">Reject</button>
                        </div> 
                    );
                })}
            </div>

            <div className="section">
                <h3>Manage Important Dates</h3>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Event</th>
                        </tr>
                    </thead>
                    <tbody>
                        {importantDates.map((date) => (
                            <tr key={date.event_id}>
                                <td>{date.date}</td>
                                <td>{date.event}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="section">
                <h3>Post Notices</h3>
                <ul className="notice-list">
                    {notices.map((notice) => (
                        <li key={notice.notice_id} className="notice-item">{notice.notice_details}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboard;
