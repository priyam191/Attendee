const Student = require('../models/Student');
const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

// Get all students
const getAllStudents = async (req, res) => {
    try {
    const students = await Student.find().populate('user', ['name', 'email']);
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//get student by ID
const getStudentById = async (req, res) => {
    try {
    // Validate the ID parameter
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid student ID' });
    }

    // First, get the student without populating courses
    const student = await Student.findById(req.params.id)
      .populate('user', ['name', 'email']);
    
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    
    // Filter out invalid ObjectIds from enrolledCourses before populating
    let validCourseIds = [];
    if (student.enrolledCourses && Array.isArray(student.enrolledCourses)) {
      validCourseIds = student.enrolledCourses
        .filter(courseId => {
          if (courseId === null || courseId === undefined) {
            return false;
          }
          // Handle both ObjectId objects and strings
          const idString = courseId.toString ? courseId.toString() : courseId;
          return idString !== '' && mongoose.Types.ObjectId.isValid(idString);
        })
        .map(courseId => {
          // Convert to ObjectId if it's a string
          if (typeof courseId === 'string') {
            return new mongoose.Types.ObjectId(courseId);
          }
          return courseId;
        });
    }
    
    // Populate only valid course IDs
    const studentObj = student.toObject();
    if (validCourseIds.length > 0) {
      const courses = await Course.find({ _id: { $in: validCourseIds } });
      studentObj.enrolledCourses = courses;
    } else {
      studentObj.enrolledCourses = [];
    }
    
    res.json(studentObj);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.status(500).send('Server Error');
  }
};


module.exports = {
    getAllStudents, getStudentById
};