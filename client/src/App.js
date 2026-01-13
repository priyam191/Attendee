import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import Home from './components/layout/Home';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import MarkAttendance from './components/teacher/MarkAttendance';
import ViewAttendance from './components/student/ViewAttendance';
import CourseDetails from './components/Courses/CourseDetails';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student/dashboard" element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute> } />
            <Route path="/teacher/dashboard" element={
              <PrivateRoute role="teacher">
                <TeacherDashboard />
              </PrivateRoute> } />
              <Route path = "/course/:id" element= {
              <PrivateRoute>
                <CourseDetails />
              </PrivateRoute>}
            />
            <Route path = "/course/:id/mark-attendance" element = {
              <PrivateRoute role="teacher">
                <MarkAttendance />
              </PrivateRoute>}
            />
            <Route path="/student/attendance/:id" element={
              <PrivateRoute role="student">
                <ViewAttendance />
              </PrivateRoute>}
            />
            <Route path="*" element={<h1 style={{"textAlign": "center"}}>Page not found</h1>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
