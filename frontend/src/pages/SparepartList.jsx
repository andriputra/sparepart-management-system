import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FaEdit, FaEye, FaFilePdf } from "react-icons/fa";

export default function SparepartList() {
    const [spareparts, setSpareparts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpareparts();
    }, []);

    const fetchSpareparts = async () => {
        try {
        const res = await api.get("/spareparts"); 
        setSpareparts(res.data);
        } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Gagal memuat data sparepart!");
        } finally {
        setLoading(false);
        }
    };

    const handleView = (id) => {
        window.location.href = `/document/view/${id}`;
    };
    const handleEdit = (id, type) => {
        if (type === "spis") {
          window.location.href = `/document/spis/edit/${id}`;
        }
      };
      
    const handleContinue = (docNo, nextStep) => {
        if (nextStep === "spps") {
            window.location.href = `/document/spps/${docNo}`;
        } else if (nextStep === "spqs") {
            window.location.href = `/document/spqs/${docNo}`;
        }
    };

    const handleGeneratePDF = async (id) => {
        try {
        toast.info("Menggenerate PDF...");
        const res = await api.get(`/spareparts/${id}/generate-pdf`, {
            responseType: "blob",
        });

        // Buat download otomatis
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `SPAREPART_${id}_ALL.pdf`);
        document.body.appendChild(link);
        link.click();

        toast.success("PDF berhasil digenerate!");
        } catch (err) {
        console.error("Error generating PDF:", err);
        toast.error("Gagal membuat PDF!");
        }
    };

    if (loading) {
        return (
        <DashboardLayout>
            <div className="text-center py-10 text-gray-500">Memuat data...</div>
        </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6 text-gray-700">Daftar Dokumen Sparepart</h1>

            {spareparts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                    <div className="text-center py-10 text-gray-500">
                    <img
                        src="/folder.png"
                        alt="No Data"
                        className="mx-auto w-40 opacity-70"
                    />
                    </div>
                    <p className="text-gray-500 mb-4">Belum ada data sparepart.</p>
            </div>
            ) : (
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 text-sm">
                    <tr>
                    <th className="px-4 py-2 border">No</th>
                    <th className="px-4 py-2 border">Doc No</th>
                    <th className="px-4 py-2 border">Nama Part</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Updated At</th>
                    <th className="px-4 py-2 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {spareparts.map((item, index) => (
                    <tr key={item.id} className="text-center text-sm">
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{item.doc_no}</td>
                        <td className="px-4 py-2 border">{item.name}</td>
                        <td
                        className={`px-4 py-2 border font-medium ${
                            item.status === "approved"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                        >
                        {item.status.toUpperCase()}
                        </td>
                        <td className="px-4 py-2 border">
                            {new Date(item.updated_at).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-4 py-2 border text-center">
                            {item.status === "draft" && (
                                <button
                                onClick={() => handleEdit(item.id, "spis")}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1 mx-auto"
                                >
                                <FaEdit /> Edit
                                </button>
                            )}

                            {item.status === "submitted" && item.progress_status === "step1" && (
                                <button
                                onClick={() => handleContinue(item.doc_no, "spps")}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 mx-auto"
                                >
                                Lanjutkan (SPPS)
                                </button>
                            )}

                            {item.status === "submitted" && item.progress_status === "step2" && (
                                <button
                                onClick={() => handleContinue(item.doc_no, "spqs")}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 mx-auto"
                                >
                                Lanjutkan (SPQS)
                                </button>
                            )}

                            {item.progress_status === "completed" && (
                                <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => handleView(item.id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                >
                                    <FaEye /> View
                                </button>
                                <button
                                    onClick={() => handleGeneratePDF(item.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                >
                                    <FaFilePdf /> PDF
                                </button>
                                </div>
                            )}
                            </td>       
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
        </DashboardLayout>
    );
}