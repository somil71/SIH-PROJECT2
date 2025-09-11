# Doctor Appointment System

A full-stack web application for booking doctor appointments with a modern, responsive interface.

## Features

### For Patients
- **User Registration & Authentication**: Secure signup and login system
- **Doctor Discovery**: Browse doctors by specialization, rating, and location
- **Advanced Search & Filtering**: Find doctors based on multiple criteria
- **Appointment Booking**: Book appointments with available time slots
- **Appointment Management**: View, cancel, and manage appointments
- **Profile Management**: Update personal information and preferences
- **Review System**: Rate and review doctors after appointments
- **Prescription Management**: View prescriptions and medical records

### For Doctors
- **Doctor Registration**: Complete profile setup with credentials
- **Profile Management**: Update professional information
- **Appointment Management**: View and manage patient appointments
- **Patient Records**: Access patient medical history
- **Prescription Management**: Create and manage prescriptions
- **Availability Management**: Set available time slots

### General Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live appointment status updates
- **Secure Authentication**: JWT-based authentication system
- **Data Validation**: Comprehensive input validation
- **Error Handling**: User-friendly error messages
- **Modern UI/UX**: Clean, intuitive interface with Tailwind CSS

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: Frontend framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling framework
- **Context API**: State management
- **Axios**: HTTP client (via fetch API)

## Project Structure

```
SIH-PROJECT2/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── config.env          # Environment variables
│   └── server.js           # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/doctor-appointment-system
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017`

5. **Start the server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/register-doctor` - Doctor registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/appointments` - Get user appointments
- `GET /api/users/stats` - Get user statistics

### Doctors
- `GET /api/doctors` - Get all doctors (with filtering)
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/specializations` - Get all specializations
- `GET /api/doctors/:id/available-slots` - Get available time slots
- `GET /api/doctors/profile/me` - Get doctor profile
- `PUT /api/doctors/profile/me` - Update doctor profile

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `POST /api/appointments/:id/review` - Add review

## Database Models

### User Model
- Personal information (name, email, phone, gender, DOB)
- Address information
- Profile picture
- Account status and verification

### Doctor Model
- Professional information (specialization, experience)
- Education and certifications
- Consultation fees and availability
- Ratings and reviews
- Hospital affiliations

### Appointment Model
- Patient and doctor references
- Appointment date and time
- Consultation type and reason
- Medical information (symptoms, history)
- Prescription and notes
- Payment information
- Status tracking

## Usage Guide

### For Patients

1. **Registration**: Create an account with personal details
2. **Browse Doctors**: Use the doctors page to find healthcare providers
3. **Filter & Search**: Use filters to narrow down your search
4. **View Doctor Profile**: Check doctor details, reviews, and availability
5. **Book Appointment**: Select date, time, and provide medical information
6. **Manage Appointments**: View, cancel, or reschedule appointments
7. **Add Reviews**: Rate and review doctors after appointments

### For Doctors

1. **Doctor Registration**: Sign up as a doctor with professional credentials
2. **Complete Profile**: Add education, certifications, and availability
3. **Manage Appointments**: View and manage patient appointments
4. **Update Information**: Keep profile and availability current
5. **Patient Care**: Access patient records and create prescriptions

## Development

### Adding New Features

1. **Backend**: Add routes, controllers, and models as needed
2. **Frontend**: Create components and update context
3. **Database**: Update models and migrations
4. **Testing**: Test all functionality thoroughly

### Code Style

- Use consistent naming conventions
- Add comments for complex logic
- Follow React best practices
- Use meaningful variable names
- Implement proper error handling

## Deployment

### Backend Deployment
1. Set up production environment variables
2. Use a process manager like PM2
3. Set up MongoDB Atlas or similar cloud database
4. Configure reverse proxy (nginx)
5. Set up SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables
4. Set up custom domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Future Enhancements

- **Video Consultations**: Integrate video calling functionality
- **Payment Integration**: Add payment gateway integration
- **Mobile App**: Develop native mobile applications
- **AI Recommendations**: Implement AI-based doctor recommendations
- **Telemedicine**: Expand telemedicine capabilities
- **Analytics Dashboard**: Add comprehensive analytics
- **Multi-language Support**: Internationalization
- **Advanced Scheduling**: Recurring appointments and reminders
