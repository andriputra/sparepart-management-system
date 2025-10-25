import { useRef, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

const generateDocNo = async () => {
  try {
    const res = await api.get("/spis/next-docno");
    return res.data.nextDocNo;
  } catch (err) {
    console.error("Failed to generate doc no:", err);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `IM/SPIS/${year}/${month}/00001`;
  }
};

export default function StepSpis({ onNext, initialData }) {
  const navigate = useNavigate();
  const defaultData = {
    doc_no: "",
    date: "",
    location: "",
    code: "",
    name: "",
    department: "",
    telephone: "",
    part_number: "",
    supplier: "",
    part_description: "",
    description: "",
    photo: null,
    part_material: [],
    inspection: {
      visual_condition: "",
      part_system: "",
      length: "",
      width: "",
      height: "",
      weight: "",
      package_dimension: "",
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

  // 🔹 Load full_name, department, dan telephone user yang login
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;
        const res = await api.get(`/auth/user/${userId}`);
        const user = res.data;

        console.log("Fetched user info:", user);

        setData((prev) => ({
          ...prev,
          name: user.fullname || prev.name,
          department: user.department || prev.department,
          telephone: user.telephone || prev.telephone,
          created_by: user.fullname || prev.created_by,
        }));
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const existingDocNo = localStorage.getItem("spis_doc_no");
      if (existingDocNo) {
        setData((prev) => ({ ...prev, doc_no: existingDocNo }));
        return;
      }
      
      const newDocNo = await generateDocNo();
      setData((prev) => ({ ...prev, doc_no: newDocNo }));
      localStorage.setItem("spis_doc_no", newDocNo);
    };
  
    fetchInitialData();
  }, []);

  // 🔹 Load full_name user yang login
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        // Ambil info user dari backend
        const res = await api.get(`/auth/user/${userId}`);
        const fullName = res.data?.fullname || "";

        setData((prev) => ({ ...prev, created_by: fullName }));
      } catch (err) {
        console.error("Failed to fetch user name:", err);
      }
    };

    fetchUserName();
  }, []);
  
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
    setData((prev) => {
      let updated = prev.part_material || [];
  
      if (checked) {
        updated = [...updated, value];
      } else {
        updated = updated.filter((m) => m !== value);
        if (value === "Other") {
          return { ...prev, part_material: updated, other_material: "" };
        }
      }
  
      return { ...prev, part_material: updated };
    });
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
      const requiredFields = [
        { key: "doc_no", label: "SPIS Doc No" },
        { key: "date", label: "Date" },
        { key: "name", label: "Name" },
        { key: "location", label: "Location" },
        { key: "department", label: "Departemen" },
        { key: "code", label: "Kode" },
        { key: "telephone", label: "Telepon" },
        { key: "part_number", label: "Part Number" },
        { key: "part_description", label: "Part Deskripsi" },
        { key: "supplier", label: "Supplier" },
        { key: "detail_part", label: "Detail Part" },
        { key: "description", label: "Keterangan" },
      ];
  
      for (const field of requiredFields) {
        if (!data[field.key] || data[field.key].toString().trim() === "") {
          toast.error(`${field.label} wajib diisi.`);
          return;
        }
      }
  
      if (!data.part_material?.length) {
        toast.error("Part Material wajib dipilih.");
        return;
      }
  
      const requiredInspection = [
        "visual_condition",
        "part_system",
        "length",
        "width",
        "height",
        "weight",
        "package_dimension",
      ];
  
      for (const field of requiredInspection) {
        if (!data.inspection[field] || data.inspection[field].toString().trim() === "") {
          toast.error(`${field.replace("_", " ")} wajib diisi.`);
          return;
        }
      }
  
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("Please login first.");
        return;
      }
  
      let finalMaterials = data.part_material || [];
      if (finalMaterials.includes("Other") && data.other_material) {
        finalMaterials = finalMaterials.map((m) =>
          m === "Other" ? `Other: ${data.other_material}` : m
        );
      }
  
      const formData = new FormData();
  
      // 🔹 Append basic fields
      formData.append("user_id", userId);
      formData.append("status", "submitted");
      formData.append("doc_no", data.doc_no);
      formData.append("date", data.date);
      formData.append("location", data.location);
      formData.append("code", data.code);
      formData.append("name", data.name);
      formData.append("department", data.department);
      formData.append("telephone", data.telephone);
      formData.append("part_number", data.part_number);
      formData.append("supplier", data.supplier);
      formData.append("part_description", data.part_description);
      formData.append("description", data.description);
      formData.append("detail_part", data.detail_part);
      formData.append("created_by", data.created_by);
      formData.append("approved_by", data.approved_by || "");
  
      // 🔹 Append JSON fields
      formData.append("part_material", JSON.stringify(finalMaterials));
      formData.append("inspection", JSON.stringify(data.inspection || {}));
  
      // 🔹 Upload Part Images (max 8)
      if (data.part_images && data.part_images.length > 0) {
        data.part_images.forEach((img) => {
          if (img.file instanceof File) formData.append("part_images", img.file);
        });
  
        const imageDescriptions = data.part_images.map((img) => ({
          description: img.description || "",
        }));
  
        formData.append("part_image_descriptions", JSON.stringify(imageDescriptions));
      }
  
      // 🔹 Append main photos
      if (data.photo1 instanceof File) formData.append("photo1", data.photo1);
      else if (data.photo1_url) formData.append("photo1_url", data.photo1_url);
  
      if (data.photo2 instanceof File) formData.append("photo2", data.photo2);
      else if (data.photo2_url) formData.append("photo2_url", data.photo2_url);
  
      // 🔹 Submit to backend
      const response = await api.post("/spis", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      const spisId = response.data.id || localStorage.getItem("spis_id") || null;
      if (spisId) localStorage.setItem("spis_id", spisId);
  
      toast.success(response.data.message || "SPIS berhasil disimpan!");
      onNext({ ...data, spis_id: spisId });
    } catch (err) {
      console.error("Error saving SPIS:", err);
      toast.error("Gagal menyimpan SPIS");
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
      let finalMaterials = data.part_material || [];
      if (finalMaterials.includes("Other") && data.other_material) {
        finalMaterials = finalMaterials.map((m) =>
          m === "Other" ? `Other: ${data.other_material}` : m
        );
      }

      const draftData = { ...data, photo_url: photoUrl, part_material: finalMaterials };
      delete draftData.photo; 
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
      {/* General Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Doc No. <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="doc_no"
            value={data.doc_no}
            onChange={handleChange}
            className="border p-2 w-full rounded bg-gray-100 text-gray-600 cursor-not-allowed"
            placeholder="Auto / Manual"
            readOnly
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Location <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Code <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="code"
            value={data.code}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Department <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="department"
            value={data.department}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Telephone <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="telephone"
            value={data.telephone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
      </div>

      {/* Part Info */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Part Details</h3>
        <label className="block text-sm mb-1">Part Number <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="part_number"
          value={data.part_number}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
          required
        />

        <label className="block text-sm mb-1">Supplier <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="supplier"
          value={data.supplier}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
          required
        />

        <label className="block text-sm mb-1">Part Description <span className="text-red-500">*</span></label>
        <textarea
          name="part_description"
          value={data.part_description}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
          required
        ></textarea>

        <label className="block text-sm mb-1">Detail Part <span className="text-red-500">*</span></label>
        <textarea
          name="detail_part"
          value={data.detail_part}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
          required
        ></textarea>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Upload Part Image</h3>
          
          <p className="text-sm mb-2">Part Image 1 <span className="text-red-500">*</span></p>
          <div className="flex items-stretch gap-6">
            {/* 🖼️ Preview Image */}
            <div className="w-40 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 overflow-hidden">
              {data.photo1_url || data.photo1 ? (
                <img
                  src={
                    data.photo1_url
                      ? data.photo1_url
                      : URL.createObjectURL(data.photo1)
                  }
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-400 text-sm text-center px-2">No Image</span>
              )}
            </div>

            {/* 📂 Upload Box */}
            <div className="flex-1">
              <div className="h-full border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                <input
                  type="file"
                  name="photo1"
                  id="photoUpload1"
                  onChange={handleChange}
                  className="hidden"
                />
                <label
                  htmlFor="photoUpload1"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 text-xs rounded hover:bg-blue-700 transition"
                >
                  Upload Photo
                </label>

                <p className="text-xs text-gray-500 mt-2">
                  Format: JPG, PNG, JPEG (max 2MB)
                </p>

                {/* Tombol Delete */}
                {(data.photo1 || data.photo1_url) && (
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, photo1: null, photo1_url: null })
                    }
                    className="mt-3 text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm mt-3 mb-2">Part Image 2 <span className="text-red-500">*</span></p>
          <div className="flex items-stretch gap-6">
            {/* 🖼️ Preview Image */}
            <div className="w-40 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 overflow-hidden">
              {data.photo2_url || data.photo2 ? (
                <img
                  src={
                    data.photo2_url
                      ? data.photo2_url
                      : URL.createObjectURL(data.photo2)
                  }
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-400 text-sm text-center px-2">No Image</span>
              )}
            </div>

            {/* 📂 Upload Box */}
            <div className="flex-1">
              <div className="h-full border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                <input
                  type="file"
                  name="photo2"
                  id="photoUpload2"
                  onChange={handleChange}
                  className="hidden"
                />
                <label
                  htmlFor="photoUpload2"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 text-xs rounded hover:bg-blue-700 transition"
                >
                  Upload Photo
                </label>

                <p className="text-xs text-gray-500 mt-2">
                  Format: JPG, PNG, JPEG (max 2MB)
                </p>

                {/* Tombol Delete */}
                {(data.photo2 || data.photo2_url) && (
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, photo2: null, photo2_url: null })
                    }
                    className="mt-3 text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Material */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Part Material</h3>
          {["Rubber", "Metal", "Plastic", "Glass", "Other"].map((m) => (
          <label key={m} className="mr-4 inline-flex items-center">
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

        {/* Jika user memilih "Other" maka tampilkan input tambahan */}
        {data.part_material?.includes("Other") && (
          <div className="mt-3">
            <label className="block text-sm text-gray-700 mb-1">
              Please specify other material:
            </label>
            <input
              type="text"
              value={data.other_material || ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, other_material: e.target.value }))
              }
              placeholder="Enter material name"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Inspection */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Inspection Detail</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            "visual_condition",
            "part_system",
            "length",
            "width",
            "height",
            "weight",
            "package_dimension",
          ].map((field) => {
            let suffix = "";
            if (["length", "width", "height"].includes(field)) {
              suffix = "mm";
            } else if (field === "weight") {
              suffix = "kg";
            }

            const isNumeric = ["length", "width", "height", "weight", "package_dimension"].includes(field);
            return (
              <div key={field}>
                <label className="block capitalize mb-1 text-sm">
                  {field.replace("_", " ")} <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    name={field}
                    value={data.inspection[field]}
                    onChange={(e) => {
                      const { value } = e.target;

                      if (isNumeric && value !== "" && !/^\d*\.?\d*$/.test(value)) {
                        return; 
                      }

                      handleInspectionChange(e);
                    }}
                    placeholder={isNumeric ? "Enter number" : ""}
                    className="border p-2 w-full rounded pr-10"
                    required
                  />
                  {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      {suffix}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3">
        <label className="block text-sm mb-1">Keterangan <span className="text-red-500">*</span></label>
        <textarea
          name="description"
          value={data.description}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
          required
        ></textarea>
      </div>

      {/* Tambahkan field Upload Part Image dan Field Keterangannya, bisa dii tambah user sampai dengan 8x */}
      {/* 🔹 Upload Part Images (Max 8) */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Upload Part Images (Max 8)</h3>

        {data.part_images?.map((img, index) => (
          <div key={index} className="mb-6 border border-gray-200 p-4 rounded-md bg-gray-50">
            <div className="flex items-start gap-6">
              {/* 🖼️ Preview Image */}
              <div className="w-40 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 overflow-hidden">
                {img.file || img.url ? (
                  <img
                    src={img.url ? img.url : URL.createObjectURL(img.file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center px-2">No Image</span>
                )}
              </div>

              {/* 📂 Upload & Description */}
              <div className="flex-1">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex items-start justify-between bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-start">
                  <input
                    type="file"
                    accept="image/*"
                    id={`photoUpload-${index}`}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setData((prev) => {
                        const updated = [...(prev.part_images || [])];
                        updated[index] = { ...updated[index], file };
                        return { ...prev, part_images: updated };
                      });
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor={`photoUpload-${index}`}
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 text-xs rounded hover:bg-blue-700 transition"
                  >
                    Upload Photo {index + 1}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, JPEG (max 2MB)</p>
                  </div>
                  {/* 🗑 Tombol Hapus */}
                  <button
                    type="button"
                    onClick={() => {
                      setData((prev) => {
                        const updated = [...(prev.part_images || [])];
                        updated.splice(index, 1);
                        return { ...prev, part_images: updated };
                      });
                    }}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm flex items-center gap-1"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                {/* 📝 Description */}
                <div className="mt-2">
                  <textarea
                    value={img.description || ""}
                    onChange={(e) => {
                      const desc = e.target.value;
                      setData((prev) => {
                        const updated = [...(prev.part_images || [])];
                        updated[index] = { ...updated[index], description: desc };
                        return { ...prev, part_images: updated };
                      });
                    }}
                    placeholder="Masukkan keterangan untuk gambar ini"
                    className="border p-2 w-full rounded text-sm"
                    rows={2}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* ➕ Add New Image */}
        {(!data.part_images || data.part_images.length < 8) && (
          <button
            type="button"
            onClick={() =>
              setData((prev) => ({
                ...prev,
                part_images: [...(prev.part_images || []), { file: null, description: "" }],
              }))
            }
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Add Image
          </button>
        )}
      </div>

      {/* Created / Approved Hidden Area*/}
      <div className="mt-6 grid grid-cols-2 gap-4 hidden">
        <div>
          <label className="block text-sm mb-1">Created By</label>
          <input
            type="text"
            name="created_by"
            value={data.created_by}
            onChange={handleChange}
            readOnly
            className="border p-2 w-full rounded bg-gray-100 text-gray-600 cursor-not-allowed"
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

      <div className="mt-6 flex justify-between border-t pt-6">
        <div className="flex gap-2">
        <button
          onClick={handleSaveDraft}
          type="button"
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
        >
          Save Draft
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