import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { FaClipboardList, FaRegFileAlt, FaUserCheck } from "react-icons/fa";
import { Line } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [overview, setOverview] = useState({
    totalData: 0,
    totalDraft: 0,
    totalApproval: 0,
  });
  const [recentData, setRecentData] = useState([]);

  useEffect(() => {
    fetchOverview();
    fetchRecentData();
  }, []);

  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/dashboard/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOverview(res.data);
    } catch (err) {
      console.error("Error fetching overview:", err);
    }
  };

  const fetchRecentData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/dashboard/recent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentData(res.data);
    } catch (err) {
      console.error("Error fetching recent data:", err);
    }
  };

  // Prepare data for the line chart
  const groupedData = recentData.reduce((acc, item) => {
    if (!item.created_at) return acc;
  
    const createdAt = new Date(item.created_at);
    if (isNaN(createdAt)) return acc;
  
    const date = createdAt.toISOString().split("T")[0]; 
  
    if (!acc[date]) {
      acc[date] = { Approved: 0, "Siap Approval": 0 };
    }
  
    if (item.status === "Approved") {
      acc[date].Approved += 1;
    } else if (item.status === "Siap Approval") {
      acc[date]["Siap Approval"] += 1;
    }
  
    return acc;
  }, {});

  const labels = Object.keys(groupedData).sort();

  const approvedData = labels.map((date) => groupedData[date].Approved);
  const siapApprovalData = labels.map((date) => groupedData[date]["Siap Approval"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Approved",
        data: approvedData,
        borderColor: "rgba(34,197,94,1)", // Tailwind green-500
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
      {
        label: "Siap Approval",
        data: siapApprovalData,
        borderColor: "rgba(239,68,68,1)", // Tailwind red-500
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Document Status Trend",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          maxTicksLimit: 10,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Documents",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        beginAtZero: true,
        grid: {
          color: "#e5e7eb", // Tailwind gray-200
        },
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Dashboard Overview
        </h1>

        {/* === Overview Cards === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-600 text-white p-6 rounded-lg shadow flex items-center gap-4">
            <FaClipboardList className="text-4xl opacity-80" />
            <div>
              <p className="text-sm uppercase text-blue-100">Total Data</p>
              <h2 className="text-3xl font-bold">{overview.totalData}</h2>
            </div>
          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow flex items-center gap-4">
            <FaRegFileAlt className="text-4xl opacity-80" />
            <div>
              <p className="text-sm uppercase text-yellow-100">Data Draft</p>
              <h2 className="text-3xl font-bold">{overview.totalDraft}</h2>
            </div>
          </div>

          <div className="bg-red-400 text-white p-6 rounded-lg shadow flex items-center gap-4">
            <FaUserCheck className="text-4xl opacity-80" />
            <div>
              <p className="text-sm uppercase text-green-100">
                Siap Approval
              </p>
              <h2 className="text-3xl font-bold">{overview.totalApproval}</h2>
            </div>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-lg shadow flex items-center gap-4">
            <FaUserCheck className="text-4xl opacity-80" />
            <div>
              <p className="text-sm uppercase text-green-100">
                Approval
              </p>
              <h2 className="text-3xl font-bold">{overview.totalApproved}</h2>
            </div>
          </div>
        </div>
        {/* <div className="bg-white p-6 rounded-lg shadow">
          <Line data={data} options={options} />
        </div> */}
      </div>
    </DashboardLayout>
  );
}