import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function StepSpps({ onNext, onPrev, initialData }) {
  const navigate = useNavigate();

  const defaultData = {
    doc_no: "",
    part_number: "",
    supplier: "",
    part_description: "",
    remarks: "",
    date: "",
    qty: "",
    part_weight: "",
    part_dimension: "",
    created_by: "",
    approved_by: "",
    package_material: "",
    package_code: "",
    package_description: "",
    illustration_part: null,
    illustration_package: null,
  };

  const [data, setData] = useState({
    ...defaultData,
    ...initialData,
  });

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      api.get(`/spps/draft/${userId}`).then((res) => {
        if (res.data) {
          setData((prev) => ({ ...prev, ...res.data }));
          toast.info("Loaded your saved SPPS draft.");
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setData({ ...data, [name]: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSaveDraft = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        toast.error("Please login first.");
        return;
      }

      if (!data.date) {
        toast.warning("Tanggal wajib diisi sebelum lanjut.");
        return;
      }

      await api.post(
        "/spps/save-draft",
        { user_id: userId, data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("SPPS draft saved successfully!");
    } catch (err) {
      console.error("Error saving draft:", err);
      toast.error("Failed to save draft");
    }
  };

  const handleNext = async () => {
    try {
      const formData = new FormData();
      const userId = localStorage.getItem("user_id")
      Object.keys(data).forEach((key) => {
        if (data[key] instanceof File) {
          formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });

      if (!data.date) {
        toast.warning("Tanggal wajib diisi sebelum lanjut.");
        return;
      }
      
      if (userId) {
        formData.append("user_id", userId); // tambahkan user_id
      }

      const response = await api.post("/spps", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("SPPS saved successfully!");
      onNext(data);
    } catch (err) {
      console.error("Error saving SPPS:", err);
      toast.error("Failed to save SPPS");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Step 2 - Spare Part Package Sheet (SPPS)
      </h2>

      {/* General Info */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Doc No", name: "doc_no", type: "text" },
          { label: "Date", name: "date", type: "date" },
          { label: "Part Number", name: "part_number", type: "text" },
          { label: "Supplier", name: "supplier", type: "text" },
          { label: "Part Description", name: "part_description", type: "text" },
          { label: "Remarks", name: "remarks", type: "text" },
          { label: "Qty", name: "qty", type: "number" },
          { label: "Part Weight (Kg)", name: "part_weight", type: "text" },
          { label: "Part Dimension (mm)", name: "part_dimension", type: "text" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm mb-1">{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              value={data[f.name]}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}
      </div>

      {/* Packaging Info */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Package Information</h3>
        <label className="block text-sm mb-1">Package Material</label>
        <input
          type="text"
          name="package_material"
          value={data.package_material}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        />

        <label className="block text-sm mb-1">Package Code</label>
        <input
          type="text"
          name="package_code"
          value={data.package_code}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        />

        <label className="block text-sm mb-1">Package Description</label>
        <textarea
          name="package_description"
          value={data.package_description}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
          placeholder="Describe package or shipment note"
        ></textarea>
      </div>

      {/* Upload Illustration */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Illustrations</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Illustration Part</label>
            <input
              type="file"
              name="illustration_part"
              onChange={handleChange}
              className="border p-2 w-full rounded mb-3"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Illustration Package</label>
            <input
              type="file"
              name="illustration_package"
              onChange={handleChange}
              className="border p-2 w-full rounded mb-3"
            />
          </div>
        </div>
      </div>

      {/* Created / Approved */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Created By</label>
          <input
            type="text"
            name="created_by"
            value={data.created_by}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Approved By</label>
          <input
            type="text"
            name="approved_by"
            value={data.approved_by}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            type="button"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Save Draft
          </button>
          <button
            onClick={() => navigate("/spps-preview", { state: { data } })}
            type="button"
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          >
            Preview
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}