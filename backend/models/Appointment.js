import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  duration: {
    type: Number,
    default: 30, // in minutes
    min: [15, 'Duration must be at least 15 minutes'],
    max: [120, 'Duration cannot exceed 120 minutes']
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  consultationType: {
    type: String,
    enum: ['in-person', 'video', 'phone'],
    default: 'in-person'
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  symptoms: {
    type: String,
    maxlength: [1000, 'Symptoms description cannot be more than 1000 characters']
  },
  medicalHistory: {
    type: String,
    maxlength: [1000, 'Medical history cannot be more than 1000 characters']
  },
  currentMedications: {
    type: String,
    maxlength: [500, 'Current medications cannot be more than 500 characters']
  },
  allergies: {
    type: String,
    maxlength: [500, 'Allergies description cannot be more than 500 characters']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    instructions: String,
    followUpDate: Date
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'netbanking'],
      default: 'card'
    },
    transactionId: String,
    paidAt: Date
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      required: true
    },
    sentAt: Date,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }],
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: {
    type: String,
    enum: ['patient', 'doctor', 'admin']
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.appointmentDate.toLocaleDateString();
});

// Virtual for formatted time
appointmentSchema.virtual('formattedTime').get(function() {
  return this.appointmentTime;
});

// Ensure virtual fields are serialized
appointmentSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Appointment', appointmentSchema);
