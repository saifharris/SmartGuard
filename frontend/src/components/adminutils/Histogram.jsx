import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Histogram = () => {
  const [counts, setCounts] = useState({ supermanagers: 0, managers: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/counts");
        setCounts(res.data); // Set the counts for supermanagers and managers
      } catch (error) {
        console.error("Error fetching counts:", error);
        alert("Failed to fetch counts. Please try again.");
      }
    };

    fetchCounts();
  }, []);

  // Data for Managers and Supermanagers
  const data = {
    labels: ['Managers', 'Supermanagers'], // Labels for X-axis
    datasets: [
      {
        label: 'Count',
        data: [counts.managers, counts.supermanagers], // Use state values for data
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'], // Colors for each bar
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Disable legend since we have only one dataset
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Roles',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default Histogram;
