import React, { useState, useEffect, useCallback } from 'react';
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
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  const handleManualRefresh = () => {
    fetchDashboardData();
  };
  return (
    <div>
      {/* Always display the Navbar at the top */}
      <Navbar />
      {/* Main content area */}
      <main className="max-w-6xl mx-auto px-4 py-8 mt-15">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={handleManualRefresh}
              className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
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
        {/* Instead of an early return, we conditionally render inside the main content */}
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-8">{error}</div>
        ) : (
          <>
            {/* Recent Uploads */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Uploads</h2>
              </div>
              <div className="p-6">
                {uploads.length === 0 ? (
                  <p className="text-gray-500">No files uploaded yet</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploads
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 5)
                      .map((upload) => (
                        <div
                          key={upload._id}
                          className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition duration-200"
                        >
                          <h3 className="text-lg font-medium text-gray-900">{upload.fileName}</h3>
                          <p className="text-sm text-gray-500">
                            Uploaded on {new Date(upload.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-1 text-gray-600">
                            Size: {(upload.fileSize / 1000).toFixed(2)} KB
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            {/* Analysis Overview */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Analysis Overview</h2>
              </div>
              <div className="p-6">
                {analyses.length === 0 ? (
                  <p className="text-gray-500">No analyses performed yet</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analyses.map((analysis) => (
                      <div
                        key={analysis._id}
                        className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-lg shadow hover:shadow-lg transition duration-200"
                      >
                        <div className="mb-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            {analysis.chartType.charAt(0).toUpperCase() + analysis.chartType.slice(1)} Chart
                          </h3>
                          <p className="text-sm text-gray-600">
                            File: {analysis.upload?.fileName || 'Unknown file'}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">X-Axis:</span> {analysis.xAxis}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Y-Axis:</span> {analysis.yAxis}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-gray-400">
                            Created on {new Date(analysis.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedAnalysis(analysis);
                              setIsModalOpen(true);
                            }}
                            className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Analysis Details Modal */}
              {isModalOpen && selectedAnalysis && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Analysis Details
                      </h3>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        &times;
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
                          {/* If we have a saved chart image, display it. Otherwise, fall back to dynamic chart rendering */}
                          {selectedAnalysis.chartImage ? (
                            <img
                              src={selectedAnalysis.chartImage}
                              alt="Saved Chart"
                              className="w-full h-auto"
                            />
                          ) : (
                            (() => {
                              const data = selectedAnalysis.upload?.parsedData || [];
                              if (!Array.isArray(data) || data.length === 0) {
                                return <p className="text-gray-500">No chart data available</p>;
                              }
                              const labels = data.map((row) => row[selectedAnalysis.xAxis]);
                              const dataPoints = data.map((row) => Number(row[selectedAnalysis.yAxis]));
                              const colorPalette = [
                                "#6366f1", "#f59e42", "#10b981", "#ef4444",
                                "#3b82f6", "#f472b6", "#fbbf24", "#a78bfa",
                                "#34d399", "#f87171"
                              ];
                              const chartData = {
                                labels,
                                datasets: [{
                                  label: `${selectedAnalysis.yAxis} vs ${selectedAnalysis.xAxis}`,
                                  data: dataPoints,
                                  backgroundColor: selectedAnalysis.chartType === 'pie'
                                    ? colorPalette
                                    : colorPalette[0],
                                  borderColor: selectedAnalysis.chartType === 'line'
                                    ? colorPalette[0]
                                    : colorPalette,
                                  borderWidth: 1
                                }]
                              };
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
                            })()
                          )}
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
          </>
        )}
      </main>
      {/* Always display the Footer at the bottom */}
      <Footer />
    </div>
  );
};
export default Dashboard;