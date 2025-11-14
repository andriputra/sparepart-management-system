import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSppsData } from "../store/sppsSlice";
import api from "../api/axios";
import { toast } from "react-toastify";
import PartImageUpload from "./PartImageUpload";
import { FaArrowLeft, FaArrowRight, FaFilePdf } from "react-icons/fa";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

const BASE_URL = import.meta.env.VITE_SERVER_URL;
const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
};

export default function StepSpps({ onNext, onPrev, initialData }) {
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // === Load SPPS by spps_id (Back from Step 3) ===
  useEffect(() => {
    const fetchSppsById = async () => {
      let sppsId =
        localStorage.getItem("spps_id") ||
        new URLSearchParams(window.location.search).get("spps_id");
      if (!sppsId) return;
      try {
        // const res = await api.get(`/spareparts/spps/by-id/${sppsId}`);
        const res = await api.get(`/spps/by-id/${sppsId}`);
        if (res.data) {
          const spps = res.data;
          let parsedInspection = {};
          try {
            if (typeof spps.inspection === "string") {
              parsedInspection = JSON.parse(spps.inspection);
            } else if (typeof spps.inspection === "object" && spps.inspection !== null) {
              parsedInspection = spps.inspection;
            }
          } catch (err) {
            console.warn("Failed to parse inspection JSON:", err);
          }
          setData((prev) => ({
            ...prev,
            doc_no: spps.doc_no || prev.doc_no,
            date: formatDate(spps.date) || prev.date,
            part_number: spps.part_number || prev.part_number,
            supplier: spps.supplier || prev.supplier,
            part_description: spps.part_description || prev.part_description,
            qty: spps.qty || prev.qty,
            part_weight: parsedInspection.weight || spps.part_weight || prev.part_weight,
            part_dimension: parsedInspection.package_dimension || spps.part_dimension || prev.part_dimension,
            detail_part: spps.detail_part || prev.detail_part,
            created_by: spps.created_by || prev.created_by,
            approved_by: spps.approved_by || prev.approved_by,
            package_material: spps.package_material || prev.package_material,
            package_code: spps.package_code || prev.package_code,
            package_material_0: spps.package_material_0 || prev.package_material_0,
            package_code_1: spps.package_code_1 || prev.package_code_1,
            package_material_1: spps.package_material_1 || prev.package_material_1,
            package_code_2: spps.package_code_2 || prev.package_code_2,
            package_material_2: spps.package_material_2 || prev.package_material_2,
            package_code_3: spps.package_code_3 || prev.package_code_3,
            package_detail: spps.package_detail || prev.package_detail,
            // illustration_part: keep from SPIS if not changed, otherwise use spps.illustration_part
            illustration_part:
              spps.illustration_part
                ? getFullImageUrl(spps.illustration_part)
                : prev.illustration_part,
            // Images (for package, package_illustration, result_illustration)
            ...[0,1,2,3].reduce((acc, i) => {
              acc[`package_${i}_url`] = spps[`package_${i}_url`] ? getFullImageUrl(spps[`package_${i}_url`]) : prev[`package_${i}_url`];
              return acc;
            }, {}),
            ...[0,1].reduce((acc, i) => {
              acc[`package_illustration_${i}_url`] = spps[`package_illustration_${i}_url`] ? getFullImageUrl(spps[`package_illustration_${i}_url`]) : prev[`package_illustration_${i}_url`];
              return acc;
            }, {}),
            result_illustration_url: spps.result_illustration_url ? getFullImageUrl(spps.result_illustration_url) : prev.result_illustration_url,
          }));
        }
      } catch (err) {
        console.error("Error fetching SPPS by ID:", err);
      }
    };
    fetchSppsById();
  }, []);
  const dispatch = useDispatch();

  const defaultData = {
    doc_no: "",
    date: "",
    part_number: "",
    supplier: "",
    part_description: "",
    qty: "",
    part_weight: "",
    part_dimension: "",
    detail_part: "",
    created_by: "",
    approved_by: "",
    package_material: "",
    package_code: "",
    package_material_0: "",
    package_code_0: "",
    package_material_1: "",
    package_code_1: "",
    package_material_2: "",
    package_code_2: "",
    package_detail: "",
    illustration_part: null,
  };

  const [data, setData] = useState({
    ...defaultData,
    ...(initialData
    ? {
        date: initialData.date,
        part_number: initialData.part_number,
        supplier: initialData.supplier,
        part_description: initialData.part_description,
        detail_part: initialData.detail_part,
        part_weight: initialData.inspection?.weight,
        part_dimension: initialData.inspection?.package_dimension,
        created_by: initialData.name,
        illustration_part: getFullImageUrl(initialData.photo1_url || initialData.photo1),
      }
    : {}),
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      let parsedInspection = {};
      try {
        if (typeof initialData.inspection === "string") {
          parsedInspection = JSON.parse(initialData.inspection);
        } else if (typeof initialData.inspection === "object" && initialData.inspection !== null) {
          parsedInspection = initialData.inspection;
        }
      } catch (err) {
        console.warn("Failed to parse inspection JSON:", err);
      }
  
      setData((prev) => ({
        ...prev,
        ...defaultData,
        ...Object.fromEntries(
          Object.entries(initialData).filter(([key]) => key !== "doc_no")
        ),
        date: formatDate(initialData.date) || prev.date,
        part_number: initialData.part_number || prev.part_number,
        supplier: initialData.supplier || prev.supplier,
        part_description: initialData.part_description || prev.part_description,
        detail_parts: initialData.detail_part || prev.detail_parts,
        part_weight: parsedInspection.weight || prev.part_weight,
        part_dimension: parsedInspection.package_dimension || prev.part_dimension,
        created_by: initialData.name || prev.created_by,
        illustration_part: getFullImageUrl(initialData.photo1_url || initialData.photo1) || prev.illustration_part,
      }));
    }
  }, [initialData]);

  // === Inisialisasi data SPIS (by spis_id from localStorage/query) ===
  useEffect(() => {
    const fetchInitialSpis = async () => {
      let spisId =
        localStorage.getItem("spis_id") ||
        new URLSearchParams(window.location.search).get("spis_id");
      if (spisId) {
        try {
          const res = await api.get(`/spis/by-id/${spisId}`);
          if (res.data) {
            const initial = res.data;
            let parsedInspection = {};
            try {
              if (typeof initial.inspection === "string") {
                parsedInspection = JSON.parse(initial.inspection);
              } else if (
                typeof initial.inspection === "object" &&
                initial.inspection !== null
              ) {
                parsedInspection = initial.inspection;
              }
            } catch (err) {}
            setData((prev) => ({
              ...prev,
              date: formatDate(initial.date) || "",
              part_number: initial.part_number || "",
              supplier: initial.supplier || "",
              part_description: initial.part_description || "",
              part_weight: parsedInspection.weight || "",
              part_dimension: parsedInspection.package_dimension || "",
              detail_part: initial.detail_part || "",
              created_by: initial.name || "",
              illustration_part: getFullImageUrl(initial.photo1_url || initial.photo1),
            }));
          }
        } catch (err) {
          toast.error("Gagal mengambil data SPIS.");
        }
      } else {
        const newDocNo = await generateDocNo();
        setData((prev) => ({ ...prev, doc_no: newDocNo }));
      }
    };
    fetchInitialSpis();
  }, []);

  // === Generate doc_no & date jika belum ada ===
  useEffect(() => {
    const initDocNoAndDate = async () => {
      if (!data.doc_no) {
        const newDocNo = await generateDocNo();
        setData((prev) => ({ ...prev, doc_no: newDocNo }));
      }
      if (!data.date) {
        const today = new Date().toISOString().split("T")[0];
        setData((prev) => ({ ...prev, date: today }));
      }
    };
    initDocNoAndDate();
  }, [data.doc_no, data.date]);

  useEffect(() => {
    const serializableData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => !(value instanceof File))
    );
    dispatch(setSppsData(serializableData));
  }, [data, dispatch]);

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
      if (!data.qty) {
        toast.warning("Quantity (Qty) diisi sebelum lanjut.");
        return;
      }
      await api.post(
        "/spps/save-draft",
        { user_id: userId, data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("SPPS draft saved successfully!");
      setIsDraftSaved(true);
    } catch (err) {
      console.error("Error saving draft:", err);
      toast.error("Failed to save draft");
    }
  };

  const handleNext = async () => {
    const finalData = { ...data, status: "submitted" };
    const requiredFields = [
      "doc_no",
      "date",
      "part_number",
      "supplier",
      "part_description",
      "detail_part",
      "part_weight",
      "part_dimension",
      "qty",
    ];
    const isEmpty = requiredFields.some(
      (field) =>
        !finalData[field] ||
        (typeof finalData[field] === "string" && finalData[field].trim() === "")
    );
    if (isEmpty) {
      toast.error("Harap isi semua field yang wajib diisi (*).");
      return;
    }
    try {
      const formData = new FormData();
      const userId = localStorage.getItem("user_id");
      const spisId = localStorage.getItem("spis_id");
      const existingSppsId = localStorage.getItem("spps_id");

      if (!spisId) {
        toast.error(
          "SPIS ID tidak ditemukan. Silakan mulai dari Step 1 (SPIS)."
        );
        return;
      }

      // === Hanya field yang memang dikirim ke tabel SPPS ===
      // Komentar: Kode berikut memastikan status sudah 'submitted'
      // sebelum data dikirim ke backend, dan dispatch serta onNext
      // dilakukan setelah formData diisi.
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
        "package_material_0",
        "package_code_0",
        "package_material_1",
        "package_code_1",
        "package_material_2",
        "package_code_2",
        "detail_part",
        "package_detail",
        "created_by",
        "status",
        "approved_by",
      ];
      allowedFields.forEach((key) => {
        if (finalData[key] !== undefined && finalData[key] !== null) {
          formData.append(key, finalData[key]);
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
          formData.append(
            `package_illustration_${i}`,
            data[`package_illustration_${i}`]
          );
        }
      }
      if (data.result_illustration instanceof File) {
        formData.append("result_illustration", data.result_illustration);
      }

      // Tambahkan hubungan SPIS dan User
      formData.append("spis_id", spisId);
      formData.append("user_id", userId);
      formData.append("status", "submitted");

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
      // Simpan spps_id ke localStorage setiap insert/update
      if (response?.data?.id) {
        localStorage.setItem("spps_id", response.data.id);
      }
      dispatch(setSppsData(finalData));
      onNext({ ...finalData, spps_id: response?.data?.id || existingSppsId });
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
          { label: "Detail Parts", name: "detail_part", type: "text", readOnly: true },
          { label: "Part Weight (Kg)", name: "part_weight", type: "text", readOnly: true },
          { label: "Part Dimension (P X L X T)", name: "part_dimension", type: "text", readOnly: true },
          { label: "Qty", name: "qty", type: "number" }
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm mb-1">
              {f.label}
              {["doc_no", "date", "part_number", "supplier", "part_description", "part_weight", "part_dimension", "qty"].includes(f.name) && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type={f.type}
              name={f.name}
              value={data[f.name] || ""}
              onChange={handleChange}
              readOnly={f.readOnly || false}
              className={`border p-2 w-full rounded ${
                f.readOnly ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""
              }`}
              required={["doc_no", "date", "part_number", "supplier", "part_description", "part_weight", "part_dimension", "qty"].includes(f.name)}
            />
          </div>
        ))}
      </div>

      {/* Package Info */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Package Information</h3>
        <div className="mb-3 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-row gap-4 w-full bg-gray-100 p-3 rounded">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium">Package Material {i + 1}</label>
                <input
                  type="text"
                  name={`package_material_${i}`}
                  value={data[`package_material_${i}`] || ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required={i === 0}
                />
              </div>

              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium">Package Code {i + 1}</label>
                <input
                  type="text"
                  name={`package_code_${i}`}
                  value={data[`package_code_${i}`] || ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required={i === 0}
                />
              </div>
            </div>
          ))}
        </div>

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
        <div className="flex gap-2">
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
              type="button"
              className="border border-blue-400 bg-blue-100 text-blue-500 px-6 py-2 rounded hover:bg-blue-300"
            >
              Save Draft
            </button>
            <a
              href={`/document/view/SPPS/${encodeURIComponent(data.doc_no)}`}
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
        </div>
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-4   py-2 rounded hover:bg-blue-700 flex gap-2 items-center"
        >
          Next <FaArrowRight/>
        </button>
      </div>
    </div>
  );
}

// === Load SPPS by spps_id (Back from Step 3) ===