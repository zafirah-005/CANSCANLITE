import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Globe, Shield } from 'lucide-react';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
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
            className="text-2xl font-bold text-blue-900"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            About CanScan Lite
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="glassmorphic p-8 mb-6 text-center slide-up">
          <Heart className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 
            className="text-4xl font-bold text-blue-900 mb-4"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Revolutionizing Rural Healthcare
          </h2>
          <p 
            className="text-xl text-blue-700 leading-relaxed"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            CanScan Lite is an innovative medical screening platform designed specifically 
            for rural healthcare environments where access to specialized medical facilities 
            and reliable internet connectivity may be limited.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="glassmorphic p-6 slide-up" style={{ animationDelay: '0.1s' }}>
            <Users className="w-12 h-12 text-blue-600 mb-4" />
            <h3 
              className="text-2xl font-bold text-blue-900 mb-3"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Early Detection Focus
            </h3>
            <p 
              className="text-blue-700 leading-relaxed"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Our advanced AI-powered screening technology enables early cancer detection 
              in communities that traditionally lack access to specialized oncology services. 
              Early detection saves lives by enabling timely intervention and treatment.
            </p>
          </div>

          <div className="glassmorphic p-6 slide-up" style={{ animationDelay: '0.2s' }}>
            <Globe className="w-12 h-12 text-blue-600 mb-4" />
            <h3 
              className="text-2xl font-bold text-blue-900 mb-3"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Offline Capability
            </h3>
            <p 
              className="text-blue-700 leading-relaxed"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Designed to function effectively in areas with limited internet connectivity, 
              CanScan Lite can perform initial screenings offline and sync results when 
              connection becomes available, ensuring uninterrupted healthcare delivery.
            </p>
          </div>
        </div>

        <div className="glassmorphic p-8 slide-up" style={{ animationDelay: '0.3s' }}>
          <Shield className="w-12 h-12 text-blue-600 mb-4" />
          <h3 
            className="text-2xl font-bold text-blue-900 mb-4"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Our Mission
          </h3>
          <div 
            className="text-blue-700 leading-relaxed space-y-4"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            <p>
              <strong>Accessibility:</strong> Bring advanced medical screening technology 
              to remote and underserved communities worldwide.
            </p>
            <p>
              <strong>Affordability:</strong> Provide cost-effective screening solutions 
              that don't compromise on accuracy or reliability.
            </p>
            <p>
              <strong>Empowerment:</strong> Enable local healthcare providers with tools 
              to deliver world-class preventive care services.
            </p>
            <p>
              <strong>Innovation:</strong> Continuously improve our AI algorithms and 
              expand screening capabilities to cover more conditions and demographics.
            </p>
          </div>
        </div>

        <div className="text-center slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="medical-button"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;