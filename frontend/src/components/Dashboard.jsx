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
  Legend,
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
  const [selectedImage, setSelectedImage] = useState(null);
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      // Fetch uploads.
      const uploadsRes = await fetch('/api/uploads', { headers });
      if (!uploadsRes.ok) throw new Error('Failed to fetch uploads');
      const uploadsData = await uploadsRes.json();
      // Fetch analyses.
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
  // Helper to capitalize first letter.
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  // Render dynamic chart if no saved image exists.
  const renderDynamicChart = (analysis) => {
    const data = analysis.upload?.parsedData || [];
    if (!Array.isArray(data) || data.length === 0) {
      return <p className="text-gray-500 text-center">No chart data available</p>;
    }
    const labels = data.map((row) => row[analysis.xAxis]);
    const dataPoints = data.map((row) => Number(row[analysis.yAxis]));
    const colorPalette = [
      '#6366f1', '#f59e42', '#10b981', '#ef4444',
      '#3b82f6', '#f472b6', '#fbbf24', '#a78bfa',
      '#34d399', '#f87171'
    ];
    const chartData = {
      labels,
      datasets: [
        {
          label: `${analysis.yAxis} vs ${analysis.xAxis}`,
          data: dataPoints,
          backgroundColor: analysis.chartType === 'pie' ? colorPalette : colorPalette[0],
          borderColor: analysis.chartType === 'line' ? colorPalette[0] : colorPalette,
          borderWidth: 1,
        },
      ],
    };
    switch (analysis.chartType) {
      case 'bar':
        return <Bar data={chartData} options={{ maintainAspectRatio: false }} />;
      case 'line':
        return <Line data={chartData} options={{ maintainAspectRatio: false }} />;
      case 'pie':
        return <Pie data={chartData} options={{ maintainAspectRatio: false }} />;
      case 'scatter':
        return <Scatter data={chartData} options={{ maintainAspectRatio: false }} />;
      default:
        return <Bar data={chartData} options={{ maintainAspectRatio: false }} />;
    }
  };
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={handleManualRefresh}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-200 transition"
            >
              Refresh
            </button>
            <Link
              to="/analyze"
              className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Upload New File
            </Link>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <>
            {/* Analysis Overview Section */}
            <section>
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-900">Saved Analysis</h2>
                </div>
                <div className="p-6">
                  {analyses.length === 0 ? (
                    <p className="text-gray-500">No analyses performed yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                      {analyses.map((analysis) => (
                        <div
                          key={analysis._id}
                          className="flex flex-col bg-gradient-to-r from-indigo-50 to-white p-6 rounded-lg shadow transition duration-200 hover:shadow-lg"
                        >
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {capitalize(analysis.chartType)} Chart
                            </h3>
                            <p className="text-gray-700 mt-1">
                              File: {analysis.upload?.fileName || 'Unknown file'}
                            </p>
                          </div>
                          <div className="mt-3">
                            <p className="text-gray-600">
                              <span className="font-semibold">X-Axis:</span> {analysis.xAxis}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Y-Axis:</span> {analysis.yAxis}
                            </p>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-500 text-sm">
                              Created on {new Date(analysis.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {analysis.aiSummary && (
                            <div className="mt-2">
                              <p className="text-indigo-700 font-medium">AI Insights</p>
                              <p className="text-gray-700 text-sm">{analysis.aiSummary}</p>
                            </div>
                          )}
                          <div className="mt-4 flex-grow">
                            <p className="text-gray-500 text-sm mb-2">Chart Visualization</p>
                            <div className="border border-gray-200 rounded overflow-hidden h-64">
                              {analysis.chartImage ? (
                                <img
                                  src={analysis.chartImage}
                                  alt="Saved Chart"
                                  className="w-full h-full object-contain cursor-pointer"
                                  onClick={() => setSelectedImage(analysis.chartImage)}
                                />
                              ) : (
                                // Render dynamic chart if no image exists.
                                <div className="h-full p-2">
                                  {renderDynamicChart(analysis)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
            {/* Recent Uploads Section */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-900">Recent Uploads</h2>
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
                            className="bg-gray-50 p-5 rounded-lg shadow transition duration-200 hover:shadow-md"
                          >
                            <h3 className="text-xl font-medium text-gray-900">{upload.fileName}</h3>
                            <p className="text-gray-600 mt-1">
                              Uploaded on {new Date(upload.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 mt-1">
                              Size: {(upload.fileSize / 1000).toFixed(2)} KB
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      {/* Modal for Enlarged Chart Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-70"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Enlarged Chart"
              className="max-w-full max-h-screen rounded-lg shadow-lg p-5"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 m-4 cursor-pointer text-gray-600 text-3xl leading-none"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default Dashboard;