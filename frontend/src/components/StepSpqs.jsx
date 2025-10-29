import { useRef, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { clearDocuments } from "../utils/clearDocuments";
import { FaPlus } from "react-icons/fa";

const generateDocNo = async () => {
  try {
    const res = await api.get("/spqs/next-docno");
    return res.data.nextDocNo;
  } catch (err) {
    console.error("Failed to get doc no:", err);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `IM/SPQS/${year}/${month}/00001`;
  }
};

export default function StepSpqs({ onPrev, onNext, initialData }) {
  const defaultData = {
    doc_no: "",
    part_number: "",
    date: "",
    part_description: "",
    supplier: "",
    photo1_url: "",
    photo2_url: "",
    criteria: {
      package_dimension: "",
      weight: "",
      material: "",
      finishing: "",
      function: "",
      completeness: "",
      surface: {
        wear: false,
        damage: false,
        scratch: false,
        crack: false,
        corrosion: false,
        bend: false,
      },
    },
    result: "Pass",
    comment: "",
    created_by: "",
    approved_by: "",
    checked_by: "",
  };

  const [data, setData] = useState({ ...defaultData, ...initialData });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const loadedRef = useRef(false);

  // 🔹 Load user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;
        const res = await api.get(`/auth/user/${userId}`);
        setData((prev) => ({
          ...prev,
          created_by: res.data?.fullname || prev.created_by,
        }));
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!initialData || Object.keys(initialData).length === 0) return;
    setData((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        package_dimension: initialData.inspection?.package_dimension || prev.criteria.package_dimension,
        weight: initialData.inspection?.weight || prev.criteria.weight,
        material: Array.isArray(initialData.part_material) ? initialData.part_material.join(", ") : prev.criteria.material,
        finishing: initialData.inspection?.visual_condition || prev.criteria.finishing,
        function: initialData.inspection?.part_system || prev.criteria.function,
        completeness: initialData.inspection?.completeness || prev.criteria.completeness,
      },
    }));
  }, [initialData]);

  useEffect(() => {
    const loadSpisData = async () => {
      const spisId = localStorage.getItem("spis_id");
      if (!spisId) return;
  
      try {
        const res = await api.get(`/spis/${spisId}`);
        const spisData = res.data;
  
        const inspection = typeof spisData.inspection === "string"
          ? JSON.parse(spisData.inspection)
          : spisData.inspection || {};
  
        const materials = typeof spisData.part_material === "string"
          ? JSON.parse(spisData.part_material)
          : spisData.part_material || [];
  
        setData((prev) => ({
          ...prev,
          part_number: spisData.part_number || "",
          part_description: spisData.part_description || "",
          supplier: spisData.supplier || "",
          photo1_url: spisData.photo1_url || "",
          photo2_url: spisData.photo2_url || "",
          criteria: {
            ...prev.criteria,
            package_dimension:
              inspection.package_dimension ||
              `${inspection.length || 0} x ${inspection.width || 0} x ${inspection.height || 0}`,
            weight: inspection.weight || "",
            material: Array.isArray(materials)
              ? materials.join(", ")
              : materials || "",
            finishing: inspection.visual_condition || "",
            function: inspection.part_system || "",
            completeness: inspection.completeness || "",
          },
        }));
      } catch (err) {
        console.warn("⚠️ SPIS data gagal dimuat, gunakan initialData:", err);
      }
    };
    loadSpisData();
  }, []);

  // 🔹 Generate / load doc number
  useEffect(() => {
    const initDocNo = async () => {
      const savedDocNo = localStorage.getItem("spqs_doc_no");
      if (savedDocNo) {
        setData((prev) => ({ ...prev, doc_no: savedDocNo }));
        return;
      }

      const newDocNo = await generateDocNo();
      setData((prev) => ({ ...prev, doc_no: newDocNo }));
      localStorage.setItem("spqs_doc_no", newDocNo);
    };

    initDocNo();
  }, []);

  // 🔹 Load draft (jika ada)
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId && !loadedRef.current) {
      loadedRef.current = true;
      api.get(`/spqs/draft/${userId}`).then((res) => {
        if (res.data) {
          setData((prev) => ({
            ...prev,
            ...res.data,
            criteria: {
              ...prev.criteria,
              ...(res.data.criteria || {}),
            },
          }));
          toast.info("SPQS draft loaded.");
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("surface.")) {
      const key = name.split(".")[1];
      setData((prev) => ({
        ...prev,
        criteria: {
          ...prev.criteria,
          surface: {
            ...prev.criteria.surface,
            [key]: checked,
          },
        },
      }));
    } else if (name in data.criteria) {
      setData((prev) => ({
        ...prev,
        criteria: { ...prev.criteria, [name]: value },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSaveDraft = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("Please login first.");
        return;
      }

      await api.post("/spqs/save-draft", { user_id: userId, data });
      toast.success("SPQS draft saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save draft");
    }
  };
  
  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const spisId = localStorage.getItem("spis_id");
  
      if (!userId) return toast.error("Please login first.");
      if (!spisId) return toast.error("SPIS ID tidak ditemukan. Silakan isi SPIS dulu.");
  
      // --- Pilih field yang akan dikirim, hindari event/DOM
      const safePayload = {
        user_id: userId,
        spis_id: spisId,
        doc_no: data.doc_no,
        part_number: data.part_number,
        date: data.date,
        part_description: data.part_description,
        supplier: data.supplier,
        criteria: data.criteria,
        result: data.result,
        comment: data.comment,
        created_by: data.created_by,
        approved_by: data.approved_by,
        checked_by: data.checked_by,
        photo1_url: data.photo1_url,
        photo2_url: data.photo2_url,
      };
  
      await api.post("/spqs", safePayload);
  
      toast.success("SPQS submitted successfully!");
      clearDocuments();
  
      // Hapus storage lama
      [
        "spis_doc_no",
        "spps_doc_no",
        "spqs_doc_no",
        "spis_form_data",
        "spps_form_data",
        "spqs_form_data",
        "spis_id",
        "spps_id",
        "spqs_id",
      ].forEach((k) => localStorage.removeItem(k));
  
      setData(defaultData);
      setShowSuccessModal(true);
      localStorage.setItem("trigger_new_spis_doc", "1");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit SPQS");
    }
  };

  return (
    <div>
      {/* Header Info */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Doc No", name: "doc_no", type: "text", readOnly: true },
          { label: "Date", name: "date", type: "date", readOnly: true },
          { label: "Part Number", name: "part_number", type: "text", readOnly: true },
          { label: "Supplier", name: "supplier", type: "text", readOnly: true },
          { label: "Part Description", name: "part_description", type: "text", readOnly: true },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm mb-1">{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              value={data[f.name]}
              onChange={handleChange}
              className={`border p-2 w-full rounded ${
                f.readOnly ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""
              }`}
            />
          </div>
        ))}
      </div>

      {/* Foto dari SPIS */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Foto dari SPIS</h3>
        <div className="flex gap-4">
          {[data.photo1_url, data.photo2_url].map((url, i) => (
            <div key={i} className="flex-1 border p-3 rounded">
              <p className="mb-2 text-sm">Foto {i + 1}</p>
              <div className="w-full h-40 border border-dashed border-gray-300 rounded-md bg-gray-50 overflow-hidden flex items-center justify-center">
                {url ? (
                  <img
                    src={url}
                    alt={`Part ${i + 1}`}
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Criteria */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Quality Criteria</h3>
        <div className="grid grid-cols-2 gap-4">
          {["package_dimension", "weight", "material", "finishing", "function", "completeness"].map(
            (crit) => (
              <div key={crit} className="border p-3 rounded">
                <label className="block text-sm font-semibold mb-1 capitalize">{crit}</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    name={`${crit}_ok`}
                    checked={data.criteria[`${crit}_ok`] || false}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        criteria: {
                          ...prev.criteria,
                          [`${crit}_ok`]: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span className="text-sm text-gray-700">Sesuai spesifikasi</span>
                </div>
                <input
                  type="text"
                  name={crit}
                  value={data.criteria[crit]}
                  onChange={handleChange}
                  readOnly
                  className="border p-2 w-full rounded mb-2 bg-gray-100 text-gray-700"
                />
                <input
                  type="text"
                  name={`${crit}_remark`}
                  value={data.criteria[`${crit}_remark`] || ""}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      criteria: {
                        ...prev.criteria,
                        [`${crit}_remark`]: e.target.value,
                      },
                    }))
                  }
                  className="border p-2 w-full rounded"
                  placeholder="Keterangan (jika tidak sesuai)"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Surface Condition */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Kondisi Permukaan</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.keys(data.criteria.surface).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={`surface.${key}`}
                checked={data.criteria.surface[key]}
                onChange={handleChange}
              />
              <span className="capitalize">{key}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Result</h3>
        <div className="flex gap-4">
          {["Pass", "Rejected", "Need Improvement"].map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="radio"
                name="result"
                value={r}
                checked={data.result === r}
                onChange={handleChange}
              />
              {r}
            </label>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mt-4">
        <label className="block mb-1">Comment</label>
        <textarea
          name="comment"
          value={data.comment}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          rows="3"
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6 border-t pt-6">
        <button
          onClick={onPrev}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
            <h2 className="text-xl font-semibold mb-3 text-green-600">Berhasil!</h2>
            <p className="text-gray-700 mb-6">
              Data SPIS, SPQS, SPQS kamu telah berhasil disimpan ke sistem.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setData(defaultData);           
                  setShowSuccessModal(false);    
                  if (onNext) onNext("restart");  
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <FaPlus /> Buat Data Baru
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  window.location.href = "/sparepart-list"; 
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Lihat Daftar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}