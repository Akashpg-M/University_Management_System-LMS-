// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './components/Login';
// import StudentDashboard from './components/StudentDashboard';
// import TeacherDashboard from './components/TeacherDashboard';
// import AdminDashboard from './components/AdminDashboard';
// import './styles.css';  // Correct path to styles.css (relative to src/components)

// function App() {
//   return (
//     <Router>
//       <div className="app-container">
//         <h1>University Management System</h1>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/student-dashboard" element={<StudentDashboard />} />
//           <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
//           <Route path="/admin-dashboard" element={<AdminDashboard />} />
//           <Route path="*" element={<h2>Page Not Found</h2>} /> {/* Error handling for unknown routes */}
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/LoginForm'; // Ensure correct import path
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                    <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

