const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/prisma');
const { signS3Url } = require('../lib/s3');

const JWT_SECRET = process.env.JWT_SECRET || 'sandur_polytechnic_jwt_secret_key_default';

// Register a new user (Student, Faculty, or Admin)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, enrollmentId, semester, group } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields: name, email, password' });
    }

    // Check if user already exists by email
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    // Check if user already exists by enrollmentId (if provided)
    if (enrollmentId) {
      const existingByEnrollment = await prisma.user.findUnique({ where: { enrollmentId } });
      if (existingByEnrollment) {
        return res.status(400).json({ error: 'A user with this Enrollment ID already exists' });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'STUDENT',
        enrollmentId: enrollmentId || null,
        semester: semester || null,
        group: group || null,
        needsPasswordChange: false
      }
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields: email, password' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    if (user.role === 'FACULTY') {
      const facultyProfile = await prisma.faculty.findUnique({
        where: { email: user.email }
      });
      if (facultyProfile && facultyProfile.photoUrl) {
        userWithoutPassword.photoUrl = await signS3Url(facultyProfile.photoUrl);
      }
    }

    res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Missing required fields: email, currentPassword, newPassword' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid current password' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB and clear needsPasswordChange flag
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        needsPasswordChange: false
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      message: 'Password changed successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error during password change:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword
};
