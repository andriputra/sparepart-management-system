import { useRef, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { clearDocuments } from "../utils/clearDocuments";
import { FaPaperPlane, FaPlus, FaArrowLeft, FaFilePdf } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_SERVER_URL;
const getFullImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
};

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
const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function StepSpqs({ onPrev, onNext, initialData }) {
  const [isDraftSaved, setIsDraftSaved] = useState(false);

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
      surface_remark: {},
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
    let parsedInspection = {};
    try {
      if (typeof initialData.inspection === "string") {
        parsedInspection = JSON.parse(initialData.inspection);
      } else if (
        typeof initialData.inspection === "object" &&
        initialData.inspection !== null
      ) {
        parsedInspection = initialData.inspection;
      }
    } catch (err) {
      console.warn("Failed to parse inspection JSON:", err);
    }
    setData((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        package_dimension: initialData.inspection?.package_dimension || prev.criteria.package_dimension,
        part_dimension:
                parsedInspection.length && parsedInspection.width && parsedInspection.height
                  ? `${parsedInspection.length} x ${parsedInspection.width} x ${parsedInspection.height}`
                  : "",
        weight: initialData.inspection?.weight || prev.criteria.weight,
        material: Array.isArray(initialData.part_material) ? initialData.part_material.join(", ") : prev.criteria.material,
        finishing: prev.criteria.finishing,
        function: initialData.inspection?.function || prev.criteria.function,
        completeness: initialData.inspection?.completeness || prev.criteria.completeness,
      },
    }));
    console.log("Initial data loaded into form:", initialData);
  }, [initialData]);

  useEffect(() => {
    const loadSpisData = async () => {
      const spisId = localStorage.getItem("spis_id");
      if (!spisId) return;

      try {
        const res = await api.get(`/spis/by-id/${spisId}`);
        const spisData = res.data;

        const inspection = typeof spisData.inspection === "string"
          ? JSON.parse(spisData.inspection)
          : spisData.inspection || {};

        const materials = typeof spisData.part_material === "string"
          ? JSON.parse(spisData.part_material)
          : spisData.part_material || [];

          setData((prev) => ({
            ...prev,
            part_number: spisData.part_number || prev.part_number,
            part_description: spisData.part_description || prev.part_description,
            supplier: spisData.supplier || prev.supplier,
            photo1_url: getFullImageUrl(spisData.photo1_url || spisData.photo1 || prev.photo1_url),
            photo2_url: getFullImageUrl(spisData.photo2_url || spisData.photo2 || prev.photo2_url),
            date: formatDate(spisData.date) || prev.date,
            criteria: {
              ...prev.criteria,
              package_dimension:
                inspection.package_dimension ||
                `${inspection.length || 0} x ${inspection.width || 0} x ${inspection.height || 0}`,
              weight: inspection.weight || prev.criteria.weight,
              material: Array.isArray(materials)
                ? materials.join(", ")
                : materials || prev.criteria.material,
              finishing: prev.criteria.finishing,
              function: inspection.function || prev.criteria.function,
              completeness: inspection.completeness || prev.criteria.completeness,
            },
          }));
        // Isi otomatis photo1_url, photo2_url, material dari SPIS
        setData((prev) => ({
          ...prev,
          photo1_url: getFullImageUrl(spisData.photo1_url || spisData.photo1),
          photo2_url: getFullImageUrl(spisData.photo2_url || spisData.photo2),
          criteria: {
            ...prev.criteria,
            material: Array.isArray(materials)
              ? materials.join(", ")
              : materials || "",
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

  // const handleSaveDraft = async () => {
  //   try {
  //     const userId = localStorage.getItem("user_id");
  //     const token = localStorage.getItem("token");
  //     if (!userId || !token) {
  //       toast.error("Please login first.");
  //       return;
  //     }

  //     await api.post(
  //       "/spqs/save-draft",
  //       { user_id: userId, data },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     toast.success("SPQS draft saved successfully!");
  //     setIsDraftSaved(true);
  //   } catch (err) {
  //     console.error("Error saving draft:", err);
  //     toast.error("Failed to save draft");
  //   }
  // };
  const handleSaveDraft = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        toast.error("Please login first.");
        return;
      }
  
      // 🔹 Auto-generate part_dimension if missing
      let formattedPartDimension = data.criteria.part_dimension;
  
      if (!formattedPartDimension || formattedPartDimension.trim() === "") {
        const dim = data.criteria.package_dimension;
        if (dim) {
          const [length = 0, width = 0, height = 0] = dim.split(" x ");
          formattedPartDimension = `${length} x ${width} x ${height}`;
        }
      }
  
      // 🔹 Create payload safely (avoid async setData during POST)
      const safeDraftPayload = {
        ...data,
        criteria: {
          ...data.criteria,
          part_dimension: formattedPartDimension,
        }
      };
  
      await api.post(
        "/spqs/save-draft",
        { user_id: userId, data: safeDraftPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success("SPQS draft saved successfully!");
      setIsDraftSaved(true);
    } catch (err) {
      console.error("Error saving draft:", err);
      toast.error("Failed to save draft");
    }
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const spisId = localStorage.getItem("spis_id");

      if (!userId) return toast.error("Please login first.");
      if (!spisId) return toast.error("SPIS ID tidak ditemukan. Silakan isi SPIS dulu.");
      
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
          { label: "Doc No", name: "doc_no", type: "text", readOnly: true, required: true },
          { label: "Date", name: "date", type: "date", readOnly: true, required: true },
          { label: "Part Number", name: "part_number", type: "text", readOnly: true, required: true },
          { label: "Supplier", name: "supplier", type: "text", readOnly: true, required: true },
          { label: "Part Description", name: "part_description", type: "text", readOnly: true, required: true },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm mb-1">
              {f.label}
              {f.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={f.type}
              name={f.name}
              value={data[f.name]}
              onChange={handleChange}
              readOnly={f.readOnly}
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
          {["part_dimension", "weight", "material", "finishing", "function", "completeness"].map(
            (crit) => {
              // Only these are required: package_dimension, weight, material
              const requiredCriteria = ["part_dimension", "weight", "material"];
              return (
                <div key={crit} className="border p-3 rounded">
                  <label className="block text-sm font-semibold mb-1 capitalize">
                    {crit.replace(/_/g, " ")}
                  </label>
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
                  {crit !== "completeness" && crit !== "function" && crit !== "finishing" && (
                    <input
                      type="text"
                      name={crit}
                      value={data.criteria[crit]}
                      onChange={handleChange}
                      readOnly
                      disabled={!data.criteria[`${crit}_ok`]}
                      className={`border p-2 w-full rounded mb-2 ${
                        data.criteria[`${crit}_ok`]
                          ? "bg-gray-100 text-gray-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    />
                  )}
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
                    disabled={
                      crit !== "finishing" &&
                      crit !== "completeness" &&
                      crit !== "function" &&
                      data.criteria[`${crit}_ok`] === true
                    }
                    className={`border p-2 w-full rounded ${
                      (crit !== "finishing" &&
                        crit !== "completeness" &&
                        crit !== "function" &&
                        data.criteria[`${crit}_ok`])
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="Keterangan (jika tidak sesuai)"
                  />
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Surface Condition */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Kondisi Permukaan</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.keys(data.criteria.surface).map((key) => (
            <div key={key} className="flex flex-col border p-3 rounded">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  name={`surface.${key}`}
                  checked={data.criteria.surface[key]}
                  onChange={handleChange}
                />
                <span className="capitalize">{key}</span>
              </label>

              <input
                type="text"
                name={`surface_remark.${key}`}
                value={data.criteria.surface_remark?.[key] || ""}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    criteria: {
                      ...prev.criteria,
                      surface_remark: {
                        ...prev.criteria.surface_remark,
                        [key]: e.target.value,
                      },
                    },
                  }))
                }
                className="border p-2 rounded text-sm"
                placeholder="Berikan keterangan (jika ada)"
              />
            </div>
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
        { !new URLSearchParams(window.location.search).get("spps_id") ? ( 
          <div className="flex gap-2">
            <button
              onClick={onPrev}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex gap-2 items-center"
              >
                <FaArrowLeft/> Back
            </button>
            <button
              onClick={handleSaveDraft}
              className="border border-blue-400 bg-blue-100 text-blue-500 px-6 py-2 rounded hover:bg-blue-300"
            >
              Save Draft
            </button>
            <a
              href={`/document/view/SPQS/${encodeURIComponent(data.doc_no)}`}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!isDraftSaved}
              className={`px-6 py-2 rounded flex gap-2 items-center ${
                isDraftSaved
                  ? "border border-yellow-500 bg-yellow-200 text-yellow-600 hover:bg-yellow-400"
                  : "bg-gray-300 text-gray-100 cursor-not-allowed pointer-events-none"
              }`}
              >
              Preview <FaFilePdf/>
            </a>
          </div>
        ) : (
          <div></div>
        )} 
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
          >
            Submit <FaPaperPlane/>
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