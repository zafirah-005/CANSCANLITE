import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.1)), url('https://images.squarespace-cdn.com/content/v1/5fcf15b21d0df60ade61c345/1611079009676-M03IJ68LT1J6Z3MRIUOQ/AOS.jpg')`
      }}
    >
      <div className="text-center fade-in scale-up">
        <div className="glassmorphic p-12 mb-8">
          <Heart className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 
            className="text-6xl font-bold text-blue-900 mb-4"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            CanScan Lite
          </h1>
          <p 
            className="text-xl text-blue-700"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Advanced Medical Screening Platform
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;