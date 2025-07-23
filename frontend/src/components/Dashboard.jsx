import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        // Fetch uploads
        const uploadsRes = await fetch('/api/uploads', { headers });
        const uploadsData = await uploadsRes.json();
        // Fetch analyses
        const analysesRes = await fetch('/api/analysis', { headers });
        if (!analysesRes.ok) throw new Error('Failed to fetch analysis data');
        const analysesData = await analysesRes.json();
        setUploads(uploadsData);
        setAnalyses(analysesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <Link
          to="/analyze"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Upload New File
        </Link>
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
              {analyses.slice(0, 5).map((analysis) => (
                <div key={analysis._id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {analysis.chartType} Chart: {analysis.xAxis} vs {analysis.yAxis}
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