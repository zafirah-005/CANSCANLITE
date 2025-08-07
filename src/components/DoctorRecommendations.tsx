import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  ExternalLink,
  Search,
  Filter,
  UserCheck,
  Stethoscope
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  address: string;
  phone: string;
  distance: number;
  availability: string;
  languages: string[];
  acceptsInsurance: boolean;
  consultationFee: string;
  lat: number;
  lng: number;
}

const DoctorRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'experience'>('distance');

  const specialties = [
    'General Practice',
    'Oncology',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Psychiatry',
    'Radiology'
  ];

  // Mock data - in real app, this would come from an API based on user's location
  const mockDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Oncology',
      rating: 4.8,
      experience: 15,
      address: '123 Medical Center Dr, London SW1A 1AA',
      phone: '+44 20 7946 0958',
      distance: 2.3,
      availability: 'Available today',
      languages: ['English', 'French'],
      acceptsInsurance: true,
      consultationFee: '£150',
      lat: 51.5074,
      lng: -0.1278
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'General Practice',
      rating: 4.6,
      experience: 12,
      address: '456 Health Plaza, London W1K 6PU',
      phone: '+44 20 7946 0959',
      distance: 1.8,
      availability: 'Next available: Tomorrow',
      languages: ['English', 'Mandarin'],
      acceptsInsurance: true,
      consultationFee: '£80',
      lat: 51.5155,
      lng: -0.1426
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      rating: 4.9,
      experience: 18,
      address: '789 Specialist Clinic, London EC1A 1BB',
      phone: '+44 20 7946 0960',
      distance: 3.1,
      availability: 'Available this week',
      languages: ['English', 'Spanish'],
      acceptsInsurance: false,
      consultationFee: '£200',
      lat: 51.4994,
      lng: -0.1245
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialty: 'Cardiology',
      rating: 4.7,
      experience: 20,
      address: '321 Heart Center, London NW1 2BU',
      phone: '+44 20 7946 0961',
      distance: 4.2,
      availability: 'Next available: Next week',
      languages: ['English'],
      acceptsInsurance: true,
      consultationFee: '£180',
      lat: 51.5186,
      lng: -0.1426
    },
    {
      id: '5',
      name: 'Dr. Priya Patel',
      specialty: 'Oncology',
      rating: 4.8,
      experience: 14,
      address: '654 Cancer Care Center, London SE1 9RT',
      phone: '+44 20 7946 0962',
      distance: 2.9,
      availability: 'Available today',
      languages: ['English', 'Hindi', 'Gujarati'],
      acceptsInsurance: true,
      consultationFee: '£160',
      lat: 51.4975,
      lng: -0.1357
    }
  ];

  useEffect(() => {
    // In a real app, you would fetch doctors based on user's location
    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  useEffect(() => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'distance':
        default:
          return a.distance - b.distance;
      }
    });

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, selectedSpecialty, sortBy]);

  const openInGoogleMaps = (doctor: Doctor) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${doctor.lat},${doctor.lng}`;
    window.open(url, '_blank');
  };

  const callDoctor = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes('today')) return 'text-green-600 bg-green-100';
    if (availability.includes('Tomorrow')) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.05)), url('https://social-innovation.hitachi/-/media/project/hitachi/sib/en-in/knowledge-hub/collaborate/health-sector-for-inclusive-healthcare/images/articlepagetitleimage_sp.jpg')`
      }}
    >
      {/* Header */}
      <div className="glassmorphic p-4 mb-6 slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </button>
            <h1 
              className="text-2xl font-bold text-blue-900"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Find Doctors
            </h1>
          </div>
          <div className="text-sm text-blue-700" style={{ fontFamily: 'Times New Roman, serif' }}>
            {user?.area && `Near ${user.area}`}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glassmorphic p-4 mb-6 slide-up">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: 'Times New Roman, serif' }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-3 py-2 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                <option value="all">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating' | 'experience')}
              className="px-3 py-2 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="experience">Sort by Experience</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="glassmorphic p-4 mb-6 slide-up">
        <p 
          className="text-blue-700"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Found {filteredDoctors.length} doctors
          {selectedSpecialty !== 'all' && ` specializing in ${selectedSpecialty}`}
          {user?.area && ` near ${user.area}`}
        </p>
      </div>

      {/* Doctor Cards */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredDoctors.length === 0 ? (
          <div className="glassmorphic p-8 text-center slide-up">
            <UserCheck className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 
              className="text-xl font-bold text-blue-900 mb-2"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              No Doctors Found
            </h3>
            <p 
              className="text-blue-700"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Try adjusting your search criteria or specialty filter.
            </p>
          </div>
        ) : (
          filteredDoctors.map((doctor, index) => (
            <div 
              key={doctor.id} 
              className="glassmorphic p-6 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                {/* Doctor Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Stethoscope className="w-6 h-6 text-blue-600" />
                        <h3 
                          className="text-xl font-bold text-blue-900"
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {doctor.name}
                        </h3>
                      </div>
                      
                      <p 
                        className="text-blue-700 font-medium mb-1"
                        style={{ fontFamily: 'Times New Roman, serif' }}
                      >
                        {doctor.specialty}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-blue-600">
                        <div className="flex items-center space-x-1">
                          {renderStars(doctor.rating)}
                          <span style={{ fontFamily: 'Times New Roman, serif' }}>
                            {doctor.rating}
                          </span>
                        </div>
                        <span style={{ fontFamily: 'Times New Roman, serif' }}>
                          {doctor.experience} years exp.
                        </span>
                        <span style={{ fontFamily: 'Times New Roman, serif' }}>
                          {doctor.distance} km away
                        </span>
                      </div>
                    </div>
                    
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(doctor.availability)}`}
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      {doctor.availability}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <p 
                          className="text-blue-700 text-sm"
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {doctor.address}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <p 
                          className="text-blue-700 text-sm"
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {doctor.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p 
                        className="text-blue-700 text-sm"
                        style={{ fontFamily: 'Times New Roman, serif' }}
                      >
                        <strong>Languages:</strong> {doctor.languages.join(', ')}
                      </p>
                      
                      <p 
                        className="text-blue-700 text-sm"
                        style={{ fontFamily: 'Times New Roman, serif' }}
                      >
                        <strong>Consultation:</strong> {doctor.consultationFee}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${
                            doctor.acceptsInsurance 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {doctor.acceptsInsurance ? 'Accepts Insurance' : 'Private Pay'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => callDoctor(doctor.phone)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span style={{ fontFamily: 'Times New Roman, serif' }}>Call</span>
                    </button>
                    
                    <button
                      onClick={() => openInGoogleMaps(doctor)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span style={{ fontFamily: 'Times New Roman, serif' }}>Directions</span>
                    </button>
                    
                    <button
                      onClick={() => alert(`Booking feature coming soon for ${doctor.name}`)}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      <span style={{ fontFamily: 'Times New Roman, serif' }}>Book Appointment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Emergency Note */}
      <div className="glassmorphic p-4 mt-6 text-center slide-up">
        <p 
          className="text-red-600 font-bold mb-2"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Medical Emergency: Call 999 immediately
        </p>
        <p 
          className="text-sm text-blue-700"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          This directory is for non-emergency consultations. In case of medical emergency, 
          contact emergency services immediately.
        </p>
      </div>
    </div>
  );
};

export default DoctorRecommendations;