const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// Mark attendance for a student in a course
const markAttendance = async (req, res) => {
    try {
        const { courseId, date, students, teacherId, teacherName } = req.body;

        // Validate date - prevent marking attendance for future dates
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        const inputDate = new Date(date);
        const today = new Date();
        // Normalize both dates to ignore time portion
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (inputDate > today) {
            return res.status(400).json({ message: 'Cannot mark attendance for future dates' });
        }

        // Validate courseId
        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        //check attendance for the date already exists
        const existingAttendance = await Attendance.findOne({ 
            course: courseId, 
            date: new Date(date)
        });

        if (existingAttendance) {
            existingAttendance.students = students;
            await existingAttendance.save();
            return res.status(400).json({ message: 'Attendance already marked for this date' });
        }

        const newAttendance = new Attendance({
            course : courseId,
            date: new Date(date),
            students,
            markedBy: teacherId 
        });

        //increment total classes in course
        course.totalClasses += 1;
        await course.save();

        await newAttendance.save();
        res.status(201).json(newAttendance);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// get all attendance records for a course
const getAttendanceByCourse = async (req, res) => {
    try{
        // Validate courseId
        if (!req.params.courseId || !mongoose.Types.ObjectId.isValid(req.params.courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }

        const attendance = await Attendance.find({ course: req.params.courseId })
        .populate({
        path: 'students.student',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .sort({ date: -1 });   // Sort by date descending
        res.status(200).json(attendance);
    }catch(error){
        res.status(500).json({ message: 'Server error', error });
    }
};

const editAttendance = async (req, res) => {
    try {
  const { date, students, teacherId } = req.body;
  const { courseId } = req.params;

  /* ------------------ 1. BASIC VALIDATION ------------------ */
  if (!date || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      msg: "Date and non-empty students array are required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ msg: "Invalid course ID" });
  }

  /* ------------------ 2. FIX DATE MATCHING ------------------ */
  // Normalize date to start & end of day
  const inputDate = new Date(date);
  const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

  const attendance = await Attendance.findOne({
    course: courseId,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  if (!attendance) {
    return res.status(404).json({
      msg: "Attendance record not found for this course and date",
    });
  }

  /* ------------------ 3. UPDATE SAFELY ------------------ */
  attendance.students = students;

  if (teacherId) {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ msg: "Invalid teacher ID" });
    }
    attendance.markedBy = teacherId;
  }

  await attendance.save();

  /* ------------------ 4. POPULATE FOR RESPONSE ------------------ */
  const updatedAttendance = await Attendance.findById(attendance._id)
    .populate({
      path: "students.student",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .populate("markedBy", "name");

  return res.status(200).json(updatedAttendance);

} catch (error) {
  console.error(error);
  return res.status(500).json({ msg: "Server error" });
}
};



module.exports = {
    markAttendance,
    getAttendanceByCourse,
    editAttendance
};