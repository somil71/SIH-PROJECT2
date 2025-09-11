import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'General Physician',
      'Cardiologist',
      'Dermatologist',
      'Gastroenterologist',
      'Gynecologist',
      'Neurologist',
      'Pediatrician',
      'Psychiatrist',
      'Orthopedist',
      'Ophthalmologist',
      'ENT Specialist',
      'Urologist',
      'Oncologist',
      'Radiologist',
      'Anesthesiologist'
    ]
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    date: Date
  }],
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  availableSlots: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  languages: [{
    type: String
  }],
  hospitalAffiliations: [{
    name: String,
    address: String,
    position: String
  }]
}, {
  timestamps: true
});

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
  return this.user ? `${this.user.name}` : '';
});

// Virtual for email
doctorSchema.virtual('email').get(function() {
  return this.user ? this.user.email : '';
});

// Virtual for phone
doctorSchema.virtual('phone').get(function() {
  return this.user ? this.user.phone : '';
});

// Ensure virtual fields are serialized
doctorSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Doctor', doctorSchema);
