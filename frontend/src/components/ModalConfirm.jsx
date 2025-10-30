import React from "react";

export default function ModalConfirm({
    title = "Konfirmasi",
    message = "Apakah Anda yakin?",
    confirmText = "Ya",
    cancelText = "Batal",
    onConfirm,
    onCancel,
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 text-gray-800">
                <h2 className="text-lg font-semibold mb-3 text-center">{title}</h2>
                <p className="text-sm text-center mb-5">{message}</p>
                <div className="flex justify-center gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                    {cancelText}
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    {confirmText}
                </button>
                </div>
            </div>
        </div>
    );
}