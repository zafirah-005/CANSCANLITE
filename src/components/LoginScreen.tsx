import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Heart, User, Calendar, MapPin } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    age: '',
    area: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.trim() && formData.name.trim() && formData.age.trim() && formData.area.trim()) {
      login({
        email: formData.email,
        name: formData.name,
        age: formData.age,
        area: formData.area,
        theme: 'light',
        fontSize: 'medium'
      });
      navigate('/dashboard');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.05)), url('https://social-innovation.hitachi/-/media/project/hitachi/sib/en-in/knowledge-hub/collaborate/health-sector-for-inclusive-healthcare/images/articlepagetitleimage_sp.jpg')`
      }}
    >
      <div className="glassmorphic p-8 w-full max-w-md slide-up">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 
            className="text-4xl font-bold text-blue-900 mb-2"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Welcome Back
          </h1>
          <p 
            className="text-lg text-blue-700"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Sign in to CanScan Lite
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              style={{ fontFamily: 'Times New Roman, serif' }}
              required
            />
          </div>
          
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              style={{ fontFamily: 'Times New Roman, serif' }}
              required
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="Enter your age"
              min="1"
              max="120"
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              style={{ fontFamily: 'Times New Roman, serif' }}
              required
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
            <input
              type="text"
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              placeholder="Enter your area/city"
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              style={{ fontFamily: 'Times New Roman, serif' }}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full medical-button text-lg"
          >
            Login to Dashboard
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p 
            className="text-sm text-white font-medium"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Secure access to your medical screening platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;