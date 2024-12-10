import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
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

  // Calculate total for percentage representation
  const total = counts.managers + counts.supermanagers;

  // Data for the Doughnut chart
  const data = {
    labels: ['Managers', 'Supermanagers'], // Labels for the chart
    datasets: [
      {
        data: total > 0 ? [counts.managers, counts.supermanagers] : [0, 0], // Avoid division by zero
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'], // Colors for each segment
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw; // Get the raw value
            const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
            return `${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        display: true, // Display legend for the chart
      },
    },
  };

  return (
    <div style={{ width: '50%', margin: 'auto' }}>
      <h3 style={{ textAlign: 'center' }}>Manager and Supermanager Distribution</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PieChart;
