const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getResources,
  createResource,
  deleteResource
} = require('../controllers/resourceController');

// Configure multer to store files in memory buffers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB limit
  }
});

router.get('/', getResources);
router.post('/', upload.single('file'), createResource);
router.delete('/:id', deleteResource);

module.exports = router;
