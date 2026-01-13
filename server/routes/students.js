const studentController = require('../controllers/students');
const express = require('express');
const router = express.Router();


router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);

module.exports = router;