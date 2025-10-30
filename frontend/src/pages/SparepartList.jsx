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
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedDocNo, setSelectedDocNo] = useState(null);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [selectedApproveDocNo, setSelectedApproveDocNo] = useState(null);
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    
    useEffect(() => {
        fetchSpareparts();
    }, []);

    const fetchSpareparts = async () => {
        try {
            const res = await api.get("/spareparts/with-documents");
            const sorted = res.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            setSpareparts(sorted);
            setFilteredData(sorted);
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
        console.log("Delete clicked, selectedDocNo =", selectedDocNo);
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

    const confirmApprove = (docNo) => {
        setSelectedApproveDocNo(docNo);
        setShowApproveConfirm(true);
    };
    
    // 🔹 Fungsi untuk mengeksekusi approval (setelah konfirmasi)
    const handleApprove = async () => {
        console.log("Approved, selectedDocNo =", selectedApproveDocNo);
        if (!selectedApproveDocNo) return;
    
        try {
            toast.info("Menyetujui dokumen...");
            await api.put(`/spareparts/approve/${encodeURIComponent(selectedApproveDocNo)}`, {
                approved_by: localStorage.getItem("user_name") || "Approver",
            });
            toast.success("Dokumen berhasil di-approve!");
            fetchSpareparts();
        } catch (err) {
            console.error("Error approving:", err);
            toast.error("Gagal approve dokumen!");
        } finally {
            setShowApproveConfirm(false);
            setSelectedApproveDocNo(null);
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
                        <table className="min-w-full border border-gray-200 text-sm">
                            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 text-sm">
                                <tr>
                                    <th className="px-3 py-3 border">No</th>
                                    {/* <th className="px-3 py-3 border text-center">Part Image</th> */}
                                    <th className="px-3 py-3 border text-left">Part Number</th>
                                    <th className="px-3 py-3 border text-left">Created by</th>
                                    <th className="px-3 py-3 border text-left">Approved by</th>
                                    <th className="px-3 py-3 border text-center">SPIS</th>
                                    <th className="px-3 py-3 border text-center">SPPS</th>
                                    <th className="px-3 py-3 border text-center">SPQS</th>
                                    {/* <th className="px-3 py-3 border text-center">Created at</th> */}
                                    <th colSpan={2} className="px-3 py-3 border text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px]">
                                {currentItems.map((item, index) => {
                                    const role = (localStorage.getItem("role") || "").toLowerCase();

                                    const statuses = [
                                        item.spis_status,
                                        item.spps_status,
                                        item.spqs_status,
                                    ].map((s) => (s || "").toLowerCase());

                                    const isAllDraft = statuses.every((s) => s === "draft");
                                    const isAllSubmitted = statuses.every((s) => s === "submitted");
                                    const isAllCompleted = statuses.every((s) => s === "completed");
                                    const isAnySubmitted = statuses.some((s) => s === "submitted");

                                    return (
                                    <tr
                                        key={item.spis_doc_no}
                                        className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                    >
                                        <td className="px-3 py-2 border text-center">{startIndex + index + 1}</td>
                                        {/* <td className="px-3 py-2 border">
                                            {item.photo1 ? (
                                                <img
                                                    src={`${serverUrl}${item.photo1}`}
                                                    alt={item.part_number}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-400">No Image</span>
                                            )}
                                        </td> */}
                                        <td className="px-3 py-2 border">{item.part_number}</td>
                                        <td className="px-3 py-2 border">{item.created_by}</td>
                                        <td className="px-3 py-2 border">{item.approved_by || "-"}</td>

                                        {["spis_status", "spps_status", "spqs_status"].map((key) => {
                                            const status = item[key]?.toLowerCase();
                                            const type = key.split("_")[0]; 
                                            const docNo = item[`${type}_doc_no`]; 
                                            const pdfUrl = `/document/view/${type.toUpperCase()}/${encodeURIComponent(docNo)}`;

                                            return (
                                                <td key={key} className="px-3 py-2 border text-center">
                                                    {status === "submitted" || status === "completed" ? (
                                                        <a
                                                            href={pdfUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`px-2 py-1 rounded text-[10px] font-semibold ${getStatusBadge(status)} hover:underline`}
                                                        >
                                                            {status.toUpperCase()}
                                                        </a>
                                                    ) : (
                                                        <span
                                                            className={`px-2 py-1 rounded text-[10px] font-semibold ${getStatusBadge(status)}`}
                                                        >
                                                            {status?.toUpperCase() || "-"}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}

                                        {/* === ACTION BUTTONS === */}
                                        <td className="px-3 py-2 border text-center">
                                            <div className="flex justify-center flex-wrap gap-2">
                                                {(() => {

                                                // Semua draft → hanya SPIS aktif
                                                if (isAllDraft) {
                                                    return (
                                                    <>
                                                        <button
                                                            onClick={() => (window.location.href = `/document-create?step=1`)}
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-sm text-white px-3 py-1 rounded flex items-center gap-1"
                                                        >
                                                            <FaEdit /> SPIS
                                                        </button>
                                                        <button
                                                            disabled
                                                            className="bg-gray-300 text-gray-500 text-sm px-3 py-1 rounded flex items-center gap-1 cursor-not-allowed"
                                                        >
                                                            <FaArrowRight /> SPPS
                                                        </button>
                                                        <button
                                                            disabled
                                                            className="bg-gray-300 text-gray-500 text-sm px-3 py-1 rounded flex items-center gap-1 cursor-not-allowed"
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
                                                        {item.spps_status === "draft" && item.spis_status === "submitted" && (
                                                        <button
                                                            onClick={() => handleContinue(item.doc_no, "spps")}
                                                            disabled={role === "viewer"}
                                                            className={`px-3 py-1 rounded flex items-center gap-1 ${
                                                                role === "viewer"
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                : "bg-green-600 hover:bg-green-700 text-white"
                                                            }`}
                                                            title={role === "viewer" ? "Akses dibatasi untuk Viewer" : "Lihat Dokumen"}
                                                            >
                                                            <FaArrowRight /> Lanjut SPPS
                                                        </button>
                                                        )}

                                                        {item.spqs_status === "draft" && item.spps_status === "submitted" && (
                                                        <button
                                                            onClick={() => handleContinue(item.doc_no, "spqs")}
                                                            className={`px-3 py-1 rounded flex items-center gap-1 ${
                                                                role === "viewer"
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                : "bg-green-600 hover:bg-green-700 text-white"
                                                            }`}
                                                            title={role === "viewer" ? "Akses dibatasi untuk Viewer" : "Lihat Dokumen"}
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
                                                        <div className="py-1 px-2 rounded bg-gray-200 text-gray-500">
                                                            Ready For Approval
                                                        </div>

                                                        {role === "approval" && (
                                                            <button
                                                                onClick={() => confirmApprove(item.spis_doc_no)}
                                                                className="bg-red-300 hover:bg-red-700 hover:text-white text-red-800 px-3 py-1 rounded flex items-center gap-1"
                                                            >
                                                                <FaFilePdf /> Approve
                                                            </button>
                                                        )}
                                                    </>
                                                    );
                                                }

                                                // Semua completed → View + PDF + Label Approved
                                                if (isAllCompleted) {
                                                    return (
                                                        <div className="flex flex-row items-center gap-2">
                                                            <div className="flex gap-2">
                                                                <div className="bg-red-500 hover:bg-red-600 text-sm text-white text-white px-3 py-1 rounded flex items-center gap-1">
                                                                    <FaFilePdf /> Document Approved
                                                                </div>
                                                            </div>
                                                        </div>
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
                                        <td className="px-3 py-2 border text-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedDocNo(item.spis_doc_no);
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

            {/* Modal */}
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
            {showApproveConfirm && (
            <ModalConfirm
                title="Konfirmasi Approval"
                message={`Apakah kamu yakin ingin menyetujui dokumen ${selectedApproveDocNo}?`}
                confirmText="Ya, Approve"
                cancelText="Batal"
                onConfirm={handleApprove}
                onCancel={() => {
                setShowApproveConfirm(false);
                setSelectedApproveDocNo(null);
                }}
            />
            )}
        </DashboardLayout>
    );
}