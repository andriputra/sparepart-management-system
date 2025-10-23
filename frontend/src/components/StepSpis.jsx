import { useRef, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function StepSpis({ onNext, initialData }) {
  const defaultData = {
    doc_no: "",
    date: "",
    location: "Warehouse Jakarta",
    code: "",
    name: "",
    department: "Inventory Management",
    telephone: "",
    part_number: "",
    supplier: "",
    part_description: "",
    remarks: "",
    photo: null,
    part_material: [],
    inspection: {
      visual: "",
      part_system: "",
      length: "",
      width: "",
      height: "",
      weight: "",
      package_dimension: "",
      remarks: "",
    },
    created_by: "",
    approved_by: "",
  };

  const [data, setData] = useState({
    ...defaultData,
    ...initialData,
    part_material: initialData?.part_material || [],
    inspection: { ...defaultData.inspection, ...(initialData?.inspection || {}) },
  });
  
  const loadedRef = useRef(false);
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId && !loadedRef.current) {
      loadedRef.current = true; 
      api.get(`/spis/draft/${userId}`).then((res) => {
        if (res.data) {
          setData((prev) => ({
            ...prev,
            ...res.data,
            part_material: res.data.part_material || [],
            inspection: { ...prev.inspection, ...(res.data.inspection || {}) },
          }));
          toast.info("Loaded your saved draft.");
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

  const handleMaterialChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...data.part_material, value]
      : data.part_material.filter((m) => m !== value);
    setData({ ...data, part_material: updated });
  };

  const handleInspectionChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      inspection: { ...data.inspection, [name]: value },
    });
  };

  const handleNext = async () => {
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key === "photo" && data.photo) {
          formData.append("photo", data.photo);
        } else if (key === "inspection" || key === "part_material") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }

      const response = await api.post("/spis", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("SPIS saved:", response.data);
      alert("Form SPIS berhasil disimpan!");
      onNext(data);
    } catch (err) {
      console.error("Error saving SPIS:", err);
      alert("Gagal menyimpan SPIS");
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
  
      if (!data.part_number && !data.name) {
        toast.warning("Isi minimal Part Number atau Name sebelum menyimpan draft.");
        return;
      }
  
      let photoUrl = data.photo_url || null;
  
      // Jika user upload foto baru (File object)
      if (data.photo instanceof File) {
        const formData = new FormData();
        formData.append("photo", data.photo);
  
        const uploadRes = await api.post("/spis/upload-photo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
  
        photoUrl = uploadRes.data.photo_url;
      }
  
      // Siapkan data draft
      const draftData = { ...data, photo_url: photoUrl };
      delete draftData.photo; // hapus file object biar tidak error JSON
  
      // Simpan draft ke backend
      await api.post(
        "/spis/save-draft",
        {
          user_id: userId,
          data: draftData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      toast.success("Draft saved successfully!");
    } catch (err) {
      console.error("Error saving draft:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired, please login again.");
      } else {
        toast.error("Failed to save draft. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Step 1 - Spare Part Information Sheet (SPIS)
      </h2>

      {/* General Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Doc No.</label>
          <input
            type="text"
            name="doc_no"
            value={data.doc_no}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Auto / Manual"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Code</label>
          <input
            type="text"
            name="code"
            value={data.code}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={data.department}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Telephone</label>
          <input
            type="text"
            name="telephone"
            value={data.telephone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Part Info */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Part Details</h3>
        <label className="block text-sm mb-1">Part Number</label>
        <input
          type="text"
          name="part_number"
          value={data.part_number}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        />

        <label className="block text-sm mb-1">Supplier</label>
        <input
          type="text"
          name="supplier"
          value={data.supplier}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        />

        <label className="block text-sm mb-1">Part Description</label>
        <textarea
          name="part_description"
          value={data.part_description}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        ></textarea>

        <label className="block text-sm mb-1">Remarks</label>
        <textarea
          name="remarks"
          value={data.remarks}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        ></textarea>

        <label className="block text-sm mb-1">Upload Photo</label>
        <input
          type="file"
          name="photo"
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        />
        {data.photo_url && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">Preview:</p>
            <img
              src={data.photo_url}
              alt="Uploaded"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>

      {/* Material */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Part Material</h3>
        {["Rubber", "Metal", "Plastic", "Glass", "Other"].map((m) => (
          <label key={m} className="mr-4">
            <input
              type="checkbox"
              value={m}
              checked={data.part_material?.includes(m)}
              onChange={handleMaterialChange}
              className="mr-1"
            />
            {m}
          </label>
        ))}
      </div>

      {/* Inspection */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Inspection Detail</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            "visual",
            "part_system",
            "length",
            "width",
            "height",
            "weight",
            "package_dimension",
            "remarks",
          ].map((field) => (
            <div key={field}>
              <label className="block capitalize mb-1">
                {field.replace("_", " ")}
              </label>
              <input
                type="text"
                name={field}
                value={data.inspection[field]}
                onChange={handleInspectionChange}
                className="border p-2 w-full rounded"
              />
            </div>
          ))}
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

      <div className="mt-6 flex justify-between">
        <div className="flex gap-2">
        <button
          onClick={handleSaveDraft}
          type="button"
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
        >
          Save Draft
        </button>
        <button
          onClick={() => navigate("/spis-preview", { state: { data } })}
          type="button"
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Preview
        </button>
        </div>
        <button
          onClick={handleNext}
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}