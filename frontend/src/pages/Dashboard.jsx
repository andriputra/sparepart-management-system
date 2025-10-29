import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { FaClipboardList, FaRegFileAlt, FaUserCheck } from "react-icons/fa";

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

        {/* === Recent Data Table === */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Data Terbaru
          </h2>

          {recentData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs">
                    <th className="py-3 px-4 border-b">No. Dokumen</th>
                    <th className="py-3 px-4 border-b">Part Number</th>
                    <th className="py-3 px-4 border-b">Status</th>
                    <th className="py-3 px-4 border-b">Dibuat Oleh</th>
                    <th className="py-3 px-4 border-b">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {recentData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 border-b text-gray-800 font-medium">
                        {item.doc_no}
                      </td>
                      <td className="py-3 px-4 border-b">{item.part_number}</td>
                      <td
                        className={`py-3 px-4 border-b font-semibold ${
                          item.status === "draft"
                            ? "text-yellow-600"
                            : item.status === "ready"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </td>
                      <td className="py-3 px-4 border-b">{item.created_by}</td>
                      <td className="py-3 px-4 border-b">
                        {new Date(item.date).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">
              Belum ada data terbaru.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}