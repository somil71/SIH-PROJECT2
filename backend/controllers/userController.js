import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
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
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Failed to get user profile', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, gender, dateOfBirth, address } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    // This would typically use multer middleware
    // For now, we'll just update the profile picture URL
    const { profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture },
      { new: true }
    );

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
  }
};

// Get user appointments
export const getUserAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'specialization consultationFee')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments({ patient: req.user._id });

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
    console.error('Get user appointments error:', error);
    res.status(500).json({ message: 'Failed to get appointments', error: error.message });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({ patient: req.user._id });
    const completedAppointments = await Appointment.countDocuments({ 
      patient: req.user._id, 
      status: 'completed' 
    });
    const upcomingAppointments = await Appointment.countDocuments({ 
      patient: req.user._id, 
      status: { $in: ['scheduled', 'confirmed'] },
      appointmentDate: { $gte: new Date() }
    });

    res.json({
      totalAppointments,
      completedAppointments,
      upcomingAppointments,
      cancelledAppointments: totalAppointments - completedAppointments - upcomingAppointments
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Failed to get user statistics', error: error.message });
  }
};

// Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    // Check if user has any upcoming appointments
    const upcomingAppointments = await Appointment.countDocuments({
      patient: req.user._id,
      status: { $in: ['scheduled', 'confirmed'] },
      appointmentDate: { $gte: new Date() }
    });

    if (upcomingAppointments > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete account with upcoming appointments. Please cancel them first.' 
      });
    }

    // Deactivate user account instead of deleting
    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Delete user account error:', error);
    res.status(500).json({ message: 'Failed to delete account', error: error.message });
  }
};

// Admin: list patients/users
export const adminListUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search
      ? { $or: [ { name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } } ] }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password'),
      User.countDocuments(filter)
    ]);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Admin list users error:', error);
    res.status(500).json({ message: 'Failed to list users', error: error.message });
  }
};

// Admin: update user active status
export const adminUpdateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const update = {};
    if (typeof isActive === 'boolean') update.isActive = isActive;
    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (error) {
    console.error('Admin update user status error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};
