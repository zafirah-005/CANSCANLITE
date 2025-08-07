import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Pill, 
  Phone, 
  Home, 
  Palette, 
  Type, 
  Trash2,
  Save,
  Moon,
  Sun
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    area: user?.area || '',
    medications: user?.medications || '',
    emergencyContacts: user?.emergencyContacts || '',
    allergies: user?.allergies || '',
    theme: user?.theme || 'light',
    fontSize: user?.fontSize || 'medium'
  });
  const [homeLocation, setHomeLocation] = useState(user?.homeLocation || null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateProfile({
      ...formData,
      homeLocation
    });
    alert('Settings saved successfully!');
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          };
          setHomeLocation(location);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please try again.');
          setIsGettingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsGettingLocation(false);
    }
  };

  const clearScanHistory = () => {
    if (window.confirm('Are you sure you want to clear all scan history? This action cannot be undone.')) {
      // Placeholder for clearing scan history
      localStorage.removeItem('canScanHistory');
      alert('Scan history cleared successfully!');
    }
  };

  const getFontSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getThemeColors = (theme: string) => {
    if (theme === 'dark') {
      return {
        text: 'text-white',
        subtext: 'text-gray-300',
        input: 'bg-gray-800/90 border-gray-600 text-white',
        card: 'bg-gray-800/50'
      };
    }
    return {
      text: 'text-blue-900',
      subtext: 'text-blue-700',
      input: 'bg-white/90 border-blue-200 text-gray-800',
      card: 'bg-white/25'
    };
  };

  const themeColors = getThemeColors(formData.theme);

  return (
    <div 
      className={`min-h-screen bg-cover bg-center bg-no-repeat p-4 ${getFontSizeClass(formData.fontSize)}`}
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.05)), url('https://social-innovation.hitachi/-/media/project/hitachi/sib/en-in/knowledge-hub/collaborate/health-sector-for-inclusive-healthcare/images/articlepagetitleimage_sp.jpg')`
      }}
    >
      {/* Header */}
      <div className="glassmorphic p-4 mb-6 slide-up">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </button>
          <h1 
            className={`text-2xl font-bold ${themeColors.text}`}
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Settings
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Information */}
        <div className={`glassmorphic p-6 slide-up ${themeColors.card}`}>
          <h2 
            className={`text-xl font-bold ${themeColors.text} mb-4`}
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Profile Information
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Full Name"
                className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                style={{ fontFamily: 'Times New Roman, serif' }}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email Address"
                className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                style={{ fontFamily: 'Times New Roman, serif' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Age"
                  className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="Area/City"
                  className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className={`glassmorphic p-6 slide-up ${themeColors.card}`} style={{ animationDelay: '0.1s' }}>
          <h2 
            className={`text-xl font-bold ${themeColors.text} mb-4`}
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Medical Information
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <Pill className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
              <textarea
                value={formData.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                placeholder="Current medications, allergies, or medical conditions..."
                rows={3}
                className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                style={{ fontFamily: 'Times New Roman, serif' }}
              />
            </div>

            <div className="relative">
              <Pill className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
              <textarea
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="Known allergies (medications, foods, environmental)..."
                rows={3}
                className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                style={{ fontFamily: 'Times New Roman, serif' }}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
              <textarea
                value={formData.emergencyContacts}
                onChange={(e) => handleInputChange('emergencyContacts', e.target.value)}
                placeholder="Emergency contacts (Name: Phone Number)..."
                rows={3}
                className={`w-full pl-12 pr-4 py-3 ${themeColors.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                style={{ fontFamily: 'Times New Roman, serif' }}
              />
            </div>
          </div>
        </div>

        {/* Home Location */}
        <div className={`glassmorphic p-6 slide-up ${themeColors.card}`} style={{ animationDelay: '0.2s' }}>
          <h2 
            className={`text-xl font-bold ${themeColors.text} mb-4`}
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Home Location
          </h2>
          
          <div className="space-y-4">
            {homeLocation ? (
              <div className={`p-4 bg-green-50 border border-green-200 rounded-lg`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Home className="w-5 h-5 text-green-600" />
                  <span 
                    className="font-medium text-green-800"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                  >
                    Home Location Saved
                  </span>
                </div>
                <p 
                  className="text-sm text-green-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  {homeLocation.address}
                </p>
              </div>
            ) : (
              <p 
                className={`${themeColors.subtext} mb-4`}
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                No home location saved
              </p>
            )}
            
            <button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="flex items-center space-x-2 medical-button"
            >
              <Home className="w-5 h-5" />
              <span>
                {isGettingLocation ? 'Getting Location...' : 'Set Current Location as Home'}
              </span>
            </button>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className={`glassmorphic p-6 slide-up ${themeColors.card}`} style={{ animationDelay: '0.3s' }}>
          <h2 
            className={`text-xl font-bold ${themeColors.text} mb-4`}
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div>
              <label 
                className={`block ${themeColors.text} font-medium mb-2`}
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Theme
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleInputChange('theme', 'light')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    formData.theme === 'light' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/80 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span style={{ fontFamily: 'Times New Roman, serif' }}>Light</span>
                </button>
                
                <button
                  onClick={() => handleInputChange('theme', 'dark')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    formData.theme === 'dark' 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-white/80 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span style={{ fontFamily: 'Times New Roman, serif' }}>Dark</span>
                </button>
              </div>
            </div>

            <div>
              <label 
                className={`block ${themeColors.text} font-medium mb-2`}
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Font Size
              </label>
              <div className="flex space-x-4">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleInputChange('fontSize', size)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      formData.fontSize === size 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/80 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Type className="w-4 h-4" />
                    <span 
                      style={{ fontFamily: 'Times New Roman, serif' }}
                      className={size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : ''}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className={`glassmorphic p-6 slide-up ${themeColors.card}`} style={{ animationDelay: '0.4s' }}>
          <h2 
            className={`text-xl font-bold ${themeColors.text} mb-4`}
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Data Management
          </h2>
          
          <button
            onClick={clearScanHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>Clear Scan History</span>
          </button>
        </div>

        {/* Save Button */}
        <div className="text-center slide-up" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 medical-button mx-auto"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;