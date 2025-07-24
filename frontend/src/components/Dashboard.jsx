import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Navbar from './Navbar';
import Footer from './Footer';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  const handleManualRefresh = () => {
    fetchDashboardData();
  };
  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  return (
    <div>
      <Navbar />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              {uploads
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((upload) => (
                  <div key={upload._id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium text-gray-900">{upload.fileName}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date(upload.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">{upload.fileSize / 1000} KB</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-gray-900">
                      {analysis.chartType} Chart
                    </h3>
                    <p className="text-sm text-gray-600">
                      {analysis.xAxis} vs {analysis.yAxis}
                    </p>
                    <p className="text-xs text-gray-500">
                      File: {analysis.upload?.fileName || 'Unknown file'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created on {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          setSelectedAnalysis(analysis);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                    {/* Analysis Details Modal */}
                    {isModalOpen && selectedAnalysis && (
                      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Analysis Details</h3>
                            <button
                              onClick={() => setIsModalOpen(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <i className="fas fa-times" />
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Chart Type</p>
                              <p className="text-base text-gray-900">{selectedAnalysis.chartType} Chart</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Data Points</p>
                              <p className="text-base text-gray-900">
                                {selectedAnalysis.xAxis} vs {selectedAnalysis.yAxis}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">File Name</p>
                              <p className="text-base text-gray-900">
                                {selectedAnalysis.upload?.fileName || 'Unknown file'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Created On</p>
                              <p className="text-base text-gray-900">
                                {new Date(selectedAnalysis.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {selectedAnalysis.aiSummary && (
                              <div>
                                <p className="text-sm font-medium text-gray-500">AI Insights</p>
                                <p className="text-base text-gray-900">{selectedAnalysis.aiSummary}</p>
                              </div>
                            )}
                            {/* Chart Visualization */}
                            <div className="mt-6">
                              <p className="text-sm font-medium text-gray-500 mb-2">Chart Visualization</p>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                {(() => {
                                  // Try to extract parsedData from the upload, or fall back to 'data' if that's what is available
                                  const data =
                                    (selectedAnalysis.upload?.parsedData || selectedAnalysis.upload?.data) || [];

                                  // Check if data is valid and non-empty
                                  if (!Array.isArray(data) || data.length === 0) {
                                    return <p className="text-gray-500">No chart data available</p>;
                                  }

                                  // Assuming each row is an object, extract labels and data points
                                  const labels = data.map(row => row[selectedAnalysis.xAxis]);
                                  const dataPoints = data.map(row => Number(row[selectedAnalysis.yAxis]));

                                  // Color palette example
                                  const colorPalette = [
                                    "#6366f1", "#f59e42", "#10b981", "#ef4444",
                                    "#3b82f6", "#f472b6", "#fbbf24", "#a78bfa",
                                    "#34d399", "#f87171"
                                  ];

                                  // Configure the chart data and ensure dataPoints is provided
                                  const chartData = {
                                    labels,
                                    datasets: [{
                                      label: `${selectedAnalysis.yAxis} vs ${selectedAnalysis.xAxis}`,
                                      data: dataPoints,  // Data points added here
                                      backgroundColor: selectedAnalysis.chartType === 'pie'
                                        ? colorPalette
                                        : colorPalette[0],
                                      borderColor: selectedAnalysis.chartType === 'line'
                                        ? colorPalette[0]
                                        : colorPalette,
                                      borderWidth: 1
                                    }]
                                  };

                                  // Render the appropriate chart component
                                  switch (selectedAnalysis.chartType) {
                                    case 'bar':
                                      return <Bar data={chartData} />;
                                    case 'line':
                                      return <Line data={chartData} />;
                                    case 'pie':
                                      return <Pie data={chartData} />;
                                    case 'scatter':
                                      return <Scatter data={chartData} />;
                                    default:
                                      return <Bar data={chartData} />;
                                  }
                                })()}
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={() => setIsModalOpen(false)}
                              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};
export default Dashboard;