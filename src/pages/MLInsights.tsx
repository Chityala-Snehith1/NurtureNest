import React, { useState } from "react";
import { parse } from "papaparse";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "./MLInsights.css";

Chart.register(ArcElement, Tooltip, Legend);

interface DataEntry {
  name: string;
  value: number;
}

export default function MLInsights() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<DataEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ name: "", value: "" });
  const [error, setError] = useState<string>("");

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.name.endsWith(".csv")) {
        setError("Please upload a valid CSV file.");
        return;
      }

      setError("");
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    }
  };

  // Process CSV file
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result as string;
      parse(csvData, {
        header: true,
        complete: (result) => {
          const parsedData = result.data as DataEntry[];
          const validData = parsedData
            .map((entry) => ({
              name: entry.name,
              value: parseFloat(entry.value),
            }))
            .filter((entry) => entry.name && !isNaN(entry.value));

          if (validData.length === 0) {
            setError("No valid data found in the file.");
          } else {
            setData(validData);
            setError("");
          }
        },
        error: () => setError("Error parsing CSV file."),
      });
    };
    reader.readAsText(file);
  };

  // Handle manual data entry
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleAddData = () => {
    const { name, value } = newEntry;
    const parsedValue = parseFloat(value);

    if (!name || isNaN(parsedValue)) {
      setError("Please enter a valid name and numeric value.");
      return;
    }

    setData([...data, { name, value: parsedValue }]);
    setNewEntry({ name: "", value: "" });
    setError("");
  };

  const handleDelete = (index: number) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  };

  // Calculate average and prediction
  const average = data.length ? data.reduce((sum, entry) => sum + entry.value, 0) / data.length : 0;
  const prediction = average > 50 ? "High likelihood of success" : "Low likelihood of success";

  // Doughnut Chart Data
  const doughnutData = {
    labels: data.map((entry) => entry.name),
    datasets: [
      {
        label: "Data Analysis",
        data: data.map((entry) => entry.value),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 6,
      },
    ],
  };

  return (
    <div className="container">
      <h2>Gene Expression Analysis</h2>

      {/* CSV Upload Section */}
      <div className="upload-section">
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>

      {/* Error Message */}
      {error && <div className="error">{error}</div>}

      {/* Data Entry Section */}
      <div className="data-entry">
        <input
          type="text"
          name="name"
          value={newEntry.name}
          placeholder="Name"
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="value"
          value={newEntry.value}
          placeholder="Value"
          onChange={handleInputChange}
        />
        <button onClick={handleAddData}>Add Data</button>
      </div>

      {/* Data List */}
      {data.length > 0 && (
        <div className="data-list">
          <h3>Data List</h3>
          <ul>
            {data.map((entry, index) => (
              <li key={index}>
                {entry.name}: {entry.value}
                <button onClick={() => handleDelete(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prediction Result */}
      <div className="result">
        <h3>Prediction Result:</h3>
        <p>Average Value: {average.toFixed(2)}</p>
        <p>Prediction: {prediction}</p>
      </div>

      {/* Doughnut Chart */}
      {data.length > 0 && (
        <div className="chart-container">
          <h3>Data Analysis (Doughnut Chart)</h3>
          <Doughnut data={doughnutData} />
        </div>
      )}
    </div>
  );
}
