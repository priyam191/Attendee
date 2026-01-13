const express = require('express');
const router = express.Router();

const attendanceController = require('../controllers/attendance');

router.post('/', attendanceController.markAttendance);
router.get('/course/:courseId', attendanceController.getAttendanceByCourse);
router.put('/course/:courseId', attendanceController.editAttendance);

module.exports = router;