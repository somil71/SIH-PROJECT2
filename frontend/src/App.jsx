import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
// import { WebSocketProvider } from './context/WebSocketContext';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Doctors from './pages/Doctors.jsx';
import DoctorProfile from './pages/DoctorProfile.jsx';
import MyProfile from './pages/MyProfile.jsx';
import MyAppointments from './pages/MyAppointments.jsx';
import Appointment from './pages/Appointment.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminHome from './pages/AdminHome.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import ManageDoctors from './pages/admin/ManageDoctors.jsx';
import ManagePatients from './pages/admin/ManagePatients.jsx';
import AdminRoute from './components/routes/AdminRoute.jsx';
import SampleDoctor from './pages/SampleDoctor.jsx';
import Chat from './pages/Chat.jsx';
import VideoCall from './pages/VideoCall.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/routes/ProtectedRoute.jsx';
import DoctorRoute from './components/routes/DoctorRoute.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import RealTimeDemo from './components/RealTimeDemo.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import PaymentFailure from './pages/PaymentFailure.jsx';
import NeuralNetworkVisualization from './components/NeuralNetworkVisualization.jsx';
import AnatomyExplorer from './components/AnatomyExplorer.jsx';
import SecurityVisualization from './components/SecurityVisualization.jsx';
import HealthDashboardDemo from './pages/HealthDashboardDemo.jsx';

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <div className='mx-4 sm:mx-[10%]'>
          <Navbar />
          <Routes>
            {/* Auth routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/admin/login' element={<AdminLogin />} />

            {/* Public routes */}
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/doctors/:speciality' element={<Doctors />} />
            <Route path='/doctors' element={<Doctors />} />
            <Route path='/doctor/:id' element={<DoctorProfile />} />
            <Route path='/sample-doctor/:id' element={<SampleDoctor />} />
            <Route path='/chat' element={<Chat />} />
            <Route path='/video' element={<VideoCall />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/my-appointments' element={<MyAppointments />} />
            <Route path='/appointment/:doctorId' element={<Appointment />} />
            <Route path='/payment/success' element={<PaymentSuccess />} />
            <Route path='/payment/failure' element={<PaymentFailure />} />
            <Route path='/admin' element={<AdminHome />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/admin/doctors' element={<ManageDoctors />} />
            <Route path='/admin/patients' element={<ManagePatients />} />
            <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
            <Route path='/patient/dashboard' element={<PatientDashboard />} />
            <Route path='/patient/*' element={<PatientDashboard />} />
            <Route path='/demo' element={<RealTimeDemo />} />
            
            {/* Advanced Demo Routes */}
            <Route path='/demo/neural-network' element={<NeuralNetworkVisualization />} />
            <Route path='/demo/health-dashboard' element={<HealthDashboardDemo />} />
            <Route path='/demo/3d-anatomy' element={<AnatomyExplorer />} />
            <Route path='/demo/security' element={<SecurityVisualization />} />
          </Routes>
          <Footer />
        </div>
        </AppProvider>
    </AuthProvider>
  );
};

export default App;
