const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Load environment variables from backend/.env
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envConfig = fs.readFileSync(envPath, 'utf8');
      envConfig.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.substring(1, value.length - 1);
          }
          process.env[key] = value;
        }
      });
      console.log('Loaded environment variables.');
    }
  } catch (err) {
    console.error('Error loading .env file:', err);
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const firstNamesMale = [
  'Aravind', 'Abhishek', 'Rahul', 'Rohan', 'Aditya', 'Amit', 'Vijay', 'Sanjay', 'Manjunath', 'Karan',
  'Praveen', 'Suresh', 'Ramesh', 'Anil', 'Ganesh', 'Kartik', 'Sandesh', 'Darshan', 'Sagar', 'Chethan',
  'Sunil', 'Harish', 'Pradeep', 'Nitin', 'Manoj', 'Vikram', 'Shashank', 'Kiran', 'Bharath', 'Pavan'
];

const firstNamesFemale = [
  'Sneha', 'Deepika', 'Priya', 'Ananya', 'Kavya', 'Aishwarya', 'Meghana', 'Divya', 'Pooja', 'Shreya',
  'Jyothi', 'Lata', 'Shruti', 'Preethi', 'Kavitha', 'Swathi', 'Sindhu', 'Rupa', 'Nisha', 'Rashmi',
  'Neha', 'Varshini', 'Sushma', 'Tejaswini', 'Soundarya', 'Sahana', 'Keerthana', 'Spoorthi', 'Nandini', 'Bhavya'
];

const lastNames = [
  'Patil', 'Hegde', 'Gowda', 'Deshmukh', 'Kulkarni', 'Joshi', 'Kamath', 'Naik', 'Shetty', 'Rao',
  'Bhat', 'Prasad', 'Kumar', 'Singh', 'Reddy', 'Chavan', 'Hiremath', 'Angadi', 'Badiger', 'Pujari'
];

function generateStudents(semester, maleCount, femaleCount, startId) {
  const students = [];
  const hashedPassword = bcrypt.hashSync('password123', 10);
  
  // Male
  for (let i = 0; i < maleCount; i++) {
    const fn = firstNamesMale[Math.floor(Math.random() * firstNamesMale.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${semester.replace(/\s+/g, '').toLowerCase()}.${i + startId}@sandur.edu`;
    students.push({
      name,
      email,
      password: hashedPassword,
      role: 'STUDENT',
      gender: 'MALE',
      semester,
      enrollmentId: `SP${semester.split(' ')[1]}CS${100 + i + startId}`
    });
  }
  
  // Female
  for (let i = 0; i < femaleCount; i++) {
    const fn = firstNamesFemale[Math.floor(Math.random() * firstNamesFemale.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${semester.replace(/\s+/g, '').toLowerCase()}.${i + startId + 50}@sandur.edu`;
    students.push({
      name,
      email,
      password: hashedPassword,
      role: 'STUDENT',
      gender: 'FEMALE',
      semester,
      enrollmentId: `SP${semester.split(' ')[1]}CS${200 + i + startId}`
    });
  }
  return students;
}

async function run() {
  console.log('Starting Database Seeding...');
  try {
    // 1. Clear database
    console.log('Cleaning existing data...');
    await prisma.faculty.deleteMany({});
    await prisma.resource.deleteMany({});
    await prisma.announcement.deleteMany({});
    await prisma.user.deleteMany({
      where: { role: 'STUDENT' }
    });

    // 2. Seed Faculty
    console.log('Seeding Faculty...');
    const faculties = [
      {
        name: 'Dr. Anil Kumar M.G.',
        email: 'anilkumar@sanpoly.edu.in',
        department: 'CSE',
        designation: 'HOD & Professor',
        qualification: 'M.Tech, Ph.D. in Computer Science',
        experience: '18 Years of Academic Experience',
        photoUrl: '/api/placeholder/150/150',
        researchPublications: JSON.stringify([
          'An Efficient Cloud Migration Model using Meta-heuristic Algorithms, International Journal of Grid Computing, 2024.',
          'Analysis of Machine Learning Models for Early Intrusion Detection Systems in IoT Networks, IEEE Access, 2022.'
        ]),
        resumeUrl: '#',
        officeHours: 'Mon & Wed: 10:00 AM - 12:30 PM'
      },
      {
        name: 'Mrs. Rekha Patil',
        email: 'rekhapatil@sanpoly.edu.in',
        department: 'CSE',
        designation: 'Assistant Professor',
        qualification: 'M.Tech in Software Engineering',
        experience: '12 Years of Teaching Experience',
        photoUrl: '/api/placeholder/150/150',
        researchPublications: JSON.stringify([
          'Comparative Study of NoSQL Databases for Large Scale Web Apps, National Web Conference, 2023.'
        ]),
        resumeUrl: '#',
        officeHours: 'Tue & Thu: 2:00 PM - 4:00 PM'
      },
      {
        name: 'Mr. Shivasharanappa K.',
        email: 'shiva.k@sanpoly.edu.in',
        department: 'AI_DS',
        designation: 'Associate Professor & Lead',
        qualification: 'M.Tech in Artificial Intelligence',
        experience: '15 Years of Academic Experience',
        photoUrl: '/api/placeholder/150/150',
        researchPublications: JSON.stringify([
          'Deep Learning Models for High Resolution Agri-image Classification, AI Research Quarterly, 2025.',
          'Practical Implementation of IoT Nodes in Sandur Region Microclimate Tracking, IEEE Sensors, 2023.'
        ]),
        resumeUrl: '#',
        officeHours: 'Mon & Fri: 11:00 AM - 1:00 PM'
      },
      {
        name: 'Miss. Deepika R.',
        email: 'deepikar@sanpoly.edu.in',
        department: 'AI_DS',
        designation: 'Assistant Professor',
        qualification: 'M.Tech in Data Science & Big Data',
        experience: '6 Years in Academia & Research',
        photoUrl: '/api/placeholder/150/150',
        researchPublications: JSON.stringify([
          'Real-time Student Engagement Metrics using Computer Vision Pipelines, TechEd Conference, 2024.'
        ]),
        resumeUrl: '#',
        officeHours: 'Wed & Fri: 3:00 PM - 5:00 PM'
      },
      {
        name: 'Mr. Nagaraj Gowda',
        email: 'nagarajg@sanpoly.edu.in',
        department: 'CSE',
        designation: 'Senior Lecturer',
        qualification: 'B.E., M.Tech in Cyber Security',
        experience: '10 Years of Practical & Lab Mentoring',
        photoUrl: '/api/placeholder/150/150',
        researchPublications: JSON.stringify([
          'PC Assembly Manuals and Labs Best Practices, State Polytechnic Board Report, 2022.'
        ]),
        resumeUrl: '#',
        officeHours: 'Daily: 9:30 AM - 10:30 AM'
      }
    ];

    for (const f of faculties) {
      await prisma.faculty.create({ data: f });
    }
    console.log(`✓ Faculty members seeded (${faculties.length})`);

    // 3. Seed Students
    console.log('Generating students...');
    const sem1Students = generateStudents('Semester 1', 32, 24, 200);
    const sem2Students = generateStudents('Semester 2', 30, 22, 250);
    const sem3Students = generateStudents('Semester 3', 28, 20, 1);
    const sem4Students = generateStudents('Semester 4', 23, 15, 50);
    const sem5Students = generateStudents('Semester 5', 19, 13, 100);
    const sem6Students = generateStudents('Semester 6', 15, 9, 150);
    
    const allStudents = [
      ...sem1Students,
      ...sem2Students,
      ...sem3Students,
      ...sem4Students,
      ...sem5Students,
      ...sem6Students
    ];
    console.log(`Inserting ${allStudents.length} students into the database...`);
    
    for (const stud of allStudents) {
      await prisma.user.create({ data: stud });
    }
    console.log(`✓ Students seeded successfully!`);

    // 4. Seed Resources
    console.log('Seeding Resources...');
    const resources = [
      // 12 Notes
      { title: 'Data Structures and Algorithms - Unit 1', category: 'NOTES', semester: 'Semester 3', courseCode: 'CS-301', fileUrl: '/resources/notes_dsa_u1.pdf' },
      { title: 'Database Management Systems - Introduction', category: 'NOTES', semester: 'Semester 3', courseCode: 'CS-302', fileUrl: '/resources/notes_dbms_intro.pdf' },
      { title: 'PC Hardware & Assembly Guide', category: 'NOTES', semester: 'Semester 3', courseCode: 'CS-303', fileUrl: '/resources/notes_pc_hardware.pdf' },
      { title: 'Operating Systems - Process Management', category: 'NOTES', semester: 'Semester 4', courseCode: 'CS-401', fileUrl: '/resources/notes_os_process.pdf' },
      { title: 'Computer Networks - OSI Model', category: 'NOTES', semester: 'Semester 4', courseCode: 'CS-402', fileUrl: '/resources/notes_cn_osi.pdf' },
      { title: 'Software Engineering - Agile Methodologies', category: 'NOTES', semester: 'Semester 4', courseCode: 'CS-403', fileUrl: '/resources/notes_se_agile.pdf' },
      { title: 'Java Programming - OOP Concepts', category: 'NOTES', semester: 'Semester 5', courseCode: 'CS-501', fileUrl: '/resources/notes_java_oop.pdf' },
      { title: 'Web Development - HTML & CSS Essentials', category: 'NOTES', semester: 'Semester 5', courseCode: 'CS-502', fileUrl: '/resources/notes_web_design.pdf' },
      { title: 'Machine Learning - Linear Regression notes', category: 'NOTES', semester: 'Semester 5', courseCode: 'CS-503', fileUrl: '/resources/notes_ml_regression.pdf' },
      { title: 'Cloud Computing - AWS Services Overview', category: 'NOTES', semester: 'Semester 6', courseCode: 'CS-601', fileUrl: '/resources/notes_cloud_aws.pdf' },
      { title: 'Network Security - Cryptography Basics', category: 'NOTES', semester: 'Semester 6', courseCode: 'CS-602', fileUrl: '/resources/notes_security_crypto.pdf' },
      { title: 'Internet of Things - Sensors Integration', category: 'NOTES', semester: 'Semester 6', courseCode: 'CS-603', fileUrl: '/resources/notes_iot_sensors.pdf' },

      // 8 Lab Manuals
      { title: 'Data Structures Lab - Manual 2026', category: 'LAB_MANUAL', semester: 'Semester 3', courseCode: 'CSL-307', fileUrl: '/resources/lab_dsa.pdf' },
      { title: 'PC Hardware Troubleshooting Lab Manual', category: 'LAB_MANUAL', semester: 'Semester 3', courseCode: 'CSL-308', fileUrl: '/resources/lab_pc_trouble.pdf' },
      { title: 'Operating Systems Shell Programming Manual', category: 'LAB_MANUAL', semester: 'Semester 4', courseCode: 'CSL-407', fileUrl: '/resources/lab_os.pdf' },
      { title: 'Cisco Packet Tracer Lab manual', category: 'LAB_MANUAL', semester: 'Semester 4', courseCode: 'CSL-408', fileUrl: '/resources/lab_networks.pdf' },
      { title: 'Java Application Programming Lab Manual', category: 'LAB_MANUAL', semester: 'Semester 5', courseCode: 'CSL-507', fileUrl: '/resources/lab_java.pdf' },
      { title: 'Web Designing Lab Exercise Manual', category: 'LAB_MANUAL', semester: 'Semester 5', courseCode: 'CSL-508', fileUrl: '/resources/lab_web.pdf' },
      { title: 'IoT NodeMCU Programming Manual', category: 'LAB_MANUAL', semester: 'Semester 6', courseCode: 'CSL-607', fileUrl: '/resources/lab_iot.pdf' },
      { title: 'Project Work Guidelines Manual', category: 'LAB_MANUAL', semester: 'Semester 6', courseCode: 'CSP-608', fileUrl: '/resources/lab_project.pdf' },

      // 5 Exam Papers
      { title: 'Data Structures - 2024 Board Paper', category: 'QUESTION_PAPER', semester: 'Semester 3', courseCode: 'CS-301', fileUrl: '/resources/paper_dsa_2024.pdf' },
      { title: 'DBMS - 2025 Board Exam Paper', category: 'QUESTION_PAPER', semester: 'Semester 3', courseCode: 'CS-302', fileUrl: '/resources/paper_dbms_2025.pdf' },
      { title: 'Operating Systems - 2024 Term End Paper', category: 'QUESTION_PAPER', semester: 'Semester 4', courseCode: 'CS-401', fileUrl: '/resources/paper_os_2024.pdf' },
      { title: 'Java Programming - 2025 Board Paper', category: 'QUESTION_PAPER', semester: 'Semester 5', courseCode: 'CS-501', fileUrl: '/resources/paper_java_2025.pdf' },
      { title: 'Cloud Computing - 2025 Terminal Exam Paper', category: 'QUESTION_PAPER', semester: 'Semester 6', courseCode: 'CS-601', fileUrl: '/resources/paper_cloud_2025.pdf' },

      // 3 Syllabuses
      { title: 'CSE Department 3rd and 4th Sem Syllabus (C20)', category: 'SYLLABUS', semester: 'Semester 3', courseCode: 'SYL-C20-34', fileUrl: '/resources/syllabus_c20_34.pdf' },
      { title: 'CSE Department 5th and 6th Sem Syllabus (C20)', category: 'SYLLABUS', semester: 'Semester 5', courseCode: 'SYL-C20-56', fileUrl: '/resources/syllabus_c20_56.pdf' },
      { title: 'AI & DS Course Curriculum Board Syllabus', category: 'SYLLABUS', semester: 'Semester 3', courseCode: 'SYL-AIDS-C21', fileUrl: '/resources/syllabus_aids.pdf' }
    ];

    for (const r of resources) {
      await prisma.resource.create({ data: r });
    }
    console.log(`✓ Resources seeded (${resources.length})`);

    // 5. Seed Announcements
    console.log('Seeding Announcements...');
    const announcements = [
      { title: 'End Semester Exams Timetable Released', content: 'The board examinations for all semesters are scheduled to start from June 15, 2026. The detailed subject-wise timetable has been uploaded to the notice board.', category: 'EXAM' },
      { title: 'Infosys Campus Recruitment Drive', content: 'Infosys is visiting Sandur Polytechnic on June 20, 2026 for a pooled campus placement drive. Interested final year CSE & AI-DS students must register by June 12.', category: 'PLACEMENT' },
      { title: 'Guest Seminar on AI and Machine Learning', content: 'An expert seminar on "Generative AI Systems in Industry" by Dr. Raghavan from IISc Bangalore is arranged on June 18 at the Software Centre.', category: 'EVENT' },
      { title: 'Holiday Notice for Bakrid', content: 'In accordance with the state government holiday list, the college will remain closed on June 17, 2026.', category: 'GENERAL' },
      { title: 'TCS NQT Registration Deadline Extended', content: 'Tata Consultancy Services has extended the registration deadline for NQT 2026 to June 14. Apply via the TCS NextStep portal.', category: 'PLACEMENT' },
      { title: 'Practical Exam Batch Lists Published', content: 'Practical examination batches for CSL-507 (Java Lab) and CSL-308 (Hardware Lab) are displayed on the department notice board.', category: 'EXAM' },
      { title: 'Project Work Final Exhibition 2026', content: 'Final year students are required to demonstrate their working models and submit their reports on June 22 to the internal panel.', category: 'EVENT' },
      { title: 'Fee Payment Reminder for Term-End', content: 'All students must clear outstanding library and semester fees before June 12 to collect their admission tickets.', category: 'GENERAL' },
      { title: 'Wipro Elite National Talent Hunt', content: 'Wipro hiring portal is open for elite graduates. Check eligibility and complete registrations using the link provided in the circular.', category: 'PLACEMENT' },
      { title: 'Database Design Seminar Workshop', content: 'A hands-on workshop on "PostgreSQL Performance Tuning & Indexing" will be held on Saturday, June 13 for 5th semester students.', category: 'EVENT' },
      { title: 'Pre-board Mock Exams Schedule', content: 'Mock exams for all theory subjects are scheduled from June 11 to June 13. Attendance is compulsory for internals evaluation.', category: 'EXAM' }
    ];

    for (const a of announcements) {
      await prisma.announcement.create({ data: a });
    }
    console.log(`✓ Announcements seeded (${announcements.length})`);
    
    console.log('✓ Seeding complete! Database is fully populated with dummy data.');
  } catch (error) {
    console.error('✗ Failed to seed database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
