import { useState, useRef, useEffect } from "react";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import Navbar from "./Navbar";
import Footer from "./Footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);
const FILE_STORAGE_KEY = "excelUploadFile";
const CHART_SETTINGS_KEY = "excelChartSettings";
// Read any stored chart settings as the initial state. 
const getInitialChartSettings = () => {
  try {
    const stored = localStorage.getItem(CHART_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading chart settings", e);
  }
  return {};
};
const ExcelUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [columns, setColumns] = useState([]);
  
  // Use stored chart settings for initial state if they exist
  const initialSettings = getInitialChartSettings();
  const [xAxis, setXAxis] = useState(initialSettings.xAxis || "");
  const [yAxis, setYAxis] = useState(initialSettings.yAxis || "");
  const [chartType, setChartType] = useState(initialSettings.chartType || "bar");
  const chartRef = useRef(null);
  const fileInputRef = useRef(null);
  // Restore any uploaded file (and its columns) from localStorage on mount
  useEffect(() => {
    const storedFile = localStorage.getItem(FILE_STORAGE_KEY);
    if (storedFile) {
      try {
        const parsedFile = JSON.parse(storedFile);
        setUploadedFile(parsedFile);
        if (parsedFile && parsedFile.parsedData && parsedFile.parsedData.length > 0) {
          const cols = Object.keys(parsedFile.parsedData[0]);
          setColumns(cols);
        }
      } catch (e) {
        console.error("Error parsing stored file data", e);
      }
    }
  }, []);
  // When the columns update, check if the stored xAxis and yAxis still exist.
  // If not, clear them.
  useEffect(() => {
    if (columns.length > 0) {
      if (xAxis && !columns.includes(xAxis)) {
        setXAxis("");
      }
      if (yAxis && !columns.includes(yAxis)) {
        setYAxis("");
      }
    }
  }, [columns]);
  // Save chart settings to localStorage whenever they change
  useEffect(() => {
    const settings = { xAxis, yAxis, chartType };
    localStorage.setItem(CHART_SETTINGS_KEY, JSON.stringify(settings));
  }, [xAxis, yAxis, chartType]);
  // Store the uploaded file in localStorage whenever it changes
  useEffect(() => {
    if (uploadedFile) {
      localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(uploadedFile));
    }
  }, [uploadedFile]);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setProgress(null);
    setUploadedFile(null);
    localStorage.removeItem(FILE_STORAGE_KEY);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setProgress("Uploading...");
    setUploadedFile(null);

    if (!file) {
      setError("Please select an Excel file (.xls or .xlsx)");
      setProgress(null);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setProgress("Upload successful!");
      setFile(null);
      setUploadedFile(data.file);
      if (data.file && data.file.parsedData && data.file.parsedData.length > 0) {
        setColumns(Object.keys(data.file.parsedData[0]));
      }
      if (onUpload) onUpload(data.file);
    } catch (err) {
      setError(err.message);
      setProgress(null);
    }
  };
  const renderChart = () => {
    if (!uploadedFile || !uploadedFile.parsedData || !xAxis || !yAxis) return null;
    const labels = uploadedFile.parsedData.map((row) => row[xAxis]);
    const dataPoints = uploadedFile.parsedData.map((row) => Number(row[yAxis]));
    const colorPalette = [
      "#6366f1", "#f59e42", "#10b981", "#ef4444",
      "#3b82f6", "#f472b6", "#fbbf24", "#a78bfa",
      "#34d399", "#f87171", "#818cf8", "#facc15"
    ];
    const backgroundColors = labels.map((_, i) => colorPalette[i % colorPalette.length]);
    let chartData;
    if (chartType === "pie") {
      chartData = {
        labels,
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: dataPoints,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
        }],
      };
      return <Pie ref={chartRef} data={chartData} />;
    } else if (chartType === "bar") {
      chartData = {
        labels,
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: dataPoints,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          fill: true,
        }],
      };
      return <Bar ref={chartRef} data={chartData} />;
    } else if (chartType === "line") {
      chartData = {
        labels,
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: dataPoints,
          backgroundColor: backgroundColors[0],
          borderColor: backgroundColors[0],
          fill: false,
        }],
      };
      return <Line ref={chartRef} data={chartData} />;
    } else if (chartType === "scatter") {
      chartData = {
        labels,
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: labels.map((label, i) => ({ x: label, y: dataPoints[i] })),
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          showLine: false,
        }],
      };
      return <Scatter ref={chartRef} data={chartData} />;
    }
    return null;
  };
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 mt-15">
        {/* Upload Form Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Excel File
          </h2>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="cursor-pointer border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            {progress && <div className="text-indigo-600 text-sm">{progress}</div>}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="cursor-pointer bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-indigo-800 transition"
            >
              Upload
            </button>
          </form>
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
            <i className="fas fa-info-circle" />
            Only .xls or .xlsx files are supported.
          </div>
        </div>
        {/* File Preview & Data Table Card */}
        {uploadedFile && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                File Uploaded
              </h3>
              <p className="text-sm text-gray-700">Name: {uploadedFile.fileName}</p>
              <p className="text-sm text-gray-700">Size: {uploadedFile.fileSize} bytes</p>
              <p className="text-sm text-gray-700">
                Rows Parsed: {uploadedFile.parsedData?.length}
              </p>
              {/* Data Preview Table */}
              <div className="mt-5">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Preview</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs border">
                    <thead>
                      <tr>
                        {columns.map((col) => (
                          <th key={col} className="border px-2 py-1 bg-gray-100">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedFile.parsedData.slice(0, 3).map((row, idx) => (
                        <tr key={idx}>
                          {columns.map((col) => (
                            <td key={col} className="border px-2 py-1">
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Axis Selection and Chart Generation Card */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Generate Chart</h3>
              {/* Axis & Chart Type Selection */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-1">X-Axis:</label>
                  <select
                    value={xAxis}
                    onChange={(e) => setXAxis(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Y-Axis:</label>
                  <select
                    value={yAxis}
                    onChange={(e) => setYAxis(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Chart Type:</label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="bar">Bar</option>
                    <option value="line">Line</option>
                    <option value="pie">Pie</option>
                    <option value="scatter">Scatter</option>
                  </select>
                </div>
              </div>
              {/* Chart Preview Section */}
              {xAxis && yAxis && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Chart Preview</h4>
                  <div className="bg-white p-4 rounded shadow">
                    {renderChart()}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          const response = await fetch("/api/analysis", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              uploadId: uploadedFile._id,
                              xAxis,
                              yAxis,
                              chartType,
                              aiSummary: "",
                            }),
                          });
                          if (!response.ok) {
                            throw new Error("Failed to save analysis");
                          }
                          alert("Analysis saved successfully!");
                        } catch (error) {
                          console.error("Error saving analysis:", error);
                          alert("Failed to save analysis");
                        }
                      }}
                      className="cursor-pointer bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      Save Analysis
                    </button>
                    <button
                      onClick={() => {
                        const chart = chartRef.current;
                        if (chart) {
                          const link = document.createElement("a");
                          link.href = chart.toBase64Image();
                          link.download = `${chartType}-chart.png`;
                          link.click();
                        }
                      }}
                      className="cursor-pointer bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-indigo-800 transition"
                    >
                      Download Chart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ExcelUpload;