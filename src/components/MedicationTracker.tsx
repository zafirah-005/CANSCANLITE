import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Pill, 
  Plus, 
  Trash2, 
  Clock, 
  AlertTriangle,
  Calendar,
  Save,
  Bell
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  reminders: boolean;
}

interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

const MedicationTracker: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [activeTab, setActiveTab] = useState<'medications' | 'allergies'>('medications');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    reminders: false
  });
  const [newAllergy, setNewAllergy] = useState<Partial<Allergy>>({
    allergen: '',
    reaction: '',
    severity: 'mild'
  });

  useEffect(() => {
    // Load saved data from localStorage
    const savedMedications = localStorage.getItem('canScanMedications');
    const savedAllergies = localStorage.getItem('canScanAllergies');
    
    if (savedMedications) {
      setMedications(JSON.parse(savedMedications));
    }
    if (savedAllergies) {
      setAllergies(JSON.parse(savedAllergies));
    }
  }, []);

  const saveMedications = (meds: Medication[]) => {
    setMedications(meds);
    localStorage.setItem('canScanMedications', JSON.stringify(meds));
  };

  const saveAllergies = (allergyList: Allergy[]) => {
    setAllergies(allergyList);
    localStorage.setItem('canScanAllergies', JSON.stringify(allergyList));
  };

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      const medication: Medication = {
        id: Date.now().toString(),
        name: newMedication.name!,
        dosage: newMedication.dosage!,
        frequency: newMedication.frequency!,
        startDate: newMedication.startDate!,
        endDate: newMedication.endDate,
        notes: newMedication.notes,
        reminders: newMedication.reminders || false
      };
      
      saveMedications([...medications, medication]);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().split('T')[0],
        reminders: false
      });
      setShowAddForm(false);
    }
  };

  const addAllergy = () => {
    if (newAllergy.allergen && newAllergy.reaction) {
      const allergy: Allergy = {
        id: Date.now().toString(),
        allergen: newAllergy.allergen!,
        reaction: newAllergy.reaction!,
        severity: newAllergy.severity!,
        notes: newAllergy.notes
      };
      
      saveAllergies([...allergies, allergy]);
      setNewAllergy({
        allergen: '',
        reaction: '',
        severity: 'mild'
      });
      setShowAddForm(false);
    }
  };

  const removeMedication = (id: string) => {
    if (window.confirm('Are you sure you want to remove this medication?')) {
      saveMedications(medications.filter(med => med.id !== id));
    }
  };

  const removeAllergy = (id: string) => {
    if (window.confirm('Are you sure you want to remove this allergy?')) {
      saveAllergies(allergies.filter(allergy => allergy.id !== id));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-orange-600 bg-orange-100';
      case 'mild': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
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
              Medication Tracker
            </h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>Add New</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glassmorphic p-4 mb-6 slide-up">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('medications')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'medications' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/50 text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>
              Medications ({medications.length})
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('allergies')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'allergies' 
                ? 'bg-red-600 text-white' 
                : 'bg-white/50 text-red-600 hover:bg-red-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span style={{ fontFamily: 'Times New Roman, serif' }}>
              Allergies ({allergies.length})
            </span>
          </button>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glassmorphic p-6 w-full max-w-md">
            <h3 
              className="text-xl font-bold text-blue-900 mb-4"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Add New {activeTab === 'medications' ? 'Medication' : 'Allergy'}
            </h3>
            
            {activeTab === 'medications' ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Medication name"
                  value={newMedication.name || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
                
                <input
                  type="text"
                  placeholder="Dosage (e.g., 10mg)"
                  value={newMedication.dosage || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
                
                <select
                  value={newMedication.frequency || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="As needed">As needed</option>
                  <option value="Weekly">Weekly</option>
                </select>
                
                <input
                  type="date"
                  value={newMedication.startDate || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
                
                <textarea
                  placeholder="Notes (optional)"
                  value={newMedication.notes || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newMedication.reminders || false}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, reminders: e.target.checked }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span 
                    className="text-blue-900"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                  >
                    Enable reminders
                  </span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Allergen (e.g., Penicillin)"
                  value={newAllergy.allergen || ''}
                  onChange={(e) => setNewAllergy(prev => ({ ...prev, allergen: e.target.value }))}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
                
                <input
                  type="text"
                  placeholder="Reaction (e.g., Rash, difficulty breathing)"
                  value={newAllergy.reaction || ''}
                  onChange={(e) => setNewAllergy(prev => ({ ...prev, reaction: e.target.value }))}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
                
                <select
                  value={newAllergy.severity || 'mild'}
                  onChange={(e) => setNewAllergy(prev => ({ ...prev, severity: e.target.value as 'mild' | 'moderate' | 'severe' }))}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
                
                <textarea
                  placeholder="Additional notes (optional)"
                  value={newAllergy.notes || ''}
                  onChange={(e) => setNewAllergy(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  style={{ fontFamily: 'Times New Roman, serif' }}
                />
              </div>
            )}
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Cancel
              </button>
              <button
                onClick={activeTab === 'medications' ? addMedication : addAllergy}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Add {activeTab === 'medications' ? 'Medication' : 'Allergy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'medications' ? (
          <div className="space-y-4">
            {medications.length === 0 ? (
              <div className="glassmorphic p-8 text-center slide-up">
                <Pill className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h3 
                  className="text-xl font-bold text-blue-900 mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  No Medications Added
                </h3>
                <p 
                  className="text-blue-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Start tracking your medications by clicking "Add New" above.
                </p>
              </div>
            ) : (
              medications.map((medication, index) => (
                <div 
                  key={medication.id} 
                  className="glassmorphic p-6 slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Pill className="w-6 h-6 text-blue-600" />
                        <h3 
                          className="text-xl font-bold text-blue-900"
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {medication.name}
                        </h3>
                        {medication.reminders && (
                          <Bell className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-blue-700">
                        <div>
                          <p style={{ fontFamily: 'Times New Roman, serif' }}>
                            <strong>Dosage:</strong> {medication.dosage}
                          </p>
                          <p style={{ fontFamily: 'Times New Roman, serif' }}>
                            <strong>Frequency:</strong> {medication.frequency}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'Times New Roman, serif' }}>
                            <strong>Start Date:</strong> {new Date(medication.startDate).toLocaleDateString()}
                          </p>
                          {medication.endDate && (
                            <p style={{ fontFamily: 'Times New Roman, serif' }}>
                              <strong>End Date:</strong> {new Date(medication.endDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {medication.notes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p 
                            className="text-blue-800 text-sm"
                            style={{ fontFamily: 'Times New Roman, serif' }}
                          >
                            <strong>Notes:</strong> {medication.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeMedication(medication.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {allergies.length === 0 ? (
              <div className="glassmorphic p-8 text-center slide-up">
                <AlertTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <h3 
                  className="text-xl font-bold text-blue-900 mb-2"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  No Allergies Recorded
                </h3>
                <p 
                  className="text-blue-700"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  Record your allergies to help healthcare providers make informed decisions.
                </p>
              </div>
            ) : (
              allergies.map((allergy, index) => (
                <div 
                  key={allergy.id} 
                  className="glassmorphic p-6 slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <h3 
                          className="text-xl font-bold text-blue-900"
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {allergy.allergen}
                        </h3>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(allergy.severity)}`}
                          style={{ fontFamily: 'Times New Roman, serif' }}
                        >
                          {allergy.severity.toUpperCase()}
                        </span>
                      </div>
                      
                      <p 
                        className="text-blue-700 mb-2"
                        style={{ fontFamily: 'Times New Roman, serif' }}
                      >
                        <strong>Reaction:</strong> {allergy.reaction}
                      </p>
                      
                      {allergy.notes && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <p 
                            className="text-red-800 text-sm"
                            style={{ fontFamily: 'Times New Roman, serif' }}
                          >
                            <strong>Notes:</strong> {allergy.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeAllergy(allergy.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationTracker;