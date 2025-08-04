import React from 'react';
import { Pie, Bar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

export const PieChart = ({ data, options }) => {
  return <Pie data={data} options={options} />;
};

export const BarChart = ({ data, options }) => {
  return <Bar data={data} options={options} />;
};

export const ScatterChart = ({ data, options }) => {
  return <Scatter data={data} options={options} />;
};