const Course = require('../models/Course');
const User = require('../models/User');
const Student = require('../models/Student');
const mongoose = require('mongoose');


// Get all courses
const getAllCourses = async (req, res) => {
     try {
    const courses = await Course.find()
      .populate('teacher', 'teacherId')
      .populate({
        path: 'teacher',
        populate: {
          path: 'user',
          select: 'name'
        }
      });
    
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//get course by ID
const getCourseById = async (req, res) => {
    try {
      // Validate the ID parameter
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid course ID' });
      }

      const course = await Course.findById(req.params.id)
        .populate({
          path: 'teacher',
          populate: {
            path: 'user',
            select: 'name'
          }
        })
        .populate({
          path: 'students',
          populate: {
            path: 'user',
            select: 'name'
          }
        });
      
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
      
      res.json(course);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Course not found' });
      }
      res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllCourses, getCourseById
};