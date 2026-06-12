const { prisma } = require('../lib/prisma');

// Get all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { date: 'desc' }
    });
    res.status(200).json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, attachmentUrl } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Missing required fields: title, content, category' });
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        category: category.toUpperCase(),
        attachmentUrl
      }
    });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete an announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    await prisma.announcement.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
};
