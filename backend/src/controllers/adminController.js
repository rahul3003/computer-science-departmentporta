const bcrypt = require('bcryptjs');
const { prisma } = require('../lib/prisma');

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await prisma.user.count({
      where: { role: 'STUDENT' }
    });

    const totalFaculty = await prisma.faculty.count();
    const totalResources = await prisma.resource.count();
    const totalAnnouncements = await prisma.announcement.count();

    const boysCount = await prisma.user.count({
      where: { role: 'STUDENT', gender: 'MALE' }
    });

    const girlsCount = await prisma.user.count({
      where: { role: 'STUDENT', gender: 'FEMALE' }
    });

    const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];
    const semesterDistribution = {};
    const semesterGenderDistribution = {};

    for (const sem of semesters) {
      const total = await prisma.user.count({
        where: { role: 'STUDENT', semester: sem }
      });
      const boys = await prisma.user.count({
        where: { role: 'STUDENT', semester: sem, gender: 'MALE' }
      });
      const girls = await prisma.user.count({
        where: { role: 'STUDENT', semester: sem, gender: 'FEMALE' }
      });

      semesterDistribution[sem] = total;
      semesterGenderDistribution[sem] = { boys, girls };
    }

    const notesCount = await prisma.resource.count({
      where: { category: 'NOTES' }
    });
    const manualsCount = await prisma.resource.count({
      where: { category: 'LAB_MANUAL' }
    });
    const examPapersCount = await prisma.resource.count({
      where: { category: 'QUESTION_PAPER' }
    });
    const syllabusCount = await prisma.resource.count({
      where: { category: 'SYLLABUS' }
    });

    res.status(200).json({
      totalStudents,
      totalFaculty,
      totalResources,
      totalAnnouncements,
      genderDistribution: {
        boys: boysCount,
        girls: girlsCount
      },
      semesterDistribution,
      semesterGenderDistribution,
      resourceCategoryDistribution: {
        'Notes': notesCount,
        'Manuals': manualsCount,
        'Exam Papers': examPapersCount,
        'Syllabus': syllabusCount
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getSemesterStudents = async (req, res) => {
  try {
    const { semester } = req.params;
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT', semester },
      orderBy: { name: 'asc' }
    });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching semester students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createStudent = async (req, res) => {
  try {
    const { name, email, password, gender, enrollmentId, semester, group } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields: name, email, password' });
    }

    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    if (enrollmentId) {
      const existingByEnrollment = await prisma.user.findUnique({ where: { enrollmentId } });
      if (existingByEnrollment) {
        return res.status(400).json({ error: 'Enrollment ID already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT',
        gender: gender || 'MALE',
        enrollmentId: enrollmentId || null,
        semester: semester || null,
        group: group || null
      }
    });

    const { password: _, ...studentWithoutPassword } = student;
    res.status(201).json(studentWithoutPassword);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createSubject = async (req, res) => {
  try {
    const { code, name, semester, credits, theory, practical, type } = req.body;
    if (!code || !name || !semester) {
      return res.status(400).json({ error: 'Missing required fields: code, name, semester' });
    }

    const existingSubject = await prisma.subject.findUnique({ where: { code } });
    if (existingSubject) {
      return res.status(400).json({ error: 'Subject with this Course Code already exists' });
    }

    const subject = await prisma.subject.create({
      data: {
        code,
        name,
        semester,
        credits: parseInt(credits) || 0,
        theory: theory || '4 hrs/wk',
        practical: practical || '0 hrs/wk',
        type: type || 'Core Theory'
      }
    });
    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getSubjects = async (req, res) => {
  try {
    const { semester, facultyEmail } = req.query;
    const filter = {};
    if (semester) filter.semester = semester;
    if (facultyEmail) filter.facultyEmail = facultyEmail;
    
    const subjects = await prisma.subject.findMany({
      where: filter,
      orderBy: { code: 'asc' }
    });
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const assignFacultyToSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { facultyEmail } = req.body;

    const subject = await prisma.subject.update({
      where: { id },
      data: { facultyEmail: facultyEmail || null }
    });
    res.status(200).json(subject);
  } catch (error) {
    console.error('Error assigning faculty to subject:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTimetableSlots = async (req, res) => {
  try {
    const { semester } = req.query;
    const filter = {};
    if (semester) filter.semester = semester;
    const slots = await prisma.timetableSlot.findMany({
      where: filter,
      orderBy: { timeSlot: 'asc' }
    });
    res.status(200).json(slots);
  } catch (error) {
    console.error('Error fetching timetable slots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, credits, theory, practical, type } = req.body;

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        code,
        name,
        credits: credits ? parseInt(credits) : undefined,
        theory,
        practical,
        type
      }
    });
    res.status(200).json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete attendance records associated with this subject first
    await prisma.attendance.deleteMany({
      where: { subjectId: id }
    });

    await prisma.subject.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, enrollmentId, gender, group, password } = req.body;

    const updateData = {
      name,
      email,
      enrollmentId,
      gender,
      group
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const student = await prisma.user.update({
      where: { id },
      data: updateData
    });

    const { password: _, ...studentWithoutPassword } = student;
    res.status(200).json(studentWithoutPassword);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete attendance records associated with this student first
    await prisma.attendance.deleteMany({
      where: { studentId: id }
    });

    await prisma.user.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
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
};

