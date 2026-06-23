const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer to store files in memory buffers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  }
});

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
router.post('/', upload.single('photo'), createFaculty);
router.put('/:id', upload.single('photo'), updateFaculty);
router.delete('/:id', deleteFaculty);

module.exports = router;
