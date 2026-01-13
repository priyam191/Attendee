import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './course.css';

const CourseDetails = () => {
  const url = "https://attendee-6ox7.onrender.com";
  const { id } = useParams();
  const { role } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editingRecord, setEditingRecord] = useState(null);
  const [editStudents, setEditStudents] = useState([]);
  const [editDate, setEditDate] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCourse = await axios.get(`${url}/api/courses/${id}`);
        const resAttendance = await axios.get(`${url}/api/attendance/course/${id}`);

        setCourse(resCourse.data);
        setAttendanceRecords(resAttendance.data);

        calculateStudentAttendance(resCourse.data.students, resAttendance.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ---------------- HELPERS ---------------- */

  const calculateStudentAttendance = (students, records) => {
    const stats = {};

    students.forEach(student => {
      let totalPresent = 0;

      records.forEach(record => {
        const studentRecord = record.students.find(
          s => s.student?._id === student._id
        );
        if (studentRecord?.present) totalPresent++;
      });

      const totalClasses = records.length;
      const percentage = totalClasses
        ? (totalPresent / totalClasses) * 100
        : 0;

      stats[student._id] = {
        totalPresent,
        totalClasses,
        percentage
      };
    });

    setStudentAttendance(stats);
  };

  /* ---------------- EDIT LOGIC ---------------- */

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setEditStudents(record.students.map(s => ({ ...s })));
    setEditDate(record.date);
  };

  const handleTogglePresent = (idx) => {
    setEditStudents(prev =>
      prev.map((s, i) =>
        i === idx ? { ...s, present: !s.present } : s
      )
    );
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    try {
      await axios.put(`${url}/api/attendance/course/${id}`, {
        date: editDate,
        students: editStudents.map(s => ({
          student: s.student._id || s.student,
          present: s.present
        })),
        teacherId: course.teacher?._id
      });

      // 🔥 REFETCH + RECOMPUTE (NO PAGE REFRESH)
      const resAttendance = await axios.get(`${url}/api/attendance/course/${id}`);
      setAttendanceRecords(resAttendance.data);
      calculateStudentAttendance(course.students, resAttendance.data);

      setEditingRecord(null);
    } catch (err) {
      alert('Failed to update attendance');
    }
    setEditLoading(false);
  };

  /* ---------------- UI ---------------- */

  if (loading) return <div className="loading">Loading...</div>;
  if (!course) return <div className="not-found">Course not found</div>;

  return (
    <div className="course-details">
      <Link to={role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}>
        ← Back to Dashboard
      </Link>

      <h1>{course.courseName}</h1>
      <p><strong>Code:</strong> {course.courseCode}</p>

      {role === 'teacher' && (
        <>
          <h2>Students</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Attendance</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {course.students.map(s => {
                const stat = studentAttendance[s._id] || {};
                return (
                  <tr key={s._id}>
                    <td>{s.studentId}</td>
                    <td>{s.user.name}</td>
                    <td>{stat.totalPresent}/{stat.totalClasses}</td>
                    <td className={stat.percentage < 75 ? 'warning' : ''}>
                      {stat.percentage?.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      <h2>Attendance History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Present</th>
            <th>Absent</th>
            {role === 'teacher' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map(record => {
            const present = record.students.filter(s => s.present).length;
            return (
              <tr key={record._id}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{present}</td>
                <td>{record.students.length - present}</td>
                {role === 'teacher' && (
                  <td>
                    <button onClick={() => handleEditClick(record)}>Edit</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingRecord && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit Attendance</h3>
            {editStudents.map((s, i) => (
              <div key={i}>
                {s.student.user.name} —
                <button onClick={() => handleTogglePresent(i)}>
                  {s.present ? 'Present' : 'Absent'}
                </button>
              </div>
            ))}
            <button onClick={handleEditSubmit} disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditingRecord(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
