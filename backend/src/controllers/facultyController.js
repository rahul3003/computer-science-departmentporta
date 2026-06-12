const { prisma } = require('../lib/prisma');

// Get all faculty members
const getAllFaculty = async (req, res) => {
  try {
    const faculty = await prisma.faculty.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(faculty);
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
    res.status(200).json(faculty);
  } catch (error) {
    console.error('Error fetching faculty by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new faculty member
const createFaculty = async (req, res) => {
  try {
    const { name, email, department, designation, qualification, experience, photoUrl, researchPublications, resumeUrl, officeHours } = req.body;
    
    if (!name || !email || !department || !designation || !qualification || !experience) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email already exists
    const existing = await prisma.faculty.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newFaculty = await prisma.faculty.create({
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
    const data = req.body;

    const existing = await prisma.faculty.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }

    const updatedFaculty = await prisma.faculty.update({
      where: { id },
      data
    });
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

    await prisma.faculty.delete({
      where: { id }
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
