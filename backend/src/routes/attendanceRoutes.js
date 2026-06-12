const express = require('express');
const router = express.Router();
const {
  saveAttendance,
  getAttendance,
  getStudentAttendanceSummary
} = require('../controllers/attendanceController');

router.post('/', saveAttendance);
router.get('/', getAttendance);
router.get('/student/:studentId', getStudentAttendanceSummary);

module.exports = router;
