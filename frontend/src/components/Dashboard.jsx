import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch uploads
      const uploadsRes = await fetch('/api/uploads', { headers });
      if (!uploadsRes.ok) throw new Error('Failed to fetch uploads');
      const uploadsData = await uploadsRes.json();
      
      // Fetch analyses
      const analysesRes = await fetch('/api/analysis', { headers });
      if (!analysesRes.ok) throw new Error('Failed to fetch analysis data');
      const analysesData = await analysesRes.json();
      
      setUploads(uploadsData);
      setAnalyses(analysesData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  // Refresh data every 30 seconds
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);
  // Fetch data when refreshKey changes
  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey, fetchDashboardData]);
  const handleManualRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={handleManualRefresh}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Refresh
          </button>
          <Link
            to="/analyze"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Upload New File
          </Link>
        </div>
      </div>
      {/* Recent Uploads */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
        </div>
        <div className="p-6">
          {uploads.length === 0 ? (
            <p className="text-gray-500">No files uploaded yet</p>
          ) : (
            <div className="grid gap-4">
              {uploads.slice(0, 5).map((upload) => (
                <div key={upload._id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium text-gray-900">{upload.fileName}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded on {new Date(upload.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{upload.fileSize} bytes</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Analysis Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Analysis Overview</h2>
        </div>
        <div className="p-6">
          {analyses.length === 0 ? (
            <p className="text-gray-500">No analyses performed yet</p>
          ) : (
            <div className="grid gap-4">
              {analyses.map((analysis) => (
                <div key={analysis._id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {analysis.chartType} Chart: {analysis.xAxis} vs {analysis.yAxis}
                    </p>
                    <p className="text-sm text-gray-500">
                      File: {analysis.upload?.fileName || 'Unknown file'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created on {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;