import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement);

const LineChart = () => {
  // Random data for shoplifting detections for each month
  const shopliftingData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 1);

  const data = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ], // Months as X-axis labels
    datasets: [
      {
        label: 'Shoplifting Detections',
        data: shopliftingData, // Randomly generated data
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Line background fill
        borderColor: 'rgba(75, 192, 192, 1)', // Line border color
        borderWidth: 2, // Line thickness
        pointRadius: 4, // Size of points
        pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Display legend for the chart
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw} detections`; // Tooltip label format
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Detections',
        },
        beginAtZero: true, // Start Y-axis at 0
      },
    },
  };

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <h3 style={{ textAlign: 'center' }}>Shoplifting Detections by Month</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
