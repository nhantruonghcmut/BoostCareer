// LineChartComponent.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { parse, format } from "date-fns";

// Đăng ký các thành phần
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Tuỳ chọn biểu đồ
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => `Giá trị: ${context.parsed.y}`,
      },
    },
    title: {
      display: true,
      text: "Biểu đồ tăng trưởng theo tháng",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const LineChartComponent = ({labelTitle, labelChoice, dataValue }) => {
  // Dữ liệu ví dụ
  const [data1, data2, data3, ...prop] = dataValue||[[], [], [], []];
  const data = {
    labels: labelChoice?.map((dateStr) =>
      format(parse(dateStr, "dd/MM/yyyy", new Date()), "dd/MM")
    ) || ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
    datasets: [
      {
        label: Array.isArray(labelTitle)? labelTitle[0]: "",
        data: Array.isArray(data1)? data1:[0, 0, 0, 0, 0],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(75, 192, 192)",
        pointBorderWidth: 2,
      },
      {
        label: Array.isArray(labelTitle)? labelTitle[1]: "",
        data: Array.isArray(data2)? data2:[0, 0, 0, 0, 0],
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "white",
        borderColor: "rgb(255, 206, 86)",
        pointBorderColor: "rgb(255, 206, 86)",
        pointBorderWidth: 2,
      },
      {
        label: Array.isArray(labelTitle)? labelTitle[2]: "",
        data: Array.isArray(data3)? data3:[0, 0, 0, 0, 0],
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "white",
        borderColor: "rgb(255, 99, 132)",
        pointBorderColor: "rgb(255, 99, 132)",
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        height: "90%",
        margin: "auto",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChartComponent;
