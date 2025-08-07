import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Activity,
  BarChart3,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface SymptomEntry {
  id: string;
  date: string;
  symptoms: string[];
  severity: number;
  notes?: string;
  triggers?: string;
}

const SymptomTracker: React.FC = () => {
  const navigate = useNavigate();
  const [symptomEntries, setSymptomEntries] = useState<SymptomEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(1);
  const [notes, setNotes] = useState('');
  const [triggers, setTriggers] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'list' | 'trends'>('list');

  const commonSymptoms = [
    'Headache',
    'Fatigue',
    'Nausea',
    'Dizziness',
    'Chest pain',
    'Shortness of breath',
    'Abdominal pain',
    'Back pain',
    'Joint pain',
    'Muscle aches',
    'Fever',
    'Cough',
    'Sore throat',
    'Skin rash',
    'Sleep problems',
    'Anxiety',
    'Depression',
    'Memory issues',
    'Vision problems',
    'Hearing problems'
  ];

  useEffect(() => {
    const savedEntries = localStorage.getItem('canScanSymptoms');
    if (savedEntries) {
      setSymptomEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntries = (entries: SymptomEntry[]) => {
    setSymptomEntries(entries);
    localStorage.setItem('canScanSymptoms', JSON.stringify(entries));
  };

  const addSymptomEntry = () => {
    if (selectedSymptoms.length === 0) return;

    const newEntry: SymptomEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      symptoms: selectedSymptoms,
      severity,
      notes: notes.trim() || undefined,
      triggers: triggers.trim() || undefined
    };

    saveEntries([...symptomEntries, newEntry]);
    
    // Reset form
    setSelectedSymptoms([]);
    setSeverity(1);
    setNotes('');
    setTriggers('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setShowAddForm(false);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const deleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      saveEntries(symptomEntries.filter(entry => entry.id !== id));
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return 'text-green-600 bg-green-100';
    if (severity <= 4) return 'text-yellow-600 bg-yellow-100';
    if (severity <= 6) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity <= 2) return 'Mild';
    if (severity <= 4) return 'Moderate';
    if (severity <= 6) return 'Severe';
    return 'Very Severe';
  };

  const getSymptomTrends = () => {
    const symptomCounts: { [key: string]: number[] } = {};
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Initialize counts
    commonSymptoms.forEach(symptom => {
      symptomCounts[symptom] = new Array(30).fill(0);
    });

    // Count occurrences
    symptomEntries.forEach(entry => {
      const dayIndex = last30Days.indexOf(entry.date);
      if (dayIndex !== -1) {
        entry.symptoms.forEach(symptom => {
          if (symptomCounts[symptom]) {
            symptomCounts[symptom][dayIndex] = 1;
          }
        });
      }
    });

    return { symptomCounts, last30Days };
  };

  const getMostCommonSymptoms = () => {
    const counts: { [key: string]: number } = {};
    symptomEntries.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        counts[symptom] = (counts[symptom] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getAverageSeverity = () => {
    if (symptomEntries.length === 0) return 0;
    const total = symptomEntries.reduce((sum, entry) => sum + entry.severity, 0);
    return (total / symptomEntries.length).toFixed(1);
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
              Symptom Tracker
            </h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>Add Entry</span>
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="glassmorphic p-4 mb-6 slide-up">
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/50 text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>Entries</span>
          </button>
          
          <button
            onClick={() => setViewMode('trends')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'trends' 
                ? 'bg-green-600 text-white' 
                : 'bg-white/50 text-green-600 hover:bg-green-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>Trends</span>
          </button>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glassmorphic p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 
              className="text-xl font-bold text-blue-900 mb-4"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Add Symptom Entry
            </h3>
            
            <div className="space-y-4">
              <div>
                <label 
                  className="block text-blue-900 font-medium mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
              </div>

              <div>
                <label 
                  className="block text-blue-900 font-medium mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Symptoms ({selectedSymptoms.length} selected)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-blue-200 rounded-lg bg-white/50">
                  {commonSymptoms.map(symptom => (
                    <label 
                      key={symptom}
                      className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                        selectedSymptoms.includes(symptom) 
                          ? 'bg-blue-100 border border-blue-500' 
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom)}
                        onChange={() => toggleSymptom(symptom)}
                        className="mr-2 w-4 h-4 text-blue-600"
                      />
                      <span 
                        className="text-sm text-blue-900"
                        style={{ fontFamily: 'Times New Roman, serif' }}
                      >
                        {symptom}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label 
                  className="block text-blue-900 font-medium mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Severity: {severity}/10 ({getSeverityLabel(severity)})
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-blue-600 mt-1">
                  <span style={{ fontFamily: 'Times New Roman, serif' }}>Mild</span>
                  <span style={{ fontFamily: 'Times New Roman, serif' }}>Severe</span>
                </div>
              </div>

              <div>
                <label 
                  className="block text-blue-900 font-medium mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Possible Triggers (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., stress, weather, food, medication..."
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
              </div>

              <div>
                <label 
                  className="block text-blue-900 font-medium mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Additional Notes (optional)
                </label>
                <textarea
                  placeholder="Any additional details about your symptoms..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Cancel
              </button>
              <button
                onClick={addSymptomEntry}
                disabled={selectedSymptoms.length === 0}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  selectedSymptoms.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {symptomEntries.length === 0 ? (
              <div className="glassmorphic p-8 text-center slide-up">
                <Activity className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h3 
                  className="text-xl font-bold text-blue-900 mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  No Symptoms Recorded
                </h3>
                <p 
                  className="text-blue-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Start tracking your symptoms by clicking "Add Entry" above.
                </p>
              </div>
            ) : (
              symptomEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className="glassmorphic p-6 slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 
                          className="text-lg font-bold text-blue-900"
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {new Date(entry.date).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span 
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(entry.severity)}`}
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {getSeverityLabel(entry.severity)} ({entry.severity}/10)
                        </span>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 
                          className="font-medium text-blue-900 mb-2"
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          Symptoms:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {entry.symptoms.map(symptom => (
                            <span 
                              key={symptom}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              style={{ fontFamily: 'Times New Roman, serif' }}
                            >
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {entry.triggers && (
                        <div>
                          <h4 
                            className="font-medium text-blue-900 mb-1"
                            style={{ fontFamily: 'Times New Roman, serif' }}
                          >
                            Possible Triggers:
                          </h4>
                          <p 
                            className="text-blue-700"
                            style={{ fontFamily: 'Times New Roman, serif' }}
                          >
                            {entry.triggers}
                          </p>
                        </div>
                      )}
                      
                      {entry.notes && (
                        <div>
                          <h4 
                            className="font-medium text-blue-900 mb-1"
                            style={{ fontFamily: 'Times New Roman, serif' }}
                          >
                            Notes:
                          </h4>
                          <p 
                            className="text-blue-700"
                            style={{ fontFamily: 'Times New Roman, serif' }}
                          >
                            {entry.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="glassmorphic p-6 text-center slide-up">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 
                  className="text-2xl font-bold text-blue-900"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  {symptomEntries.length}
                </h3>
                <p 
                  className="text-blue-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Total Entries
                </p>
              </div>
              
              <div className="glassmorphic p-6 text-center slide-up" style={{ animationDelay: '0.1s' }}>
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 
                  className="text-2xl font-bold text-blue-900"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  {getAverageSeverity()}
                </h3>
                <p 
                  className="text-blue-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Avg. Severity
                </p>
              </div>
              
              <div className="glassmorphic p-6 text-center slide-up" style={{ animationDelay: '0.2s' }}>
                <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 
                  className="text-2xl font-bold text-blue-900"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  {symptomEntries.filter(e => e.severity >= 7).length}
                </h3>
                <p 
                  className="text-blue-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Severe Episodes
                </p>
              </div>
            </div>

            {/* Most Common Symptoms */}
            <div className="glassmorphic p-6 slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 
                className="text-xl font-bold text-blue-900 mb-4"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Most Common Symptoms
              </h3>
              
              {getMostCommonSymptoms().length === 0 ? (
                <p 
                  className="text-blue-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  No data available yet. Add some symptom entries to see trends.
                </p>
              ) : (
                <div className="space-y-3">
                  {getMostCommonSymptoms().map(([symptom, count], index) => (
                    <div key={symptom} className="flex items-center justify-between">
                      <span 
                        className="text-blue-900"
                        style={{ fontFamily: 'Times New Roman, serif' }}
                      >
                        {symptom}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / symptomEntries.length) * 100}%` }}
                          ></div>
                        </div>
                        <span 
                          className="text-blue-700 text-sm w-8"
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="glassmorphic p-6 slide-up" style={{ animationDelay: '0.4s' }}>
              <h3 
                className="text-xl font-bold text-blue-900 mb-4"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Recommendations
              </h3>
              
              <div className="space-y-3">
                {symptomEntries.filter(e => e.severity >= 7).length > 3 && (
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p 
                      className="text-red-800"
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      You've had multiple severe episodes. Consider consulting with a healthcare provider.
                    </p>
                  </div>
                )}
                
                {getAverageSeverity() > '5.0' && (
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <p 
                      className="text-orange-800"
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      Your average symptom severity is moderate to high. Monitor closely and discuss with your doctor.
                    </p>
                  </div>
                )}
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p 
                    className="text-blue-800"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                  >
                    Keep tracking your symptoms regularly to identify patterns and triggers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomTracker;