import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { doctorAPI } from '../utils/api';
import { dummyDoctors } from '../data/dummyData';
import Footer from '../components/Footer';
import groupProfile from '../assets/assets_frontend/group_profiles.png';

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors, setDoctors, setLoading, setError, filters, setFilters, specializations, setSpecializations } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    let isActive = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [doctorsData, specializationsData] = await Promise.all([
          doctorAPI.getAllDoctors({
            page: currentPage,
            limit: 12,
            specialization: speciality || filters.specialization,
            search: searchTerm || filters.search,
            minRating: filters.minRating,
            maxFee: filters.maxFee,
            sortBy: filters.sortBy
          }),
          doctorAPI.getSpecializations()
        ]);
        
        if (!isActive) return;
        setDoctors(doctorsData.doctors);
        setPagination(doctorsData.pagination);
        setSpecializations(specializationsData.specializations);
      } catch (error) {
        if (isActive) setError('Failed to load doctors');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchData();
    return () => { isActive = false };
  }, [currentPage, speciality, filters, searchTerm, setDoctors, setLoading, setError, setSpecializations]);

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed === filters.search) return; // prevent duplicate fetch
    setFilters({ search: trimmed });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      specialization: '',
      search: '',
      minRating: '',
      maxFee: '',
      sortBy: 'newest'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleViewDoctor = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/appointment/${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {speciality ? `${speciality} Doctors` : 'All Doctors'}
          </h1>
          <p className="text-xl text-gray-600">
            Find and book appointments with qualified healthcare professionals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={filters.specialization}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Rating
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Fee (₹)
              </label>
              <input
                type="number"
                placeholder="e.g., 1000"
                value={filters.maxFee}
                onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="fee-low">Fee: Low to High</option>
                <option value="fee-high">Fee: High to Low</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All Filters
            </button>
            <div className="text-sm text-gray-600">
              {pagination.totalDoctors} doctors found
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {doctors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      {/* If you want to insert your own image, replace src below */}
                      <img src={doctor.user?.profilePicture || groupProfile} alt={doctor.user?.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Dr. {doctor.user?.name}
                        </h3>
                        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                        <p className="text-gray-500 text-sm">Senior Consultant</p>
                        <p className="text-gray-600 text-sm">
                          {doctor.experience} years experience
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(doctor.rating?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {doctor.rating?.average || 0} ({doctor.rating?.count || 0} reviews)
                        </span>
                      </div>
                      
                      {doctor.bio && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {doctor.bio}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{doctor.consultationFee}
                      </div>
                      <div className="text-sm text-gray-600">
                        per consultation
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDoctor(doctor._id)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleBookAppointment(doctor._id)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 border rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={!pagination.hasNext}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No doctors found. Showing sample doctors.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 cursor-pointer" onClick={() => navigate(`/sample-doctor/${i}`)}>
                  {/* Replace with your asset path */}
                  <img src="/path/to/your/asset.png" alt={`Doctor ${i}`} className="w-16 h-16 rounded-full object-cover mb-3 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-900">Dr. Sample {i}</h3>
                  <p className="text-blue-600">General Physician</p>
                  <p className="text-gray-500">Senior Consultant</p>
                </div>
              ))}
            </div>
            <button
              onClick={clearFilters}
              className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters to see all doctors
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;