import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Download, 
  Share2,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ScanResult {
  id?: string;
  date: string;
  imageMatch: boolean;
  symptomScore: number;
  symptoms: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  verdict: string;
  recommendations: string[];
}

const ResultsHistory: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<ScanResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ScanResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'moderate' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');

  useEffect(() => {
    const savedResults = localStorage.getItem('canScanResults');
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      setResults(parsedResults);
      setFilteredResults(parsedResults);
    }
  }, []);

  useEffect(() => {
    let filtered = results.filter(result => {
      const matchesSearch = result.verdict.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.symptoms.some(symptom => 
                             symptom.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesRisk = riskFilter === 'all' || result.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });

    // Sort results
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        const riskOrder = { 'high': 3, 'moderate': 2, 'low': 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      }
    });

    setFilteredResults(filtered);
  }, [results, searchTerm, riskFilter, sortBy]);

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'moderate':
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 'low':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <FileText className="w-6 h-6 text-blue-600" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'moderate':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `canscan-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareResult = (result: ScanResult) => {
    if (navigator.share) {
      navigator.share({
        title: 'CanScan Lite Result',
        text: `Scan Result: ${result.verdict}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `CanScan Lite Result\nDate: ${new Date(result.date).toLocaleDateString()}\nResult: ${result.verdict}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Result copied to clipboard!');
      });
    }
  };

  const clearAllResults = () => {
    if (window.confirm('Are you sure you want to clear all scan results? This action cannot be undone.')) {
      localStorage.removeItem('canScanResults');
      setResults([]);
      setFilteredResults([]);
    }
  };

  const getRiskStats = () => {
    const stats = { low: 0, moderate: 0, high: 0 };
    results.forEach(result => {
      stats[result.riskLevel]++;
    });
    return stats;
  };

  const stats = getRiskStats();

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
              Scan Results History
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={exportResults}
              disabled={results.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                results.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Download className="w-4 h-4" />
              <span style={{ fontFamily: 'Times New Roman, serif' }}>Export</span>
            </button>
            <button
              onClick={clearAllResults}
              disabled={results.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                results.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <span style={{ fontFamily: 'Times New Roman, serif' }}>Clear All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {results.length > 0 && (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="glassmorphic p-4 text-center slide-up">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 
              className="text-2xl font-bold text-blue-900"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              {results.length}
            </h3>
            <p 
              className="text-blue-700 text-sm"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Total Scans
            </p>
          </div>
          
          <div className="glassmorphic p-4 text-center slide-up" style={{ animationDelay: '0.1s' }}>
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 
              className="text-2xl font-bold text-blue-900"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              {stats.low}
            </h3>
            <p 
              className="text-blue-700 text-sm"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Low Risk
            </p>
          </div>
          
          <div className="glassmorphic p-4 text-center slide-up" style={{ animationDelay: '0.2s' }}>
            <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 
              className="text-2xl font-bold text-blue-900"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              {stats.moderate}
            </h3>
            <p 
              className="text-blue-700 text-sm"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              Moderate Risk
            </p>
          </div>
          
          <div className="glassmorphic p-4 text-center slide-up" style={{ animationDelay: '0.3s' }}>
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 
              className="text-2xl font-bold text-blue-900"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              {stats.high}
            </h3>
            <p 
              className="text-blue-700 text-sm"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              High Risk
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {results.length > 0 && (
        <div className="glassmorphic p-4 mb-6 slide-up">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
              <input
                type="text"
                placeholder="Search results by symptoms or verdict..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontFamily: 'Times New Roman, serif' }}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as 'all' | 'low' | 'moderate' | 'high')}
                  className="px-3 py-2 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Times New Roman, serif' }}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="moderate">Moderate Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'risk')}
                className="px-3 py-2 bg-white/90 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                <option value="date">Sort by Date</option>
                <option value="risk">Sort by Risk Level</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredResults.length === 0 ? (
          <div className="glassmorphic p-8 text-center slide-up">
            <FileText className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 
              className="text-xl font-bold text-blue-900 mb-2"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              {results.length === 0 ? 'No Scan Results Yet' : 'No Results Match Your Search'}
            </h3>
            <p 
              className="text-blue-700 mb-4"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >
              {results.length === 0 
                ? 'Complete your first cancer risk scan to see results here.'
                : 'Try adjusting your search terms or filters.'
              }
            </p>
            {results.length === 0 && (
              <button
                onClick={() => navigate('/cancer-scan')}
                className="medical-button"
              >
                Start Your First Scan
              </button>
            )}
          </div>
        ) : (
          filteredResults.map((result, index) => (
            <div 
              key={result.id || index} 
              className="glassmorphic p-6 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {getRiskIcon(result.riskLevel)}
                  <div>
                    <h3 
                      className="text-lg font-bold text-blue-900"
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      Scan Result - {new Date(result.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <p 
                      className="text-blue-700 text-sm"
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      {new Date(result.date).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(result.riskLevel)}`}
                    style={{ fontFamily: 'Times New Roman, serif' }}
                  >
                    {result.riskLevel.toUpperCase()} RISK
                  </span>
                  <button
                    onClick={() => shareResult(result)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Verdict */}
                <div className={`p-4 rounded-lg border ${getRiskColor(result.riskLevel)}`}>
                  <p 
                    className="font-bold text-lg"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                  >
                    {result.verdict}
                  </p>
                </div>
                
                {/* Analysis Summary */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 
                      className="font-bold text-blue-900 mb-2"
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      Analysis Summary:
                    </h4>
                    <p 
                      className="text-blue-700 text-sm"
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      Image Match: {result.imageMatch ? '✅ Found' : '❌ Not Found'}
                    </p>
                    <p 
                      className="text-blue-700 text-sm"
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      Symptoms Reported: {result.symptomScore}
                    </p>
                  </div>
                  
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 
                      className="font-bold text-blue-900 mb-2"
                      style={{ fontFamily: 'Times New Roman, serif' }}
                    >
                      Symptoms:
                    </h4>
                    {result.symptoms.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {result.symptoms.slice(0, 3).map(symptom => (
                          <span 
                            key={symptom}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                            style={{ fontFamily: 'Times New Roman, serif' }}
                          >
                            {symptom}
                          </span>
                        ))}
                        {result.symptoms.length > 3 && (
                          <span 
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            style={{ fontFamily: 'Times New Roman, serif' }}
                          >
                            +{result.symptoms.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <p 
                        className="text-blue-700 text-sm"
                        style={{ fontFamily: 'Times New Roman, serif' }}
                      >
                        No symptoms reported
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className="bg-white/50 p-4 rounded-lg">
                  <h4 
                    className="font-bold text-blue-900 mb-2"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                  >
                    Recommendations:
                  </h4>
                  <ul className="space-y-1">
                    {result.recommendations.slice(0, 2).map((rec, recIndex) => (
                      <li 
                        key={recIndex}
                        className="text-blue-700 text-sm flex items-start"
                        style={{ fontFamily: 'Times New Roman, serif' }}
                      >
                        <span className="mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                    {result.recommendations.length > 2 && (
                      <li 
                        className="text-blue-600 text-sm italic"
                        style={{ fontFamily: 'Times New Roman, serif' }}
                      >
                        +{result.recommendations.length - 2} more recommendations...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResultsHistory;