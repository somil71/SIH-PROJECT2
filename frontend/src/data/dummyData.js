// Dummy data for development and testing

export const dummyDoctors = [
  {
    _id: '1',
    user: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      profilePicture: '/doc1.png'
    },
    specialization: 'Cardiology',
    experience: 15,
    consultationFee: 1500,
    rating: {
      average: 4.8,
      count: 120
    },
    bio: 'Experienced cardiologist with expertise in interventional cardiology and heart disease prevention.',
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: '2005' },
      { degree: 'MD Cardiology', institution: 'PGI Chandigarh', year: '2010' }
    ],
    isVerified: true,
    isActive: true
  },
  {
    _id: '2',
    user: {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      profilePicture: '/doc2.png'
    },
    specialization: 'Pediatrics',
    experience: 12,
    consultationFee: 1200,
    rating: {
      average: 4.9,
      count: 95
    },
    bio: 'Dedicated pediatrician specializing in child development and preventive care.',
    education: [
      { degree: 'MBBS', institution: 'KEM Hospital Mumbai', year: '2008' },
      { degree: 'MD Pediatrics', institution: 'AIIMS Delhi', year: '2012' }
    ],
    isVerified: true,
    isActive: true
  },
  {
    _id: '3',
    user: {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      profilePicture: '/doc3.png'
    },
    specialization: 'Orthopedics',
    experience: 18,
    consultationFee: 2000,
    rating: {
      average: 4.7,
      count: 150
    },
    bio: 'Orthopedic surgeon with expertise in joint replacement and sports medicine.',
    education: [
      { degree: 'MBBS', institution: 'CMC Vellore', year: '2002' },
      { degree: 'MS Orthopedics', institution: 'AIIMS Delhi', year: '2006' }
    ],
    isVerified: true,
    isActive: true
  },
  {
    _id: '4',
    user: {
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      profilePicture: '/doc4.png'
    },
    specialization: 'Dermatology',
    experience: 10,
    consultationFee: 1000,
    rating: {
      average: 4.6,
      count: 80
    },
    bio: 'Dermatologist specializing in cosmetic dermatology and skin cancer treatment.',
    education: [
      { degree: 'MBBS', institution: 'KEM Hospital Mumbai', year: '2010' },
      { degree: 'MD Dermatology', institution: 'PGI Chandigarh', year: '2014' }
    ],
    isVerified: false,
    isActive: true
  },
  {
    _id: '5',
    user: {
      name: 'David Lee',
      email: 'david.lee@example.com',
      profilePicture: '/doc5.png'
    },
    specialization: 'Neurology',
    experience: 20,
    consultationFee: 2500,
    rating: {
      average: 4.9,
      count: 200
    },
    bio: 'Neurologist with extensive experience in stroke treatment and movement disorders.',
    education: [
      { degree: 'MBBS', institution: 'AIIMS Delhi', year: '2000' },
      { degree: 'DM Neurology', institution: 'NIMHANS Bangalore', year: '2005' }
    ],
    isVerified: true,
    isActive: false
  }
];

export const dummyPatients = [
  {
    _id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+91 98765 43210',
    profilePicture: '/profile_pic.png',
    dateOfBirth: '1985-03-15',
    gender: 'Female',
    bloodGroup: 'O+',
    height: '165 cm',
    weight: '60 kg',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001'
    },
    medicalHistory: [
      {
        condition: 'Hypertension',
        status: 'Controlled',
        doctor: 'Dr. John Smith',
        date: '2023-01-15'
      }
    ],
    allergies: [
      {
        allergen: 'Penicillin',
        severity: 'Moderate',
        reaction: 'Skin rash'
      }
    ],
    currentMedications: [
      {
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily'
      }
    ],
    totalAppointments: 12,
    completedAppointments: 10,
    isActive: true,
    isEmailVerified: true
  },
  {
    _id: '2',
    name: 'Robert Chen',
    email: 'robert.chen@example.com',
    phone: '+91 98765 43211',
    profilePicture: '/profile_pic.png',
    dateOfBirth: '1978-07-22',
    gender: 'Male',
    bloodGroup: 'A+',
    height: '175 cm',
    weight: '75 kg',
    address: {
      street: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001'
    },
    medicalHistory: [
      {
        condition: 'Diabetes Type 2',
        status: 'Well controlled',
        doctor: 'Dr. Sarah Wilson',
        date: '2023-02-10'
      }
    ],
    allergies: [],
    currentMedications: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily'
      }
    ],
    totalAppointments: 8,
    completedAppointments: 7,
    isActive: true,
    isEmailVerified: true
  },
  {
    _id: '3',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '+91 98765 43212',
    profilePicture: '/profile_pic.png',
    dateOfBirth: '1992-11-08',
    gender: 'Female',
    bloodGroup: 'B+',
    height: '160 cm',
    weight: '55 kg',
    address: {
      street: '789 Oak Street',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001'
    },
    medicalHistory: [],
    allergies: [
      {
        allergen: 'Shellfish',
        severity: 'Severe',
        reaction: 'Anaphylaxis'
      }
    ],
    currentMedications: [],
    totalAppointments: 3,
    completedAppointments: 3,
    isActive: true,
    isEmailVerified: false
  },
  {
    _id: '4',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '+91 98765 43213',
    profilePicture: '/profile_pic.png',
    dateOfBirth: '1965-12-03',
    gender: 'Male',
    bloodGroup: 'AB+',
    height: '180 cm',
    weight: '85 kg',
    address: {
      street: '321 Pine Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001'
    },
    medicalHistory: [
      {
        condition: 'Arthritis',
        status: 'Chronic',
        doctor: 'Dr. Michael Brown',
        date: '2022-11-20'
      }
    ],
    allergies: [],
    currentMedications: [
      {
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'As needed'
      }
    ],
    totalAppointments: 15,
    completedAppointments: 12,
    isActive: false,
    isEmailVerified: true
  }
];

export const dummyAdminStats = {
  totalDoctors: 25,
  totalPatients: 1250,
  totalAppointments: 3450,
  revenue: {
    total: 2500000,
    thisMonth: 450000,
    lastMonth: 380000
  }
};

// Dynamic stats function for dashboards
export const getDynamicStats = () => ({
  totalAppointments: Math.floor(Math.random() * 100) + 200,
  completedAppointments: Math.floor(Math.random() * 80) + 150,
  pendingAppointments: Math.floor(Math.random() * 20) + 10,
  totalRevenue: Math.floor(Math.random() * 50000) + 100000,
  activeDoctors: Math.floor(Math.random() * 10) + 15,
  newPatients: Math.floor(Math.random() * 20) + 30
});

// Live activities for dashboard
export const getLiveActivities = () => [
  {
    id: 1,
    type: 'appointment',
    message: 'New appointment booked with Dr. John Smith',
    time: '2 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'payment',
    message: 'Payment received for consultation fee',
    time: '5 minutes ago',
    status: 'success'
  },
  {
    id: 3,
    type: 'registration',
    message: 'New patient registered: Alice Johnson',
    time: '10 minutes ago',
    status: 'info'
  },
  {
    id: 4,
    type: 'cancellation',
    message: 'Appointment cancelled by patient',
    time: '15 minutes ago',
    status: 'warning'
  }
];

// Testimonials data
export const dummyTestimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Excellent service! The doctor was very professional and helpful.',
    image: '/profile_pic.png'
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    text: 'Quick and efficient appointment booking. Highly recommended!',
    image: '/profile_pic.png'
  },
  {
    id: 3,
    name: 'Emily Davis',
    rating: 4,
    text: 'Great platform for healthcare services. Very user-friendly.',
    image: '/profile_pic.png'
  }
];

// Appointments data
export const dummyAppointments = [
  {
    id: 1,
    patientId: '1',
    doctorId: '1',
    doctorName: 'Dr. John Smith',
    specialization: 'Cardiology',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'confirmed',
    type: 'consultation',
    fee: 1500
  },
  {
    id: 2,
    patientId: '2',
    doctorId: '2',
    doctorName: 'Dr. Sarah Wilson',
    specialization: 'Pediatrics',
    date: '2024-01-16',
    time: '2:00 PM',
    status: 'pending',
    type: 'follow-up',
    fee: 1200
  },
  {
    id: 3,
    patientId: '3',
    doctorId: '3',
    doctorName: 'Dr. Michael Brown',
    specialization: 'Orthopedics',
    date: '2024-01-17',
    time: '11:00 AM',
    status: 'completed',
    type: 'consultation',
    fee: 2000
  }
];

// Generate available time slots for doctors
export const generateAvailableSlots = (doctorId, date) => {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      available: Math.random() > 0.3,
      doctorId,
      date
    });
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:30`,
      available: Math.random() > 0.3,
      doctorId,
      date
    });
  }
  
  return slots;
};

// Video call sessions
export const dummyVideoCallSessions = [
  {
    id: 1,
    doctorId: '1',
    patientId: '1',
    status: 'active',
    startTime: new Date(),
    duration: 0
  }
];

// Chat messages
export const dummyChatMessages = [
  {
    id: 1,
    roomId: 'room1',
    senderId: '1',
    senderName: 'Dr. John Smith',
    message: 'Hello! How can I help you today?',
    timestamp: new Date(),
    type: 'text'
  },
  {
    id: 2,
    roomId: 'room1',
    senderId: '2',
    senderName: 'Alice Johnson',
    message: 'I have been experiencing chest pain recently.',
    timestamp: new Date(),
    type: 'text'
  }
];

// Get doctor by ID
export const getDoctorById = (id) => {
  return dummyDoctors.find(doctor => doctor._id === id);
};