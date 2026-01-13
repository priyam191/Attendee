const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  teacherId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  teachingCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'course'
    }
  ]
});

module.exports = mongoose.models.teacher || mongoose.model('teacher', TeacherSchema);
