import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Scan, CheckCircle, AlertTriangle, XCircle, Camera } from 'lucide-react';

interface ScanResult {
  imageMatch: boolean;
  symptomScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  verdict: string;
  recommendations: string[];
}

const CancerScanPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const symptoms = [
    "Sudden weight loss",
    "Persistent fatigue", 
    "Unusual lumps",
    "Chronic cough",
    "Skin changes",
    "Frequent infections",
    "Unexplained bleeding",
    "Persistent pain",
    "Difficulty swallowing",
    "Changes in bladder habits"
  ];

  const steps = [
    "Upload Medical Image",
    "Analyze Image", 
    "Select Symptoms",
    "Final Results"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateImageAnalysis = async (): Promise<boolean> => {
    setIsAnalyzing(true);
    // Simulate API call to Python backend
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    // Random result for demo - in real app this would call your Python API
    return Math.random() > 0.7;
  };

  const handleAnalyzeImage = async () => {
    if (!uploadedImage) return;
    
    const imageMatch = await simulateImageAnalysis();
    setCurrentStep(2);
    
    // Store intermediate result
    setScanResult(prev => ({
      ...prev,
      imageMatch,
      symptomScore: 0,
      riskLevel: 'low',
      verdict: '',
      recommendations: []
    } as ScanResult));
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const generateFinalResult = () => {
    const symptomScore = selectedSymptoms.length;
    const imageMatch = scanResult?.imageMatch || false;
    
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    let verdict = '';
    let recommendations: string[] = [];

    if (imageMatch && symptomScore >= 3) {
      riskLevel = 'high';
      verdict = '🔴 High Risk: Consult a doctor immediately.';
      recommendations = [
        'Schedule an appointment with an oncologist within 48 hours',
        'Bring all medical records and this scan result',
        'Consider getting a second opinion',
        'Avoid self-medication until professional consultation'
      ];
    } else if (imageMatch || symptomScore >= 3) {
      riskLevel = 'moderate';
      verdict = '🟠 Moderate Risk: Further tests recommended.';
      recommendations = [
        'Schedule a consultation with your primary care physician',
        'Request additional diagnostic tests',
        'Monitor symptoms closely',
        'Maintain a symptom diary'
      ];
    } else {
      riskLevel = 'low';
      verdict = '🟢 Low Risk: You\'re likely safe.';
      recommendations = [
        'Continue regular health check-ups',
        'Maintain a healthy lifestyle',
        'Monitor for any new symptoms',
        'Schedule routine screening as recommended'
      ];
    }

    const finalResult: ScanResult = {
      imageMatch,
      symptomScore,
      riskLevel,
      verdict,
      recommendations
    };

    setScanResult(finalResult);
    
    // Save to localStorage for results history
    const existingResults = JSON.parse(localStorage.getItem('canScanResults') || '[]');
    const newResult = {
      ...finalResult,
      date: new Date().toISOString(),
      symptoms: selectedSymptoms
    };
    existingResults.push(newResult);
    localStorage.setItem('canScanResults', JSON.stringify(existingResults));
    
    setCurrentStep(3);
  };

  const nextStep = () => {
    if (currentStep === 0 && uploadedImage) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      handleAnalyzeImage();
    } else if (currentStep === 2) {
      generateFinalResult();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'moderate': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-blue-600';
    }
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
              Cancer Risk Scan
            </h1>
          </div>
          <div className="text-sm text-blue-700" style={{ fontFamily: 'Times New Roman, serif' }}>
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glassmorphic p-4 mb-6 slide-up">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`text-sm font-medium ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        {/* Step 0: Upload Image */}
        {currentStep === 0 && (
          <div className="glassmorphic p-8 text-center slide-up">
            <Upload className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 
              className="text-2xl font-bold text-blue-900 mb-4"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Upload Medical Image
            </h2>
            <p 
              className="text-blue-700 mb-6"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Please upload a clear medical image for analysis. Supported formats: JPG, PNG, JPEG
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="medical-button mb-4"
            >
              <Camera className="w-5 h-5 mr-2" />
              Choose Image
            </button>
            
            {uploadedImage && (
              <div className="mt-6">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded medical scan" 
                  className="max-w-full h-64 object-contain mx-auto rounded-lg shadow-lg"
                />
                <p 
                  className="text-green-600 mt-2 font-medium"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  ✅ Image uploaded successfully
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Analyze Image */}
        {currentStep === 1 && (
          <div className="glassmorphic p-8 text-center slide-up">
            <Scan className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 
              className="text-2xl font-bold text-blue-900 mb-4"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Analyzing Medical Image
            </h2>
            
            {uploadedImage && (
              <img 
                src={uploadedImage} 
                alt="Medical scan being analyzed" 
                className="max-w-full h-48 object-contain mx-auto rounded-lg shadow-lg mb-6"
              />
            )}
            
            {isAnalyzing ? (
              <div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p 
                  className="text-blue-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Analyzing image using AI algorithms...
                </p>
              </div>
            ) : (
              <button
                onClick={handleAnalyzeImage}
                className="medical-button"
              >
                <Scan className="w-5 h-5 mr-2" />
                Start Analysis
              </button>
            )}
          </div>
        )}

        {/* Step 2: Select Symptoms */}
        {currentStep === 2 && (
          <div className="glassmorphic p-8 slide-up">
            <h2 
              className="text-2xl font-bold text-blue-900 mb-6 text-center"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Select Observed Symptoms
            </h2>
            
            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {symptoms.map((symptom, index) => (
                <label 
                  key={index}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSymptoms.includes(symptom) 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white/50 border-2 border-transparent hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span 
                    className="text-blue-900"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                  >
                    {symptom}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="text-center">
              <p 
                className="text-blue-700 mb-4"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Selected symptoms: {selectedSymptoms.length}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Final Results */}
        {currentStep === 3 && scanResult && (
          <div className="glassmorphic p-8 slide-up">
            <div className="text-center mb-6">
              {scanResult.riskLevel === 'high' && <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />}
              {scanResult.riskLevel === 'moderate' && <AlertTriangle className="w-16 h-16 text-orange-600 mx-auto mb-4" />}
              {scanResult.riskLevel === 'low' && <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />}
              
              <h2 
                className="text-2xl font-bold text-blue-900 mb-4"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Scan Results
              </h2>
              
              <p 
                className={`text-xl font-bold mb-6 ${getRiskColor(scanResult.riskLevel)}`}
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                {scanResult.verdict}
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 
                  className="font-bold text-blue-900 mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Analysis Summary:
                </h3>
                <p 
                  className="text-blue-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Image Match: {scanResult.imageMatch ? '✅ Found' : '❌ Not Found'}
                </p>
                <p 
                  className="text-blue-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Symptoms Reported: {scanResult.symptomScore}
                </p>
              </div>
              
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 
                  className="font-bold text-blue-900 mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Recommendations:
                </h3>
                <ul className="space-y-1">
                  {scanResult.recommendations.map((rec, index) => (
                    <li 
                      key={index}
                      className="text-blue-700 flex items-start"
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      <span className="mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => navigate('/results-history')}
                className="medical-button"
              >
                View All Results
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="medical-button"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {currentStep < 3 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            ⬅ Back
          </button>
          
          <button
            onClick={nextStep}
            disabled={
              (currentStep === 0 && !uploadedImage) ||
              (currentStep === 1 && isAnalyzing)
            }
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              (currentStep === 0 && !uploadedImage) || (currentStep === 1 && isAnalyzing)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            {currentStep === 2 ? 'Get Results' : 'Next'} ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default CancerScanPage;