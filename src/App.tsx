import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import AboutPage from './components/AboutPage';
import EmergencyMap from './components/EmergencyMap';
import SettingsPage from './components/SettingsPage';
import CancerScanPage from './components/CancerScanPage';
import MedicationTracker from './components/MedicationTracker';
import DoctorRecommendations from './components/DoctorRecommendations';
import SymptomTracker from './components/SymptomTracker';
import ResultsHistory from './components/ResultsHistory';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/emergency-map" element={<EmergencyMap />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/cancer-scan" element={<CancerScanPage />} />
            <Route path="/medication-tracker" element={<MedicationTracker />} />
            <Route path="/doctor-recommendations" element={<DoctorRecommendations />} />
            <Route path="/symptom-tracker" element={<SymptomTracker />} />
            <Route path="/results-history" element={<ResultsHistory />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;