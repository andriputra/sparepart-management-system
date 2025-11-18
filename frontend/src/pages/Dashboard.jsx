import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { FaClipboardList, FaRegFileAlt, FaUserCheck, FaUserEdit } from "react-icons/fa";
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
      console.log('Fatch Data', res)
      setOverview(res.data);
      setOverview((prev) => ({
        ...res.data,
      }));
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
    const date = new Date(item.created_at).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = { Approved: 0, "Siap Approval": 0 };
    if (item.status === "Approved") acc[date].Approved += 1;
    else if (item.status === "Siap Approval") acc[date]["Siap Approval"] += 1;
    return acc;
  }, {});

  const labels = Object.keys(groupedData).sort();

  const approvedData = labels.map((date) => groupedData[date].Approved);
  const siapApprovalData = labels.map((date) => groupedData[date]["Siap Approval"]);


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
            <FaUserEdit className="text-4xl opacity-80" />
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
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Completion Rate</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${(overview.totalApproved / overview.totalData) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {overview.totalApproved} of {overview.totalData} approved
          </p>
        </div>
        {/* === Recent Data Chart === */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent Activity Trend</h2>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Approved",
                    data: approvedData,
                    borderColor: "#16a34a",
                    backgroundColor: "rgba(22,163,74,0.2)",
                    tension: 0.4,
                  },
                  {
                    label: "Siap Approval",
                    data: siapApprovalData,
                    borderColor: "#facc15",
                    backgroundColor: "rgba(250,204,21,0.2)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
      </div>
    </DashboardLayout>
  );
}