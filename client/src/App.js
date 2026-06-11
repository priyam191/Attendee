import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';

// Route-level code-splitting: reduces initial bundle size (measurable via npm run build)
const Home = lazy(() => import('./components/layout/Home'));
const Login = lazy(() => import('./components/auth/Login'));
const StudentDashboard = lazy(() => import('./components/student/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./components/teacher/TeacherDashboard'));
const MarkAttendance = lazy(() => import('./components/teacher/MarkAttendance'));
const ViewAttendance = lazy(() => import('./components/student/ViewAttendance'));
const CourseDetails = lazy(() => import('./components/Courses/CourseDetails'));
const PerformanceStats = lazy(() => import('./components/performance/PerformanceStats'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Suspense fallback={<div className="loading">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/performance" element={<PerformanceStats />} />
              <Route path="/student/dashboard" element={
                <PrivateRoute role="student">
                  <StudentDashboard />
                </PrivateRoute>} />
              <Route path="/teacher/dashboard" element={
                <PrivateRoute role="teacher">
                  <TeacherDashboard />
                </PrivateRoute>} />
              <Route path="/course/:id" element={
                <PrivateRoute>
                  <CourseDetails />
                </PrivateRoute>} />
              <Route path="/course/:id/mark-attendance" element={
                <PrivateRoute role="teacher">
                  <MarkAttendance />
                </PrivateRoute>} />
              <Route path="/student/attendance/:id" element={
                <PrivateRoute role="student">
                  <ViewAttendance />
                </PrivateRoute>} />
              <Route path="*" element={<h1 style={{ textAlign: 'center' }}>Page not found</h1>} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
