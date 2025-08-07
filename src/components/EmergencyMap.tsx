import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Home, 
  Building2, 
  Shield,
  Navigation,
  Phone,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Location {
  lat: number;
  lng: number;
  name: string;
  address: string;
  type: 'home' | 'hospital' | 'police';
  phone?: string;
}

const EmergencyMap: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Predefined locations (in a real app, these would come from an API)
  const predefinedLocations: Location[] = [
    ...(user?.homeLocation ? [{
      lat: user.homeLocation.lat,
      lng: user.homeLocation.lng,
      name: "Home Location",
      address: user.homeLocation.address,
      type: "home" as const
    }] : []),
    {
      lat: 51.5155,
      lng: -0.1426,
      name: "St. Mary's Hospital",
      address: "Praed Street, Paddington, London W2 1NY",
      type: "hospital",
      phone: "+44 20 3312 6666"
    },
    {
      lat: 51.4994,
      lng: -0.1245,
      name: "King's College Hospital",
      address: "Denmark Hill, London SE5 9RS",
      type: "hospital",
      phone: "+44 20 3299 9000"
    },
    {
      lat: 51.5186,
      lng: -0.1426,
      name: "Paddington Police Station",
      address: "252-254 Harrow Road, London W2 5ES",
      type: "police",
      phone: "+44 101"
    },
    {
      lat: 51.4975,
      lng: -0.1357,
      name: "Westminster Police Station",
      address: "27 Dacre Street, London SW1H 0DX",
      type: "police",
      phone: "+44 101"
    }
  ];

  useEffect(() => {
    // Get user's current location
    const defaultLocation = user?.homeLocation || { lat: 51.5074, lng: -0.1278 };
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Use home location or default to London coordinates if geolocation fails
          setCurrentLocation(defaultLocation);
        }
      );
    } else {
      setCurrentLocation(defaultLocation);
    }
  }, [user?.homeLocation]);

  const filterLocations = (type: string) => {
    setActiveFilter(type);
    if (type === 'all') {
      setSelectedLocations(predefinedLocations);
    } else {
      setSelectedLocations(predefinedLocations.filter(loc => loc.type === type));
    }
  };

  const openInGoogleMaps = (location: Location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'hospital':
        return <Building2 className="w-5 h-5" />;
      case 'police':
        return <Shield className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'home':
        return 'bg-green-500';
      case 'hospital':
        return 'bg-red-500';
      case 'police':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.05)), url('https://images.squarespace-cdn.com/content/v1/5fcf15b21d0df60ade61c345/1611079009676-M03IJ68LT1J6Z3MRIUOQ/AOS.jpg')`
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
              Emergency Map
            </h1>
          </div>
          {currentLocation && (
            <div className="flex items-center space-x-2 text-green-600">
              <Navigation className="w-4 h-4" />
              <span 
                className="text-sm font-medium"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Location Found
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="glassmorphic p-4 mb-6 slide-up">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => filterLocations('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/80 text-blue-600 hover:bg-blue-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>All Locations</span>
          </button>
          
          <button
            onClick={() => filterLocations('home')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'home' 
                ? 'bg-green-600 text-white' 
                : 'bg-white/80 text-green-600 hover:bg-green-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>Home</span>
          </button>
          
          <button
            onClick={() => filterLocations('hospital')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'hospital' 
                ? 'bg-red-600 text-white' 
                : 'bg-white/80 text-red-600 hover:bg-red-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>Hospitals</span>
          </button>
          
          <button
            onClick={() => filterLocations('police')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'police' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/80 text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>Police Stations</span>
          </button>
        </div>
      </div>

      {/* Current Location */}
      {currentLocation && (
        <div className="glassmorphic p-4 mb-6 slide-up">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <h3 
                className="font-bold text-blue-900"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Your Current Location
              </h3>
              <p 
                className="text-sm text-blue-700"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Locations List */}
      <div className="space-y-4">
        {(selectedLocations.length > 0 ? selectedLocations : predefinedLocations).map((location, index) => (
          <div 
            key={index} 
            className="glassmorphic p-4 slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 ${getColorForType(location.type)} text-white rounded-full`}>
                {getIconForType(location.type)}
              </div>
              
              <div className="flex-1">
                <h3 
                  className="text-lg font-bold text-blue-900 mb-1"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  {location.name}
                </h3>
                <p 
                  className="text-blue-700 mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  {location.address}
                </p>
                
                {location.phone && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span 
                      className="text-sm text-blue-700"
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      {location.phone}
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => openInGoogleMaps(location)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span 
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                  >
                    Open in Google Maps
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Note */}
      <div className="glassmorphic p-4 mt-6 text-center slide-up">
        <p 
          className="text-red-600 font-bold mb-2"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Emergency: Call 999 (UK) or your local emergency number
        </p>
        <p 
          className="text-sm text-blue-700"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          This map shows nearby medical and emergency services. In case of medical emergency, 
          call emergency services immediately.
        </p>
      </div>
    </div>
  );
};

export default EmergencyMap;