import React from 'react';
import { Chart as ChartJS, Tooltip, Legend } from 'chart.js';
import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
import { Chart } from 'react-chartjs-2';

// Register Chart.js and Funnel plugin components
ChartJS.register(FunnelController, TrapezoidElement, Tooltip, Legend);

const FunnelChart = () => {
  // Random data for the funnel chart (first 8 months)
  const generateRandomLogs = () => {
    return Array.from({ length: 8 }, () => Math.floor(Math.random() * 500) + 100); // Generate random log counts
  };

  const randomLogData = generateRandomLogs();

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
    ], // First 8 months as labels
    datasets: [
      {
        label: 'Logs Generated',
        data: randomLogData, // Funnel data for 8 months
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(201, 203, 207, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ], // Colors for each month
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw} logs`; // Tooltip showing the number of logs
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
          text: 'Number of Logs',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '60%', margin: 'auto' }}>
      <h3 style={{ textAlign: 'center' }}>Funnel Chart for Logs Generated (First 8 Months)</h3>
      <Chart type="funnel" data={data} options={options} />
    </div>
  );
};

export default FunnelChart;
