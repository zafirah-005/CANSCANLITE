import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Scan, 
  FileText, 
  Settings, 
  Info, 
  MapPin, 
  LogOut,
  Heart,
  User,
  Pill,
  Activity,
  UserCheck
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const extractDisplayName = (email: string): string => {
    // Use the actual name from profile if available
    return user?.name || email.split('@')[0].replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFeatureClick = (feature: string) => {
    switch (feature) {
      case 'Cancer Risk Scan':
        navigate('/cancer-scan');
        break;
      case 'My Results':
        navigate('/results-history');
        break;
      case 'Medication Tracker':
        navigate('/medication-tracker');
        break;
      case 'Symptom Tracker':
        navigate('/symptom-tracker');
        break;
      case 'Doctor Recommendations':
        navigate('/doctor-recommendations');
        break;
      default:
        console.log(`${feature} feature`);
    }
  };

  if (!user) return null;

  const displayName = extractDisplayName(user.email);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.03), rgba(96, 165, 250, 0.03)), url('https://images.squarespace-cdn.com/content/v1/5fcf15b21d0df60ade61c345/1611079009676-M03IJ68LT1J6Z3MRIUOQ/AOS.jpg')`
      }}
    >
      {/* Header */}
      <div className="glassmorphic p-6 mb-6 slide-up">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-blue-600" />
            <h1 
              className="text-2xl font-bold text-blue-900"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              CanScan Lite
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>Logout</span>
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="glassmorphic p-8 mb-6 text-center slide-up">
        <div className="flex justify-center mb-4">
          <User className="w-16 h-16 text-blue-600" />
        </div>
        <h2 
          className="text-3xl font-bold text-blue-900 mb-2"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Welcome, {user.name}
        </h2>
        <p 
          className="text-lg text-blue-700"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          {user.email} • Age: {user.age} • {user.area}
        </p>
        <p 
          className="text-sm text-blue-600 mt-2"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Your comprehensive medical screening platform
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div 
          className="feature-card text-center slide-up"
          onClick={() => handleFeatureClick('Cancer Risk Scan')}
          style={{ animationDelay: '0.1s' }}
        >
          <Scan className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 
            className="text-xl font-bold text-blue-900 mb-2"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Scan for Cancer Risk
          </h3>
          <p 
            className="text-blue-700"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Advanced AI-powered screening for early detection
          </p>
        </div>

        <div 
          className="feature-card text-center slide-up"
          onClick={() => handleFeatureClick('Medication Tracker')}
          style={{ animationDelay: '0.2s' }}
        >
          <Pill className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 
            className="text-xl font-bold text-blue-900 mb-2"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Medication Tracker
          </h3>
          <p 
            className="text-blue-700"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Track medications and allergies
          </p>
        </div>

        <div 
          className="feature-card text-center slide-up"
          onClick={() => handleFeatureClick('Symptom Tracker')}
          style={{ animationDelay: '0.3s' }}
        >
          <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 
            className="text-xl font-bold text-blue-900 mb-2"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Symptom Tracker
          </h3>
          <p 
            className="text-blue-700"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Monitor symptoms and trends
          </p>
        </div>

        <div 
          className="feature-card text-center slide-up"
          onClick={() => handleFeatureClick('My Results')}
          style={{ animationDelay: '0.4s' }}
        >
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 
            className="text-xl font-bold text-blue-900 mb-2"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            My Results
          </h3>
          <p 
            className="text-blue-700"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            View screening history and reports
          </p>
        </div>

        <div 
          className="feature-card text-center slide-up"
          onClick={() => handleFeatureClick('Doctor Recommendations')}
          style={{ animationDelay: '0.5s' }}
        >
          <UserCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 
            className="text-xl font-bold text-blue-900 mb-2"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Find Doctors
          </h3>
          <p 
            className="text-blue-700"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Locate specialists in your area
          </p>
        </div>

        <div 
          className="feature-card text-center slide-up"
          onClick={() => navigate('/settings')}
          style={{ animationDelay: '0.6s' }}
        >
          <Settings className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 
            className="text-xl font-bold text-blue-900 mb-2"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Settings
          </h3>
          <p 
            className="text-blue-700"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Customize profile and preferences
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/about')}
          className="flex items-center justify-center space-x-2 medical-button slide-up"
          style={{ animationDelay: '0.7s' }}
        >
          <Info className="w-5 h-5" />
          <span>About CanScan Lite</span>
        </button>
        
        <button
          onClick={() => navigate('/emergency-map')}
          className="flex items-center justify-center space-x-2 medical-button slide-up"
          style={{ animationDelay: '0.8s' }}
        >
          <MapPin className="w-5 h-5" />
          <span>Emergency Map</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;