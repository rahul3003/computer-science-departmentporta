const { prisma } = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const { uploadToS3, signS3Url } = require('../lib/s3');

// Get all faculty members
const getAllFaculty = async (req, res) => {
  try {
    const faculty = await prisma.faculty.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Dynamically sign each private photo URL
    const mapped = await Promise.all(faculty.map(async (fac) => {
      if (fac.photoUrl) {
        fac.photoUrl = await signS3Url(fac.photoUrl);
      }
      return fac;
    }));
    
    res.status(200).json(mapped);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get single faculty member by email
const getFacultyByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const faculty = await prisma.faculty.findUnique({
      where: { email: decodeURIComponent(email) }
    });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }
    
    if (faculty.photoUrl) {
      faculty.photoUrl = await signS3Url(faculty.photoUrl);
    }
    
    res.status(200).json(faculty);
  } catch (error) {
    console.error('Error fetching faculty by email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get single faculty member by ID
const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await prisma.faculty.findUnique({
      where: { id }
    });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }
    
    if (faculty.photoUrl) {
      faculty.photoUrl = await signS3Url(faculty.photoUrl);
    }
    
    res.status(200).json(faculty);
  } catch (error) {
    console.error('Error fetching faculty by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new faculty member
const createFaculty = async (req, res) => {
  try {
    const { name, email, department, designation, qualification, experience, researchPublications, resumeUrl, officeHours } = req.body;
    let photoUrl = req.body.photoUrl || null;

    if (req.file) {
      try {
        photoUrl = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (s3Err) {
        console.error('AWS S3 upload failed for faculty photo:', s3Err);
        return res.status(500).json({ error: 'Failed to upload profile picture to storage.' });
      }
    }
    
    if (!name || !email || !department || !designation || !qualification || !experience) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email already exists in faculty table
    const existingFaculty = await prisma.faculty.findUnique({ where: { email } });
    if (existingFaculty) {
      return res.status(400).json({ error: 'Email already registered as faculty' });
    }

    // Check if email already exists in user table
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered as a user' });
    }

    const hashedPassword = await bcrypt.hash('faculty123password', 10);

    const newFaculty = await prisma.$transaction(async (tx) => {
      const fac = await tx.faculty.create({
        data: {
          name,
          email,
          department,
          designation,
          qualification,
          experience,
          photoUrl,
          researchPublications,
          resumeUrl,
          officeHours
        }
      });

      await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'FACULTY'
        }
      });

      return fac;
    });
    
    if (newFaculty.photoUrl) {
      newFaculty.photoUrl = await signS3Url(newFaculty.photoUrl);
    }

    res.status(201).json(newFaculty);
  } catch (error) {
    console.error('Error creating faculty:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a faculty member
const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (req.file) {
      try {
        const photoUrl = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
        data.photoUrl = photoUrl;
      } catch (s3Err) {
        console.error('AWS S3 upload failed for faculty photo update:', s3Err);
        return res.status(500).json({ error: 'Failed to upload profile picture to storage.' });
      }
    }

    const existing = await prisma.faculty.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }

    // If email is changing, make sure it is not already taken by another faculty or user
    if (data.email && data.email !== existing.email) {
      const emailTakenFaculty = await prisma.faculty.findUnique({ where: { email: data.email } });
      if (emailTakenFaculty) {
        return res.status(400).json({ error: 'Email already registered as faculty' });
      }
      const emailTakenUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (emailTakenUser) {
        return res.status(400).json({ error: 'Email already registered as a user' });
      }
    }

    const updatedFaculty = await prisma.$transaction(async (tx) => {
      const fac = await tx.faculty.update({
        where: { id },
        data
      });

      if (data.name !== undefined || data.email !== undefined) {
        await tx.user.updateMany({
          where: { email: existing.email },
          data: {
            name: data.name !== undefined ? data.name : undefined,
            email: data.email !== undefined ? data.email : undefined
          }
        });
      }

      return fac;
    });
    
    if (updatedFaculty.photoUrl) {
      updatedFaculty.photoUrl = await signS3Url(updatedFaculty.photoUrl);
    }

    res.status(200).json(updatedFaculty);
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a faculty member
const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.faculty.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.faculty.delete({
        where: { id }
      });
      await tx.user.deleteMany({
        where: { email: existing.email }
      });
    });

    res.status(200).json({ message: 'Faculty member deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  getFacultyByEmail,
  createFaculty,
  updateFaculty,
  deleteFaculty
};
