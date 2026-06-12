const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSemesterStudents,
  createStudent,
  createSubject,
  getSubjects,
  assignFacultyToSubject,
  getTimetableSlots,
  updateSubject,
  deleteSubject,
  updateStudent,
  deleteStudent
} = require('../controllers/adminController');

router.get('/stats', getDashboardStats);
router.get('/semesters/:semester/students', getSemesterStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.post('/subjects', createSubject);
router.get('/subjects', getSubjects);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);
router.put('/subjects/:id/assign-faculty', assignFacultyToSubject);
router.get('/timetable', getTimetableSlots);

module.exports = router;
