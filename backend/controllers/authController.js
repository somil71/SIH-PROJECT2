import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

// Generate tokens
const generateAccessToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, gender, dateOfBirth, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      address
    });

    await user.save();

    // Generate token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(201).json({
      message: 'User registered successfully',
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({
      message: 'Login successful',
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Register Doctor
export const registerDoctor = async (req, res) => {
  try {
    const { 
      name, email, password, phone, gender, dateOfBirth, address,
      specialization, experience, education, consultationFee, bio, languages
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      address
    });

    await user.save();

    // Create doctor profile
    const doctor = new Doctor({
      user: user._id,
      specialization,
      experience,
      education,
      consultationFee,
      bio,
      languages: languages || []
    });

    await doctor.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Doctor registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      doctor: {
        id: doctor._id,
        specialization: doctor.specialization,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({ message: 'Doctor registration failed', error: error.message });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if user is a doctor
    const doctor = await Doctor.findOne({ user: user._id });
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        profilePicture: user.profilePicture,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      doctor: doctor ? {
        id: doctor._id,
        specialization: doctor.specialization,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        bio: doctor.bio,
        rating: doctor.rating,
        isVerified: doctor.isVerified,
        languages: doctor.languages
      } : null
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Failed to get user information', error: error.message });
  }
};

// Logout (client-side token removal)
export const logoutUser = (req, res) => {
  res.clearCookie('refreshToken').json({ message: 'Logged out successfully' });
};

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const accessToken = generateAccessToken(decoded.userId);
    res.json({ token: accessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};
