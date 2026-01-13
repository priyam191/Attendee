import { useEffect, useState, useContext  } from "react"
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './student.css';

function StudentDashboard() {
  const url = "https://attendee-6ox7.onrender.com";
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceSummary, setAttendanceSummary] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchStudentData = async () => {
      try{
        console.log('Fetching students, user:', user);
        const response = await axios.get(`${url}/api/students`);
        console.log('Students response:', response.data);
        
        const studentData = response.data.find(s => s.user._id === user._id);
        console.log('Found student:', studentData);

        if(studentData){
          const resFullStudent = await axios.get(`${url}/api/students/${studentData._id}`);
          console.log('Full student data:', resFullStudent.data);
          setStudent(resFullStudent.data);
        }else{
          console.log('No student found for user');
          navigate('/login'); 
        }
      }catch(error){
        console.error('Error fetching student data:', error);
      }finally{
        setLoading(false);
      }
    }
    if(user){
      fetchStudentData();
    }
  }, [user]);
  if(loading){
    return <div className="loading">Loading...</div>;
  }
  if(!student){
    return <div className="not-found">Student profile not found</div>;
  }
  return (
  <div className="student-dashboard">
    <h1>Student Dashboard</h1>
    <h2>Welcome, {student.user.name}</h2>
    
    <div className="student-info">
      <p><strong>Email:</strong> {student.user.email}</p>
      <p><strong>Student Id:</strong> {student.studentId}</p>
      <p><strong>Department:</strong> {student.department}</p>
      <p><strong>Year:</strong> {student.year}</p> 
      <p><strong>Email Id:</strong> {student.user.email}</p>
    </div>

    <h2>My Courses</h2>
    <div className="courses">
      {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
        student.enrolledCourses
          .filter(course => course !== null && course !== undefined)
          .map((course) => (
            <div key={course._id} className="course-card">
              <h3>{course.courseName}</h3>
              <p><strong>Course Code:</strong> {course.courseCode}</p>
              {/* <p><strong>Credits:</strong> {course.credits}</p> */}
              <button className="btn btn-primary" onClick={() => navigate(`/student/attendance/${course._id}`)}>View Attendance</button>
            </div>
          ))
      ) : (
        <p>No courses enrolled yet.</p>
      )}
    </div>
  </div>
);


};

export default StudentDashboard