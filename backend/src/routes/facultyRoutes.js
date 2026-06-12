const express = require('express');
const router = express.Router();
const {
  getAllFaculty,
  getFacultyById,
  getFacultyByEmail,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require('../controllers/facultyController');

router.get('/', getAllFaculty);
router.get('/by-email/:email', getFacultyByEmail);
router.get('/:id', getFacultyById);
router.post('/', createFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

module.exports = router;
