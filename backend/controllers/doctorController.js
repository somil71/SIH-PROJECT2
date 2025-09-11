import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

// Fallback sample doctors data for when MongoDB is unavailable
const FALLBACK_DOCTORS = [
  {
    _id: '1',
    specialization: 'Cardiology',
    experience: 15,
    consultationFee: 200,
    rating: { average: 4.8, count: 124 },
    bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
    user: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1-555-0123',
      profilePicture: '/api/placeholder/doctor1.jpg'
    },
    isActive: true,
    isVerified: true
  },
  {
    _id: '2',
    specialization: 'Dermatology',
    experience: 10,
    consultationFee: 150,
    rating: { average: 4.6, count: 89 },
    bio: 'Expert in skin conditions, cosmetic dermatology, and dermatological surgery.',
    user: {
      name: 'Dr. Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1-555-0124',
      profilePicture: '/api/placeholder/doctor2.jpg'
    },
    isActive: true,
    isVerified: true
  },
  {
    _id: '3',
    specialization: 'Pediatrics',
    experience: 12,
    consultationFee: 180,
    rating: { average: 4.9, count: 156 },
    bio: 'Dedicated pediatrician with expertise in child development and pediatric care.',
    user: {
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      phone: '+1-555-0125',
      profilePicture: '/api/placeholder/doctor3.jpg'
    },
    isActive: true,
    isVerified: true
  },
  {
    _id: '4',
    specialization: 'Neurology',
    experience: 18,
    consultationFee: 250,
    rating: { average: 4.7, count: 98 },
    bio: 'Neurologist specializing in brain disorders, stroke care, and neurological rehabilitation.',
    user: {
      name: 'Dr. David Park',
      email: 'david.park@example.com',
      phone: '+1-555-0126',
      profilePicture: '/api/placeholder/doctor4.jpg'
    },
    isActive: true,
    isVerified: true
  },
  {
    _id: '5',
    specialization: 'Orthopedics',
    experience: 14,
    consultationFee: 220,
    rating: { average: 4.5, count: 76 },
    bio: 'Orthopedic surgeon with expertise in joint replacement and sports medicine.',
    user: {
      name: 'Dr. Lisa Thompson',
      email: 'lisa.thompson@example.com',
      phone: '+1-555-0127',
      profilePicture: '/api/placeholder/doctor5.jpg'
    },
    isActive: true,
    isVerified: true
  },
  {
    _id: '6',
    specialization: 'Mental Health',
    experience: 8,
    consultationFee: 175,
    rating: { average: 4.8, count: 134 },
    bio: 'Psychiatrist and therapist specializing in anxiety, depression, and mental wellness.',
    user: {
      name: 'Dr. James Wilson',
      email: 'james.wilson@example.com',
      phone: '+1-555-0128',
      profilePicture: '/api/placeholder/doctor6.jpg'
    },
    isActive: true,
    isVerified: true
  }
];

const FALLBACK_SPECIALIZATIONS = [
  'Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Orthopedics', 
  'Mental Health', 'Gynecology', 'Oncology', 'Emergency Medicine', 
  'Family Medicine', 'Ophthalmology', 'Dentistry'
];

// Get all doctors with filtering and pagination
export const getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const { specialization, search, minRating, maxFee, sortBy, status, verified, name, email } = req.query;
    
    // Build filter object
    const filter = { isActive: true, isVerified: true };
    
    if (specialization) {
      filter.specialization = specialization;
    }
    if (status === 'active') filter.isActive = true;
    if (status === 'suspended') filter.isActive = false;
    if (verified === 'true') filter.isVerified = true;
    if (verified === 'false') filter.isVerified = false;
    
    if (minRating) {
      filter['rating.average'] = { $gte: parseFloat(minRating) };
    }
    
    if (maxFee) {
      filter.consultationFee = { $lte: parseFloat(maxFee) };
    }

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { specialization: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { 'rating.average': -1 };
        break;
      case 'fee-low':
        sort = { consultationFee: 1 };
        break;
      case 'fee-high':
        sort = { consultationFee: -1 };
        break;
      case 'experience':
        sort = { experience: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    let doctors, total;
    
    try {
      doctors = await Doctor.find({ ...filter, ...searchQuery })
        .populate('user', 'name email phone profilePicture')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .maxTimeMS(5000); // 5 second timeout

      // Optional name/email filtering (post-filter for demo)
      if (name) {
        const regex = new RegExp(name, 'i');
        doctors = doctors.filter(d => regex.test(d.user?.name || ''));
      }
      if (email) {
        const regex = new RegExp(email, 'i');
        doctors = doctors.filter(d => regex.test(d.user?.email || ''));
      }

      total = await Doctor.countDocuments({ ...filter, ...searchQuery }).maxTimeMS(5000);
      
    } catch (dbError) {
      // Fallback to sample data if DB operation fails
      console.log('🔄 Using fallback data due to DB timeout:', dbError.message);
      
      let fallbackDoctors = [...FALLBACK_DOCTORS];
      
      // Apply basic filtering to fallback data
      if (specialization) {
        fallbackDoctors = fallbackDoctors.filter(d => 
          d.specialization.toLowerCase() === specialization.toLowerCase()
        );
      }
      
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        fallbackDoctors = fallbackDoctors.filter(d => 
          searchRegex.test(d.specialization) || 
          searchRegex.test(d.bio) ||
          searchRegex.test(d.user.name)
        );
      }
      
      // Apply pagination to fallback data
      total = fallbackDoctors.length;
      doctors = fallbackDoctors.slice(skip, skip + limit);
    }

    res.json({
      doctors,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalDoctors: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({ message: 'Failed to get doctors', error: error.message });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone profilePicture')
      .populate('reviews.user', 'name');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!doctor.isActive) {
      return res.status(404).json({ message: 'Doctor profile is not available' });
    }

    res.json({ doctor });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({ message: 'Failed to get doctor', error: error.message });
  }
};

// Get doctor profile (for logged-in doctor)
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate('user', 'name email phone profilePicture');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({ doctor });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({ message: 'Failed to get doctor profile', error: error.message });
  }
};

// Update doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const {
      specialization,
      experience,
      education,
      certifications,
      bio,
      consultationFee,
      availableSlots,
      languages,
      hospitalAffiliations
    } = req.body;

    const updateData = {};
    if (specialization) updateData.specialization = specialization;
    if (experience !== undefined) updateData.experience = experience;
    if (education) updateData.education = education;
    if (certifications) updateData.certifications = certifications;
    if (bio) updateData.bio = bio;
    if (consultationFee !== undefined) updateData.consultationFee = consultationFee;
    if (availableSlots) updateData.availableSlots = availableSlots;
    if (languages) updateData.languages = languages;
    if (hospitalAffiliations) updateData.hospitalAffiliations = hospitalAffiliations;

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone profilePicture');

    res.json({
      message: 'Doctor profile updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Failed to update doctor profile', error: error.message });
  }
};

// Get doctor appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, date } = req.query;

    const filter = { doctor: req.doctor._id };
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(filter);

    res.json({
      appointments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAppointments: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ message: 'Failed to get doctor appointments', error: error.message });
  }
};

// Get doctor statistics
export const getDoctorStats = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({ doctor: req.doctor._id });
    const todayAppointments = await Appointment.countDocuments({
      doctor: req.doctor._id,
      appointmentDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });
    const completedAppointments = await Appointment.countDocuments({
      doctor: req.doctor._id,
      status: 'completed'
    });
    const pendingAppointments = await Appointment.countDocuments({
      doctor: req.doctor._id,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    // Calculate monthly earnings
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const monthlyEarnings = await Appointment.aggregate([
      {
        $match: {
          doctor: req.doctor._id,
          status: 'completed',
          appointmentDate: { $gte: currentMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$payment.amount' }
        }
      }
    ]);

    res.json({
      totalAppointments,
      todayAppointments,
      completedAppointments,
      pendingAppointments,
      monthlyEarnings: monthlyEarnings[0]?.totalEarnings || 0
    });
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({ message: 'Failed to get doctor statistics', error: error.message });
  }
};

// Get available time slots for a doctor
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    
    if (!doctorId || !date) {
      return res.status(400).json({ message: 'Doctor ID and date are required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Get doctor's available slots for the day
    const availableSlots = doctor.availableSlots.filter(slot => 
      slot.day === dayOfWeek && slot.isAvailable
    );

    // Get booked appointments for the date
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);

    // Filter out booked slots
    const freeSlots = availableSlots.filter(slot => 
      !bookedTimes.includes(slot.startTime)
    );

    res.json({ availableSlots: freeSlots });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Failed to get available slots', error: error.message });
  }
};

// Get specializations
export const getSpecializations = async (req, res) => {
  try {
    let specializations;
    
    try {
      specializations = await Doctor.distinct('specialization', { isActive: true })
        .maxTimeMS(5000);
    } catch (dbError) {
      // Fallback to predefined specializations if DB operation fails
      console.log('🔄 Using fallback specializations due to DB timeout:', dbError.message);
      specializations = FALLBACK_SPECIALIZATIONS;
    }
    
    res.json({ specializations });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({ message: 'Failed to get specializations', error: error.message });
  }
};

// Admin: update doctor active status
export const adminUpdateDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, isVerified } = req.body;
    const update = {};
    if (typeof isActive === 'boolean') update.isActive = isActive;
    if (typeof isVerified === 'boolean') update.isVerified = isVerified;

    const doctor = await Doctor.findByIdAndUpdate(id, update, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor updated', doctor });
  } catch (error) {
    console.error('Admin update doctor status error:', error);
    res.status(500).json({ message: 'Failed to update doctor', error: error.message });
  }
};

// Admin: delete doctor (soft delete by default)
export const adminDeleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard = 'false' } = req.query;

    // Block delete if upcoming appointments
    const hasUpcoming = await Appointment.countDocuments({ doctor: id, status: { $in: ['scheduled','confirmed'] }, appointmentDate: { $gte: new Date() } });
    if (hasUpcoming > 0) {
      return res.status(400).json({ message: 'Cannot delete doctor with upcoming appointments' });
    }

    if (hard === 'true') {
      await Doctor.findByIdAndDelete(id);
      return res.json({ message: 'Doctor permanently deleted' });
    }

    const doctor = await Doctor.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor suspended (soft deleted)', doctor });
  } catch (error) {
    console.error('Admin delete doctor error:', error);
    res.status(500).json({ message: 'Failed to delete doctor', error: error.message });
  }
};
