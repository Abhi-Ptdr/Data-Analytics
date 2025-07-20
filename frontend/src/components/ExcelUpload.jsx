import { useState } from "react";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";

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

const ExcelUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setProgress(null);
    setUploadedFile(null);
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
        credentials: "include", // Important for cookies/JWT
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-lg mx-auto mt-10">
      <h2 className="text-lg font-bold text-gray-900 mb-2">Upload Excel File</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
        />
        {progress && (
          <div className="text-indigo-600 text-sm">{progress}</div>
        )}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <button
          type="submit"
          className="bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-indigo-800 transition"
        >
          Upload
        </button>
      </form>
      <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
        <i className="fas fa-info-circle" />
        Only .xls or .xlsx files are supported.
      </div>
      {uploadedFile && (
        <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200">
          <div className="font-semibold text-gray-700 mb-2">File Uploaded:</div>
          <div className="text-sm text-gray-600">Name: {uploadedFile.fileName}</div>
          <div className="text-sm text-gray-600">Size: {uploadedFile.fileSize} bytes</div>
          <div className="text-sm text-gray-600">Rows Parsed: {uploadedFile.parsedData.length}</div>
          {/* Data Preview Table */}
          <div className="mt-4">
            <div className="font-semibold text-gray-700 mb-2">Preview:</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="border px-2 py-1 bg-gray-100">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadedFile.parsedData.slice(0, 5).map((row, idx) => (
                    <tr key={idx}>
                      {columns.map((col) => (
                        <td key={col} className="border px-2 py-1">{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Axis Selection */}
          <div className="mt-4 flex gap-4 items-center">
            <div>
              <label className="block text-sm font-semibold mb-1">X-Axis:</label>
              <select
                value={xAxis}
                onChange={e => setXAxis(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">Select</option>
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Y-Axis:</label>
              <select
                value={yAxis}
                onChange={e => setYAxis(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">Select</option>
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Chart Type:</label>
              <select
                value={chartType}
                onChange={e => setChartType(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="scatter">Scatter</option>
              </select>
            </div>
          </div>
          {/* Chart Generation */}
          {xAxis && yAxis && (
            <div className="mt-6">
              <div className="font-semibold text-gray-700 mb-2">Chart Preview:</div>
              <div className="bg-white p-4 rounded shadow">
                {(() => {
                  const labels = uploadedFile.parsedData.map(row => row[xAxis]);
                  const dataPoints = uploadedFile.parsedData.map(row => Number(row[yAxis]));
                  const chartData = {
                    labels,
                    datasets: [
                      {
                        label: `${yAxis} vs ${xAxis}`,
                        data: dataPoints,
                        backgroundColor: "#6366f1",
                        borderColor: "#6366f1",
                        pointBackgroundColor: "#6366f1",
                        fill: chartType !== "scatter",
                      },
                    ],
                  };
                  if (chartType === "bar") return <Bar data={chartData} />;
                  if (chartType === "line") return <Line data={chartData} />;
                  if (chartType === "pie") return <Pie data={chartData} />;
                  if (chartType === "scatter") return <Scatter data={chartData} />;
                  return null;
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;