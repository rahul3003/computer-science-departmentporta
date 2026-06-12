const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { prisma } = require('../lib/prisma');
const { s3Client, uploadToS3 } = require('../lib/s3');

// Get all resources with optional category, semester, or course code filter
const getResources = async (req, res) => {
  try {
    const { category, semester, courseCode } = req.query;
    
    const filter = {};
    if (category) filter.category = category.toUpperCase();
    if (semester) filter.semester = semester;
    if (courseCode) filter.courseCode = courseCode;

    const resources = await prisma.resource.findMany({
      where: filter,
      orderBy: { uploadedAt: 'desc' }
    });

    // Map resources to include temporary S3 presigned URLs for safe viewing
    const mapped = await Promise.all(resources.map(async (item) => {
      if (item.fileUrl && item.fileUrl.startsWith('http') && item.fileUrl.includes('.s3.')) {
        try {
          const urlObj = new URL(item.fileUrl);
          const bucket = urlObj.hostname.split('.')[0];
          const key = decodeURIComponent(urlObj.pathname.substring(1));

          const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key
          });

          // Generate a temporary signed URL valid for 24 hours (86400 seconds)
          const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 86400 });
          return {
            ...item,
            fileUrl: signedUrl
          };
        } catch (s3Err) {
          console.error('Error signing URL for resource:', item.id, s3Err);
          return item;
        }
      }
      return item;
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new study/academic resource
const createResource = async (req, res) => {
  try {
    const { title, description, category, courseCode, semester } = req.body;
    let { fileUrl } = req.body;

    // Upload to S3 if a file is present in the request
    if (req.file) {
      try {
        fileUrl = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (s3Err) {
        console.error('AWS S3 Upload failed:', s3Err);
        return res.status(500).json({ error: 'Failed to upload resource attachment to S3 storage.' });
      }
    }

    if (!title || !fileUrl || !category || !semester) {
      return res.status(400).json({ error: 'Missing required fields: title, file, category, semester' });
    }

    const newResource = await prisma.resource.create({
      data: {
        title,
        description,
        fileUrl,
        category: category.toUpperCase(),
        courseCode,
        semester
      }
    });
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a resource
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await prisma.resource.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getResources,
  createResource,
  deleteResource
};
