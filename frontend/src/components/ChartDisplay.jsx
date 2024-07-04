import React, { useState } from "react";
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ChartDisplay = ({ data }) => {
  const [chartType, setChartType] = useState("doughnut");

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "Transaction Distribution",
        color: "white",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case "pie":
        return <Pie data={data} options={chartOptions} />;
      case "bar":
        return <Bar data={data} options={chartOptions} />;
      default:
        return <Doughnut data={data} options={chartOptions} />;
    }
  };

  return (
    <div className=" p-6 rounded-lg w-full max-w-lg ">
      <h2 className="text-3xl font-bold mb-6 text-white text-center text-outline">
        Transaction Statistics
      </h2>
      <div className="h-[330px] w-full mb-6 ">{renderChart()}</div>
      <div className="flex justify-center space-x-4 ">
        <button
          className={`auth-input text-outline ${
            chartType === "doughnut" ? "bg-opacity-50" : ""
          }`}
          onClick={() => setChartType("doughnut")}
        >
          Doughnut
        </button>
        <button
          className={`auth-input text-outline ${
            chartType === "doughnut" ? "bg-opacity-50" : ""
          }`}
          onClick={() => setChartType("pie")}
        >
          Pie
        </button>
        <button
          className={`auth-input text-outline ${
            chartType === "doughnut" ? "bg-opacity-50" : ""
          }`}
          onClick={() => setChartType("bar")}
        >
          Bar
        </button>
      </div>
    </div>
  );
};

export default ChartDisplay;
