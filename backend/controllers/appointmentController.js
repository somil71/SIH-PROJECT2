import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

// Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      symptoms,
      medicalHistory,
      currentMedications,
      allergies,
      consultationType = 'in-person'
    } = req.body;

    // Check if doctor exists and is active
    const doctor = await Doctor.findById(doctorId).populate('user');
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ message: 'Doctor not found or inactive' });
    }

    // Check if appointment date is in the future
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({ message: 'Appointment date must be in the future' });
    }

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      symptoms,
      medicalHistory,
      currentMedications,
      allergies,
      consultationType,
      payment: {
        amount: doctor.consultationFee
      }
    });

    await appointment.save();

    // Populate the appointment with doctor and patient details
    await appointment.populate([
      { path: 'doctor', populate: { path: 'user', select: 'name email phone' } },
      { path: 'patient', select: 'name email phone' }
    ]);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has access to this appointment
    if (appointment.patient._id.toString() !== req.user._id.toString()) {
      // Check if user is the doctor
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || appointment.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({ message: 'Failed to get appointment', error: error.message });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const { status, notes, prescription, cancellationReason } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    const isPatient = appointment.patient.toString() === req.user._id.toString();
    const doctor = await Doctor.findOne({ user: req.user._id });
    const isDoctor = doctor && appointment.doctor.toString() === doctor._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = {};
    
    // Only doctor can update status, notes, and prescription
    if (isDoctor) {
      if (status) updateData.status = status;
      if (notes) updateData.notes = notes;
      if (prescription) updateData.prescription = prescription;
    }

    // Both patient and doctor can cancel
    if (status === 'cancelled') {
      updateData.status = 'cancelled';
      updateData.cancelledAt = new Date();
      updateData.cancelledBy = isPatient ? 'patient' : 'doctor';
      if (cancellationReason) updateData.cancellationReason = cancellationReason;
    }

    // Patient can only update their own appointment details before confirmation
    if (isPatient && appointment.status === 'scheduled') {
      const { reason, symptoms, medicalHistory, currentMedications, allergies } = req.body;
      if (reason) updateData.reason = reason;
      if (symptoms) updateData.symptoms = symptoms;
      if (medicalHistory) updateData.medicalHistory = medicalHistory;
      if (currentMedications) updateData.currentMedications = currentMedications;
      if (allergies) updateData.allergies = allergies;
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'patient', select: 'name email phone' },
      { path: 'doctor', populate: { path: 'user', select: 'name email phone' } }
    ]);

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if appointment can be cancelled
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed appointment' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    // Check permissions
    const isPatient = appointment.patient.toString() === req.user._id.toString();
    const doctor = await Doctor.findOne({ user: req.user._id });
    const isDoctor = doctor && appointment.doctor.toString() === doctor._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check cancellation policy (e.g., cannot cancel within 24 hours)
    const appointmentDateTime = new Date(`${appointment.appointmentDate.toISOString().split('T')[0]}T${appointment.appointmentTime}`);
    const hoursUntilAppointment = (appointmentDateTime - new Date()) / (1000 * 60 * 60);
    
    if (hoursUntilAppointment < 24) {
      return res.status(400).json({ 
        message: 'Cannot cancel appointment within 24 hours of scheduled time' 
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: isPatient ? 'patient' : 'doctor',
        cancellationReason
      },
      { new: true }
    ).populate([
      { path: 'patient', select: 'name email phone' },
      { path: 'doctor', populate: { path: 'user', select: 'name email phone' } }
    ]);

    res.json({
      message: 'Appointment cancelled successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
};

// Get all appointments (for admin)
export const getAllAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, date, doctorId, patientId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.appointmentDate = { $gte: startDate, $lt: endDate };
    }
    if (doctorId) filter.doctor = doctorId;
    if (patientId) filter.patient = patientId;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
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
    console.error('Get all appointments error:', error);
    res.status(500).json({ message: 'Failed to get appointments', error: error.message });
  }
};

// Add review to appointment
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the patient
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the patient can add a review' });
    }

    // Check if appointment is completed
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed appointments' });
    }

    // Check if review already exists
    if (appointment.reviews && appointment.reviews.length > 0) {
      return res.status(400).json({ message: 'Review already exists for this appointment' });
    }

    // Add review to appointment
    appointment.reviews = [{
      user: req.user._id,
      rating,
      comment,
      date: new Date()
    }];

    await appointment.save();

    // Update doctor's rating
    const doctor = await Doctor.findById(appointment.doctor);
    if (doctor) {
      const allReviews = await Appointment.find({
        doctor: appointment.doctor,
        'reviews.0': { $exists: true }
      });

      const totalRating = allReviews.reduce((sum, apt) => sum + apt.reviews[0].rating, 0);
      const averageRating = totalRating / allReviews.length;

      doctor.rating = {
        average: Math.round(averageRating * 10) / 10,
        count: allReviews.length
      };

      await doctor.save();
    }

    res.json({
      message: 'Review added successfully',
      appointment
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
};
