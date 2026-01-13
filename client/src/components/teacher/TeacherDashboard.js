import { Link } from 'react-router-dom';
import {useState, useEffect, useContext} from 'react'
import { useNavigate} from 'react-router-dom'
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './teacher.css';



function TeacherDashboard() {
  const url = "https://attendee-6ox7.onrender.com";
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
  const fetchTeacherData = async () => {
    try {
      const response = await axios.get(`${url}/api/teachers`);

      // console.log('FULL RESPONSE:', response);
      // console.log('RESPONSE DATA:', response.data);
      const teacherData = response.data.find( t => t.user._id === user._id);
      
      // console.log('MATCHED TEACHER DATA:', teacherData);
      if(teacherData) {
        const resFullTeacher = await axios.get(`${url}/api/teachers/${teacherData._id}`);
        setTeacher(resFullTeacher.data);
      } else {
        navigate('/login');
      }

    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchTeacherData();
}, [user]);

if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!teacher) {
    return <div className="not-found">Teacher profile not found</div>;
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="teacher-info">
          <h2>{teacher.user.name}</h2>
          <p><strong>Teacher ID:</strong> {teacher.teacherId}</p>
          <p><strong>Department:</strong> {teacher.department}</p>
        </div>
      </div>
      
      <div className="teaching-courses">
        <h2>Teaching Courses</h2>
        {teacher.teachingCourses.length === 0 ? (
          <p>You are not assigned to any courses.</p>
        ) : (
          <div className="courses-list">
            {teacher.teachingCourses.map(course => (
              <div key={course._id} className="course-card">
                <h3>{course.courseName}</h3>
                <p><strong>Course Code:</strong> {course.courseCode}</p>
                <p><strong>Total Classes:</strong> {course.totalClasses}</p>
                <div className="course-actions">
                  <Link 
                    to={`/course/${course._id}`} 
                    className="btn btn-secondary"
                  >
                    View Course Details
                  </Link>
                  <Link 
                    to={`/course/${course._id}/mark-attendance`} 
                    className="btn btn-primary"
                  >
                    Mark Attendance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard