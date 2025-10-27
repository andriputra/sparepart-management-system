import { useRef, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import PartImageUpload from "./PartImageUpload";

const generateDocNo = async () => {
  try {
    const res = await api.get("/spps/next-docno");
    return res.data.nextDocNo;
  } catch (err) {
    console.error("Failed to get doc no:", err);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `IM/SPPS/${year}/${month}/00001`;
  }
};

export default function StepSpps({ onNext, onPrev, initialData }) {
  const loadedRef = useRef(false);

  const defaultData = {
    doc_no: "",
    date: "",
    part_number: "",
    supplier: "",
    part_description: "",
    qty: "",
    part_weight: "",
    part_dimension: "",
    detail_parts: "",
    created_by: "",
    approved_by: "",
    package_material: "",
    package_code: "",
    package_detail: "",
    illustration_part: null,
  };

  const [data, setData] = useState({
    ...defaultData,
    ...(initialData
      ? {
          // hanya ambil field yang relevan dari SPIS
          date: initialData.date,
          part_number: initialData.part_number,
          supplier: initialData.supplier,
          part_description: initialData.part_description,
          detail_parts: initialData.detail_part,
          part_weight: initialData.inspection?.weight,
          part_dimension: initialData.inspection?.package_dimension,
          created_by: initialData.name,
          illustration_part: initialData.photo1_url || initialData.photo1,
        }
      : {}),
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // === Generate doc no ===
  useEffect(() => {
    const initDocNo = async () => {
      const savedDocNo = localStorage.getItem("spps_doc_no");
      if (savedDocNo) {
        setData((prev) => ({ ...prev, doc_no: savedDocNo }));
        return;
      }
      const newDocNo = await generateDocNo();
      setData((prev) => ({ ...prev, doc_no: newDocNo }));
      localStorage.setItem("spps_doc_no", newDocNo);
    };
    initDocNo();
  }, []);

  // === Load user fullname ===
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;
        const res = await api.get(`/auth/user/${userId}`);
        const fullName = res.data?.fullname || "";
        setData((prev) => ({ ...prev, created_by: fullName }));
      } catch (err) {
        console.error("Failed to fetch user name:", err);
      }
    };
    fetchUserName();
  }, []);

  // === Load draft ===
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId && !loadedRef.current) {
      loadedRef.current = true;
      api.get(`/spps/draft/${userId}`).then((res) => {
        if (res.data) {
          setData((prev) => ({ ...prev, ...res.data }));
          toast.info("Loaded your saved SPPS draft.");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!initialData || Object.keys(initialData).length === 0) return;
  
    setData((prev) => {
      if (Object.keys(prev).some((key) => prev[key])) return prev;
  
      const updated = {
        ...prev,
        date: initialData.date || "",
        part_number: initialData.part_number || "",
        supplier: initialData.supplier || "",
        part_description: initialData.part_description || "",
        part_weight: initialData.inspection?.weight || "",
        part_dimension: initialData.inspection?.package_dimension || "",
        detail_parts: initialData.detail_part || "",
        created_by: initialData.name || "",
        illustration_part:
          initialData.photo1_url ||
          initialData.photo1 ||
          null,
      };
      return updated;
    });
  }, [initialData]);

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

  // const handleNext = async () => {
  //   try {
  //     const formData = new FormData();
  //     const userId = localStorage.getItem("user_id");
  //     const spisId = localStorage.getItem("spis_id");

  //     if (!spisId) {
  //       toast.error("SPIS ID tidak ditemukan. Silakan mulai dari Step 1 (SPIS).");
  //       return;
  //     }

  //     Object.keys(data).forEach((key) => {
  //       if (data[key] instanceof File) {
  //         formData.append(key, data[key]);
  //       } else {
  //         formData.append(key, data[key]);
  //       }
  //     });

  //     formData.append("spis_id", spisId);
  //     formData.append("user_id", userId);

  //     const response = await api.post("/spps", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     toast.success("SPPS saved successfully!");
  //     onNext(data);
  //   } catch (err) {
  //     console.error("Error saving SPPS:", err);
  //     toast.error("Failed to save SPPS");
  //   }
  // };
  const handleNext = async () => {
    try {
      const formData = new FormData();
      const userId = localStorage.getItem("user_id");
      const spisId = localStorage.getItem("spis_id");
      const existingSppsId = localStorage.getItem("spps_id");
  
      if (!spisId) {
        toast.error("SPIS ID tidak ditemukan. Silakan mulai dari Step 1 (SPIS).");
        return;
      }
  
      // 🔹 Hanya field yang memang dikirim ke tabel SPPS
      const allowedFields = [
        "doc_no",
        "date",
        "part_number",
        "supplier",
        "part_description",
        "qty",
        "part_weight",
        "part_dimension",
        "package_material",
        "package_code",
        'detail_part',
        "package_detail",
        "created_by",
        "approved_by",
      ];
  
      allowedFields.forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
  
      // 🔹 Upload file (package, illustration, result)
      for (let i = 0; i < 4; i++) {
        if (data[`package_${i}`] instanceof File) {
          formData.append(`package_${i}`, data[`package_${i}`]);
        }
      }
  
      for (let i = 0; i < 2; i++) {
        if (data[`package_illustration_${i}`] instanceof File) {
          formData.append(`package_illustration_${i}`, data[`package_illustration_${i}`]);
        }
      }
  
      if (data.result_illustration instanceof File) {
        formData.append("result_illustration", data.result_illustration);
      }
  
      // Tambahkan hubungan SPIS dan User
      formData.append("spis_id", spisId);
      formData.append("user_id", userId);
  
      let response;
  
      if (existingSppsId) {
        // 🟡 Jika sudah pernah dibuat → UPDATE
        response = await api.put(`/spps/${existingSppsId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.info("SPPS updated successfully!");
      } else {
        // 🟢 Jika baru pertama kali → INSERT
        response = await api.post("/spps", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        // Simpan id SPPS ke localStorage untuk referensi update berikutnya
        if (response.data?.id) {
          localStorage.setItem("spps_id", response.data.id);
        }
  
        toast.success("SPPS created successfully!");
      }
  
      onNext({ ...data, spps_id: response?.data?.id || existingSppsId });
    } catch (err) {
      console.error("Error saving SPPS:", err);
      toast.error("Failed to save SPPS");
    }
  };

  return (
    <div>
      {/* General Info */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Doc No", name: "doc_no", type: "text", readOnly: true },
          { label: "Date", name: "date", type: "date", readOnly: true },
          { label: "Part Number", name: "part_number", type: "text", readOnly: true },
          { label: "Supplier", name: "supplier", type: "text", readOnly: true },
          { label: "Part Description", name: "part_description", type: "text", readOnly: true },
          { label: "Detail Parts", name: "detail_parts", type: "text", readOnly: true },
          { label: "Part Weight (Kg)", name: "part_weight", type: "text", readOnly: true },
          { label: "Part Dimension (P X L X T)", name: "part_dimension", type: "text", readOnly: true },
          { label: "Qty", name: "qty", type: "number" }
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm mb-1">{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              value={data[f.name] || ""}
              onChange={handleChange}
              readOnly={f.readOnly || false}
              className={`border p-2 w-full rounded ${
                f.readOnly ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""
              }`}
            />
          </div>
        ))}
      </div>

      {/* Package Info */}
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

        <label className="block text-sm mb-1">Package Detail</label>
        <textarea
          name="package_detail"
          value={data.package_detail}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
          placeholder=""
        ></textarea>
      </div>

      {/* Illustration Part (auto from SPIS Part Image 1) */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Illustrations</h3>
        <hr />
        <div className="mt-4">
          <p className="mb-2 text-sm">Illustration Part (Auto from SPIS)</p>
          <div className="w-40 h-40 border border-dashed border-gray-300 rounded-md bg-gray-50 overflow-hidden flex items-center justify-center">
            {data.illustration_part ? (
              <img
                src={data.illustration_part}
                alt="Illustration Part"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Image</span>
            )}
          </div>
        </div>

        {/* Illustration Package (manual upload) */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">Package (Max 4 Images)</h4>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <PartImageUpload
                key={`package_${i}`}
                label={`Package Image ${i + 1}`}
                name={`package_${i}`}
                file={data[`package_${i}`]}
                previewUrl={data[`package_${i}_url`]}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setData((prev) => ({
                      ...prev,
                      [`package_${i}`]: file,
                      [`package_${i}_url`]: url,
                    }));
                  }
                }}
                onDelete={() =>
                  setData((prev) => ({
                    ...prev,
                    [`package_${i}`]: null,
                    [`package_${i}_url`]: null,
                  }))
                }
              />
            ))}
          </div>
        </div>

        {/* Package Illustration */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">Package Illustration (Max 2 Images)</h4>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <PartImageUpload
                key={`package_illustration_${i}`}
                label={`Illustration ${i + 1}`}
                name={`package_illustration_${i}`}
                file={data[`package_illustration_${i}`]}
                previewUrl={data[`package_illustration_${i}_url`]}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setData((prev) => ({
                      ...prev,
                      [`package_illustration_${i}`]: file,
                      [`package_illustration_${i}_url`]: url,
                    }));
                  }
                }}
                onDelete={() =>
                  setData((prev) => ({
                    ...prev,
                    [`package_illustration_${i}`]: null,
                    [`package_illustration_${i}_url`]: null,
                  }))
                }
              />
            ))}
          </div>
        </div>

        {/* Results Package Illustration */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">Results Package Illustration (Max 1 Image)</h4>
          <PartImageUpload
            label="Result Illustration"
            name="result_illustration"
            file={data.result_illustration}
            previewUrl={data.result_illustration_url}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setData((prev) => ({
                  ...prev,
                  result_illustration: file,
                  result_illustration_url: url,
                }));
              }
            }}
            onDelete={() =>
              setData((prev) => ({
                ...prev,
                result_illustration: null,
                result_illustration_url: null,
              }))
            }
          />
        </div>
      </div>

      {/* Created / Approved */}
      <div className="mt-6 grid grid-cols-2 gap-4 hidden">
        <div>
          <label className="block text-sm mb-1">Created By</label>
          <input
            type="text"
            name="created_by"
            value={data.created_by || ""}
            readOnly
            className="border p-2 w-full rounded bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Approved By</label>
          <input
            type="text"
            name="approved_by"
            value={data.approved_by || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-between border-t pt-6">
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