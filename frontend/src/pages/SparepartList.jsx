import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FaEdit, FaEye, FaFilePdf, FaArrowRight, FaSearch, FaAngleDoubleLeft, FaAngleDoubleRight, FaTrashAlt } from "react-icons/fa";
import ModalConfirm from "../components/ModalConfirm";
export default function SparepartList() {
    const [spareparts, setSpareparts] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedDocNo, setSelectedDocNo] = useState(null);
    
    useEffect(() => {
        fetchSpareparts();
    }, []);

    const fetchSpareparts = async () => {
        try {
            const res = await api.get("/spareparts/with-documents");
            setSpareparts(res.data);
            setFilteredData(res.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            toast.error("Gagal memuat data sparepart!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchTerm) {
          setFilteredData(spareparts);
          setCurrentPage(1); 
          return;
        }
        const lower = searchTerm.toLowerCase();
        const filtered = spareparts.filter((item) =>
          Object.values(item).some(
            (val) => val && val.toString().toLowerCase().includes(lower)
          )
        );
        setFilteredData(filtered);
        setCurrentPage(1); 
    }, [searchTerm, spareparts]);

    // 🔢 Hitung pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    console.log("Filtered Data:", currentItems);

    const handleContinue = (docNo, nextStep) => {
        localStorage.setItem("spis_doc_no", docNo);
        if (nextStep === "spps") {
        window.location.href = `/document-create?step=2`;
        } else if (nextStep === "spqs") {
        window.location.href = `/document-create?step=3`;
        }
    };

    const handleGeneratePDF = async (docNo) => {
        try {
        toast.info("Mengenerate PDF...");
        const res = await api.get(`/spareparts/${docNo}/generate-pdf`, {
            responseType: "blob",
        });
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${docNo}_ALL.pdf`);
        document.body.appendChild(link);
        link.click();
        toast.success("PDF berhasil digenerate!");
        } catch (err) {
        console.error("Error generating PDF:", err);
        toast.error("Gagal membuat PDF!");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
        case "draft":
            return "bg-yellow-100 text-yellow-700";
        case "submitted":
            return "bg-blue-100 text-blue-700";
        case "completed":
            return "bg-green-100 text-green-700";
        default:
            return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
        <DashboardLayout>
            <div className="text-center py-10 text-gray-500">
            Memuat data sparepart...
            </div>
        </DashboardLayout>
        );
    }

    const handleDelete = async () => {
        if (!selectedDocNo) return;
      
        try {
          toast.info("Menghapus dokumen...");
          await api.delete(`/spareparts/${encodeURIComponent(selectedDocNo)}`);
          toast.success(`Dokumen ${selectedDocNo} berhasil dihapus.`);
          fetchSpareparts();
        } catch (err) {
          console.error("Error deleting document:", err);
          toast.error("Gagal menghapus dokumen!");
        } finally {
          setShowConfirm(false);
          setSelectedDocNo(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-700 mb-6">
                Daftar Dokumen Sparepart
                </h1>

                {/* 🔍 Input Pencarian */}
                <div className="flex items-center mb-5 bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 w-full sm:w-1/2">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Cari dokumen, nama, status, dll..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>

                {filteredData.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <img
                        src="/folder.png"
                        alt="No Data"
                        className="mx-auto w-40 opacity-70 mb-3"
                        />
                        <p>Tidak ada data yang cocok.</p>
                    </div>
                    ) : (
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                        {/* 💡 Responsive Table Wrapper */}
                        <div className="overflow-x-auto relative">
                            <div className="min-w-[1100px]">
                                <table className="min-w-full border border-gray-200 text-sm">
                                    <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-3 border">No</th>
                                            <th className="px-4 py-3 border text-left">Document Number</th>
                                            <th className="px-4 py-3 border text-left">Part Number</th>
                                            <th className="px-4 py-3 border text-left">Created by</th>
                                            <th className="px-4 py-3 border text-left">Approved by</th>
                                            <th className="px-4 py-3 border text-center">SPIS</th>
                                            <th className="px-4 py-3 border text-center">SPPS</th>
                                            <th className="px-4 py-3 border text-center">SPQS</th>
                                            <th className="px-4 py-3 border text-center">Created at</th>
                                            <th className="px-4 py-3 border text-center">Aksi</th>
                                            <th className="px-4 py-3 border"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((item, index) => {
                                            const role = (localStorage.getItem("role") || "").toLowerCase();
                                            const normalize = (val) => (val || "").toLowerCase().trim();
                                            
                                            const isAllDraft =
                                            item.spis_status === "draft" &&
                                            item.spps_status === "draft" &&
                                            item.spqs_status === "draft";

                                            const isAllSubmitted =
                                            normalize.spis_status === "submitted" &&
                                            normalize.spps_status === "submitted" &&
                                            normalize.spqs_status === "submitted";

                                            const isAnySubmitted = [item.spis_status, item.spps_status, item.spqs_status].some(
                                            (status) => status === "submitted"
                                            );

                                            const isAllCompleted =
                                            normalize.spis_status === "completed" &&
                                            normalize.spps_status === "completed" &&
                                            normalize.spqs_status === "completed";

                                            const handleApprove = async () => {
                                            try {
                                                toast.info("Menyetujui dokumen...");
                                                await api.put(`/spareparts/approve/${item.doc_no}`, {
                                                approved_by: localStorage.getItem("user_name") || "Approver",
                                                });
                                                toast.success("Dokumen berhasil di-approve!");
                                                fetchSpareparts(); // refresh tabel
                                            } catch (err) {
                                                console.error("Error approving:", err);
                                                toast.error("Gagal approve dokumen!");
                                            }
                                            };

                                            return (
                                            <tr
                                                key={item.doc_no}
                                                className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                            >
                                                <td className="px-4 py-2 border text-center">{startIndex + index + 1}</td>
                                                <td className="px-4 py-2 border">{item.doc_no}</td>
                                                <td className="px-4 py-2 border">{item.part_number}</td>
                                                <td className="px-4 py-2 border">{item.created_by}</td>
                                                <td className="px-4 py-2 border">{item.approved_by || "-"}</td>

                                                {["spis_status", "spps_status", "spqs_status"].map((key) => (
                                                <td key={key} className="px-4 py-2 border text-center">
                                                    <span
                                                    className={`px-2 py-1 rounded text-[10px] font-semibold ${getStatusBadge(
                                                        item[key]
                                                    )}`}
                                                    >
                                                    {item[key]?.toUpperCase() || "-"}
                                                    </span>
                                                </td>
                                                ))}

                                                <td className="px-4 py-2 border text-center">
                                                {new Date(item.updated_at).toLocaleDateString("id-ID", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                })}
                                                </td>

                                                {/* === ACTION BUTTONS === */}
                                                <td className="px-4 py-2 border text-center">
                                                    <div className="flex justify-center flex-wrap gap-2">
                                                        {(() => {
                                                        if (role === "approval" && !isAllSubmitted && !isAllCompleted) {
                                                            return (
                                                                <button
                                                                    onClick={() => window.open(`/document/view/${encodeURIComponent(item.doc_no)}`, "_blank")}
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                                >
                                                                    <FaEye /> View
                                                                </button>
                                                            );
                                                        }

                                                        // Semua draft → hanya SPIS aktif
                                                        if (isAllDraft) {
                                                            return (
                                                            <>
                                                                <button
                                                                onClick={() => (window.location.href = `/document-create?step=1`)}
                                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                                >
                                                                <FaEdit /> SPIS
                                                                </button>
                                                                <button
                                                                disabled
                                                                className="bg-gray-300 text-gray-500 px-3 py-1 rounded flex items-center gap-1 cursor-not-allowed"
                                                                >
                                                                <FaArrowRight /> SPPS
                                                                </button>
                                                                <button
                                                                disabled
                                                                className="bg-gray-300 text-gray-500 px-3 py-1 rounded flex items-center gap-1 cursor-not-allowed"
                                                                >
                                                                <FaArrowRight /> SPQS
                                                                </button>
                                                            </>
                                                            );
                                                        }

                                                        // Sebagian submitted tapi belum semua
                                                        if (isAnySubmitted && !isAllSubmitted) {
                                                            return (
                                                            <>
                                                                <button
                                                                    onClick={() => window.open(`/document/view/${encodeURIComponent(item.doc_no)}`, "_blank")}
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                                >
                                                                <FaEye /> View
                                                                </button>

                                                                {item.spps_status === "draft" && item.spis_status === "submitted" && (
                                                                <button
                                                                    onClick={() => handleContinue(item.doc_no, "spps")}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1"
                                                                >
                                                                    <FaArrowRight /> Lanjut SPPS
                                                                </button>
                                                                )}

                                                                {item.spqs_status === "draft" && item.spps_status === "submitted" && (
                                                                <button
                                                                    onClick={() => handleContinue(item.doc_no, "spqs")}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1"
                                                                >
                                                                    <FaArrowRight /> Lanjut SPQS
                                                                </button>
                                                                )}
                                                            </>
                                                            );
                                                        }

                                                        // Semua submitted
                                                        if (isAllSubmitted) {
                                                            return (
                                                            <>
                                                                <button
                                                                onClick={() => window.open(`/document/view/${encodeURIComponent(item.doc_no)}`, "_blank")}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                                >
                                                                <FaEye /> View
                                                                </button>

                                                                {role === "approval" && (
                                                                <button
                                                                    onClick={handleApprove}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1"
                                                                >
                                                                    <FaFilePdf /> Approve
                                                                </button>
                                                                )}
                                                            </>
                                                            );
                                                        }

                                                        // Semua completed → View + PDF
                                                        if (isAllCompleted) {
                                                            return (
                                                            <>
                                                                <button
                                                                    onClick={() => window.open(`/document/view/${encodeURIComponent(item.doc_no)}`, "_blank")}
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                                >
                                                                <FaEye /> View
                                                                </button>
                                                                <button
                                                                    onClick={() => handleGeneratePDF(item.doc_no)}
                                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                                >
                                                                <FaFilePdf /> PDF
                                                                </button>
                                                            </>
                                                            );
                                                        }

                                                        // Default
                                                        return (
                                                            <>
                                                            <button
                                                                onClick={() => (window.location.href = `/document-create?step=1`)}
                                                                className={`px-3 py-1 rounded flex items-center gap-1 text-white ${
                                                                item.spis_status === "completed"
                                                                    ? "bg-green-600 hover:bg-green-700"
                                                                    : "bg-yellow-500 hover:bg-yellow-600"
                                                                }`}
                                                            >
                                                                <FaEdit /> SPIS
                                                            </button>

                                                            <button
                                                                onClick={() => handleContinue(item.doc_no, "spps")}
                                                                disabled={item.spis_status !== "completed"}
                                                                className={`px-3 py-1 rounded flex items-center gap-1 ${
                                                                item.spps_status === "completed"
                                                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                                                    : item.spis_status === "completed"
                                                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                }`}
                                                            >
                                                                <FaArrowRight /> SPPS
                                                            </button>

                                                            <button
                                                                onClick={() => handleContinue(item.doc_no, "spqs")}
                                                                disabled={item.spps_status !== "completed"}
                                                                className={`px-3 py-1 rounded flex items-center gap-1 ${
                                                                item.spqs_status === "completed"
                                                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                                                    : item.spps_status === "completed"
                                                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                }`}
                                                            >
                                                                <FaArrowRight /> SPQS
                                                            </button>
                                                            </>
                                                        );
                                                        })()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 border text-center">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedDocNo(item.doc_no);
                                                            setShowConfirm(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-800 flex items-center justify-center w-full h-full"
                                                        title="Hapus Dokumen"
                                                        >
                                                        <FaTrashAlt />
                                                    </button>
                                                </td>
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {filteredData.length > itemsPerPage && (
                            <div className="flex justify-end items-center gap-2 mt-6 pb-6 pr-6">
                                <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className={`px-3 py-2 rounded border ${
                                    currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-50 text-gray-700"
                                }`}
                                >
                                <FaAngleDoubleLeft/>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded border ${
                                    currentPage === i + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-white hover:bg-gray-50 text-gray-700"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                                ))}

                                <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className={`px-3 py-2 rounded border ${
                                    currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-50 text-gray-700"
                                }`}
                                >
                                <FaAngleDoubleRight/>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showConfirm && (
                <ModalConfirm
                    title="Hapus Dokumen"
                    message={`Apakah kamu yakin ingin menghapus dokumen ${selectedDocNo}?`}
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    onConfirm={handleDelete}
                    onCancel={() => {
                    setShowConfirm(false);
                    setSelectedDocNo(null);
                    }}
                />
            )}
        </DashboardLayout>
    );
}