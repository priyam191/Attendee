import {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const MarkAttendance = () => {
    const url = "https://attendee-6ox7.onrender.com";
  const [course, setCourse] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { id: courseId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


    useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const resCourse = await axios.get(`${url}/api/courses/${courseId}`);
        setCourse(resCourse.data);
        
        // Set today's date as default
        const today = new Date().toISOString().substring(0, 10);
        setAttendanceDate(today);
        
        // Initialize students array with all students in the course
        if (resCourse.data.students) {
          const initialStudents = resCourse.data.students.map(student => ({
            student: student._id,
            present: false
          }));
          setStudents(initialStudents);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setLoading(false);
        setError('Failed to load course data');
      }
    };
    
    fetchCourseData();
  }, [courseId]);

    const handleToggleAttendance = (studentId) => {
        setStudents(
            students.map(s =>
                s.student === studentId ? { ...s, present: !s.present } : s
            )
        );

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const resTeachers = await axios.get(`${url}/api/teachers`);
            // console.log('All teachers:', resTeachers.data);
            const teachersData = resTeachers.data.find(t => t.user._id === user._id);
            // console.log('Found teacher:', teachersData);

            if (!teachersData) {
                throw new Error('Teacher not found');
            }

            const attendanceData = {
                courseId: courseId,
                teacherId: teachersData._id,
                date: attendanceDate,
                students: students
            };

            console.log('Submitting attendance:', attendanceData);
            await axios.post(`${url}/api/attendance`, attendanceData);
            setSuccess(alert('Attendance submitted successfully'));
            setSubmitting(false);

            setTimeout(() =>{
                navigate('/teacher/dashboard');  
            },2000);
        }
        catch (err) {
            console.error('Error submitting attendance:', err);
            console.error('Error response:', err.response?.data);
            setSubmitting(false);
            setError(err.response?.data?.message || 'Failed to submit attendance');
        }

        
    };

    if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!course) {
    return <div className="not-found">Course not found</div>;
  }

  return (
    <div className="mark-attendance">
      {/* <div className="back-link">
        <Link to={`${url}/course/${courseId}`}>&larr; Back to Course</Link>
      </div> */}
      
      <h1>Mark Attendance - {course.courseName}</h1>
      <p><strong>Course Code:</strong> {course.courseCode}</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group date-selector">
          <label htmlFor="date">Attendance Date:</label>
          <input
            type="date"
            id="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            max={new Date().toISOString().substring(0, 10)} // prevent selecting future dates
            required
          />
        </div>
        
        {/* <div className="attendance-controls">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleMarkAllPresent}
          >
            Mark All Present
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleMarkAllAbsent}
          >
            Mark All Absent
          </button>
        </div> */}
        
        <div className="students-list">
          <h2>Students</h2>
          {course.students.length === 0 ? (
            <p>No students enrolled in this course.</p>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Present</th>
                </tr>
              </thead>
              <tbody>
                {course.students.map(student => {
                  const studentAttendance = students.find(
                    s => s.student === student._id
                  );
                  
                  return (
                    <tr key={student._id}>
                      <td>{student.studentId}</td>
                      <td>{student.user.name}</td>
                      <td>
                        <label className="attendance-toggle">
                          <input
                            type="checkbox"
                            checked={studentAttendance?.present || false}
                            onChange={() => handleToggleAttendance(student._id)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting || course.students.length === 0}
          >
            {submitting ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </div>
      </form>
    </div>
  );

};

export default MarkAttendance;

  