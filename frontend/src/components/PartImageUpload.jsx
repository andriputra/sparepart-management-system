import React from "react";

export default function PartImageUpload({
  label = "Part Image",
  name,
  file,
  previewUrl,
  onChange,
  onDelete,
  required = false,
}) {
  return (
    <div className="mb-6">
      <p className="text-sm mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div className="flex items-stretch gap-6">
        {/* 🖼️ Preview Image */}
        <div className="w-40 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          ) : file instanceof File ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <span className="text-gray-400 text-sm text-center px-2">
              No Image
            </span>
          )}
        </div>

        {/* 📂 Upload Box */}
        <div className="flex-1">
          <div className="h-full border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
            <input
              type="file"
              name={name}
              id={name}
              onChange={onChange}
              className="hidden"
            />
            <label
              htmlFor={name}
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 text-xs rounded hover:bg-blue-700 transition"
            >
              Upload Photo
            </label>

            <p className="text-xs text-gray-500 mt-2">
              Format: JPG, PNG, JPEG (max 10MB)
            </p>

            {/* Tombol Delete */}
            {(file || previewUrl) && (
              <button
                type="button"
                onClick={onDelete}
                className="mt-3 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}