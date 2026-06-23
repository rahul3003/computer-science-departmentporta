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

    const attendanceStats = {};
    for (const sem of semesters) {
      const present = await prisma.attendance.count({
        where: { semester: sem, status: 'PRESENT' }
      });
      const absent = await prisma.attendance.count({
        where: { semester: sem, status: 'ABSENT' }
      });
      attendanceStats[sem] = { present, absent };
    }

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
      },
      attendanceStats
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
      updateData.needsPasswordChange = true;
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

const getDailyAttendanceStats = async (req, res) => {
  try {
    const { date, subjectId } = req.query;
    if (!date || !subjectId) {
      return res.status(400).json({ error: 'Missing date or subjectId' });
    }

    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0);

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const totalStudents = await prisma.user.count({
      where: { role: 'STUDENT', semester: subject.semester }
    });

    const present = await prisma.attendance.count({
      where: {
        subjectId,
        date: parsedDate,
        status: 'PRESENT'
      }
    });

    const absent = await prisma.attendance.count({
      where: {
        subjectId,
        date: parsedDate,
        status: 'ABSENT'
      }
    });

    res.status(200).json({
      totalStudents,
      present,
      absent
    });
  } catch (error) {
    console.error('Error fetching daily attendance stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createTimetableSlot = async (req, res) => {
  try {
    const { semester, timeSlot, monday, tuesday, wednesday, thursday, friday } = req.body;
    if (!semester || !timeSlot) {
      return res.status(400).json({ error: 'Missing required fields: semester, timeSlot' });
    }

    const slot = await prisma.timetableSlot.create({
      data: {
        semester,
        timeSlot,
        monday: monday || null,
        tuesday: tuesday || null,
        wednesday: wednesday || null,
        thursday: thursday || null,
        friday: friday || null
      }
    });
    res.status(201).json(slot);
  } catch (error) {
    console.error('Error creating timetable slot:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeSlot, monday, tuesday, wednesday, thursday, friday } = req.body;

    const slot = await prisma.timetableSlot.update({
      where: { id },
      data: {
        timeSlot,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday
      }
    });
    res.status(200).json(slot);
  } catch (error) {
    console.error('Error updating timetable slot:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.timetableSlot.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Timetable slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable slot:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getSampleSheet = async (req, res) => {
  try {
    const XLSX = require('xlsx');
    // Create template worksheet data
    const data = [
      ["Computer Science & Engineering | Student Roster Import Template"],
      ["Branch: Computer Science & Engineering"],
      ["Sl.No.", "Reg No", "Student Name", "Father Name", "Gender", "Student Mobile No.", "Parent Mobile No.", "email"],
      [1, "446CS24002", "Anil Kumar", "Malleshappa", "M", "9876543210", "9876543211", "anil.kumar@sandur.edu"],
      [2, "446CS24003", "Deepika Padukone", "Prakash Padukone", "F", "8765432109", "8765432108", "deepika.p@sandur.edu"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=student_import_template.xlsx');
    return res.status(200).send(buf);
  } catch (error) {
    console.error('Error generating sample sheet:', error);
    return res.status(500).json({ error: 'Failed to generate template sheet' });
  }
};

const importSemesterStudents = async (req, res) => {
  try {
    const XLSX = require('xlsx');
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { semester, mode } = req.body;
    if (!semester) {
      return res.status(400).json({ error: 'Missing required field: semester' });
    }
    if (mode !== 'clear' && mode !== 'merge') {
      return res.status(400).json({ error: 'Invalid mode. Must be "clear" or "merge"' });
    }

    // Read the Excel workbook from memory buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length <= 1) {
      return res.status(400).json({ error: 'Excel sheet is empty or contains no records' });
    }

    // Determine the header row index dynamically by finding the row containing 'email'
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(data.length, 10); i++) {
      const row = data[i];
      if (row && row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('email'))) {
        headerRowIndex = i;
        break;
      }
    }
    if (headerRowIndex === -1) {
      headerRowIndex = 2; // fallback to row 2
    }

    const headers = data[headerRowIndex] || [];
    let nameCol = -1;
    let genderCol = -1;
    let phoneCol = -1;
    let emailCol = -1;
    let regCol = -1;

    headers.forEach((h, idx) => {
      if (!h) return;
      const lower = String(h).toLowerCase().trim();
      if (lower.includes('email')) emailCol = idx;
      else if (lower.includes('name') && !lower.includes('father')) nameCol = idx;
      else if (lower.includes('gender')) genderCol = idx;
      else if (lower.includes('mobile') || lower.includes('phone')) phoneCol = idx;
      else if (lower.includes('reg') || lower.includes('enroll')) regCol = idx;
    });

    // Fallbacks if not found by header name (assuming our template layout)
    if (emailCol === -1) emailCol = 7;
    if (nameCol === -1) nameCol = 2;
    if (regCol === -1) regCol = 1;

    // If "clear" mode, perform cascading deletes for this semester's students
    if (mode === 'clear') {
      const semesterStudents = await prisma.user.findMany({
        where: { role: 'STUDENT', semester },
        select: { id: true }
      });
      const studentIds = semesterStudents.map(s => s.id);
      if (studentIds.length > 0) {
        // Delete attendance records associated with these students
        await prisma.attendance.deleteMany({
          where: { studentId: { in: studentIds } }
        });
        await prisma.user.deleteMany({
          where: { id: { in: studentIds } }
        });
      }
    }

    let successCount = 0;
    let updatedCount = 0;
    let skipCount = 0;
    let failCount = 0;
    const warnings = [];

    // Parse data rows starting after the header row index
    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;

      const name = nameCol !== -1 && row[nameCol] ? String(row[nameCol]).trim() : '';
      const genderRaw = genderCol !== -1 && row[genderCol] ? String(row[genderCol]).trim().toUpperCase() : '';
      const phoneRaw = phoneCol !== -1 && row[phoneCol] ? String(row[phoneCol]).trim() : '';
      const email = emailCol !== -1 && row[emailCol] ? String(row[emailCol]).trim().toLowerCase() : '';

      // Skip rows with invalid emails
      if (!email || !email.includes('@')) {
        skipCount++;
        continue;
      }

      // Parse gender
      let gender = 'MALE';
      if (genderRaw === 'F' || genderRaw === 'FEMALE') {
        gender = 'FEMALE';
      } else if (genderRaw === 'O' || genderRaw === 'OTHER') {
        gender = 'OTHER';
      }

      // Enrollment ID from register column or email prefix
      let enrollmentId = null;
      if (regCol !== -1 && row[regCol]) {
        enrollmentId = String(row[regCol]).trim().toUpperCase();
      } else if (email) {
        enrollmentId = email.split('@')[0].toUpperCase();
      }

      const phone = phoneRaw || null;

      try {
        // Find existing user by email
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });

        if (existingUser) {
          if (mode === 'merge') {
            // Update student information
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: name || existingUser.name,
                gender,
                enrollmentId: enrollmentId || existingUser.enrollmentId,
                semester,
                phone: phone || existingUser.phone
              }
            });
            updatedCount++;
          } else {
            warnings.push(`Row ${i + 1}: Duplicate email '${email}' in the upload file.`);
            failCount++;
          }
        } else {
          // Check if enrollment ID is already used by someone else
          if (enrollmentId) {
            const existingByEnrollment = await prisma.user.findUnique({
              where: { enrollmentId }
            });
            if (existingByEnrollment) {
              warnings.push(`Row ${i + 1}: Enrollment ID '${enrollmentId}' is already registered to email '${existingByEnrollment.email}'. Skipped.`);
              failCount++;
              continue;
            }
          }

          // Create new student
          const hashedPassword = bcrypt.hashSync(email, 10);
          await prisma.user.create({
            data: {
              name: name || 'Unknown Student',
              email,
              password: hashedPassword,
              role: 'STUDENT',
              gender,
              enrollmentId,
              semester,
              group: 'Group A',
              phone,
              needsPasswordChange: true
            }
          });
          successCount++;
        }
      } catch (err) {
        console.error(`Error importing row ${i + 1}:`, err);
        warnings.push(`Row ${i + 1} (${name || email}): ${err.message}`);
        failCount++;
      }
    }

    return res.status(200).json({
      successCount,
      updatedCount,
      skipCount,
      failCount,
      warnings
    });
  } catch (error) {
    console.error('Error during bulk student import:', error);
    return res.status(500).json({ error: 'Internal Server Error during import' });
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
  deleteStudent,
  getDailyAttendanceStats,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  getSampleSheet,
  importSemesterStudents
};

