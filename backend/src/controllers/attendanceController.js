const { prisma } = require('../lib/prisma');

// Save or Update Attendance for a set of students
const saveAttendance = async (req, res) => {
  try {
    const { date, semester, subjectId, records, markedBy } = req.body;

    if (!date || !semester || !subjectId || !Array.isArray(records) || !markedBy) {
      return res.status(400).json({ error: 'Missing required fields: date, semester, subjectId, records, markedBy' });
    }

    // Normalize date to midnight UTC to prevent timezone shifts
    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0);

    const queries = records.map(record => {
      return prisma.attendance.upsert({
        where: {
          date_subjectId_studentId: {
            date: parsedDate,
            subjectId,
            studentId: record.studentId
          }
        },
        update: {
          status: record.status,
          markedBy
        },
        create: {
          date: parsedDate,
          semester,
          subjectId,
          studentId: record.studentId,
          status: record.status,
          markedBy
        }
      });
    });

    await prisma.$transaction(queries);

    res.status(200).json({ message: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Attendance for a specific date and subject
const getAttendance = async (req, res) => {
  try {
    const { date, subjectId } = req.query;

    if (!date || !subjectId) {
      return res.status(400).json({ error: 'Missing query parameters: date, subjectId' });
    }

    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findMany({
      where: {
        date: parsedDate,
        subjectId
      }
    });

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get attendance stats for a specific student
const getStudentAttendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get subjects for this student's semester
    const subjects = await prisma.subject.findMany({
      where: { semester: student.semester || '' },
      orderBy: { code: 'asc' }
    });

    // Get all attendance records for this student
    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentId }
    });

    const summary = subjects.map(sub => {
      const records = attendanceRecords.filter(r => r.subjectId === sub.id);
      const conducted = records.length;
      const attended = records.filter(r => r.status === 'PRESENT').length;

      return {
        id: sub.id,
        code: sub.code,
        name: sub.name,
        type: sub.type,
        semester: sub.semester,
        conducted,
        attended
      };
    });


    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching student attendance summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  saveAttendance,
  getAttendance,
  getStudentAttendanceSummary
};
