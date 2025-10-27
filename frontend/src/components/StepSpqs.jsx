import { useRef, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

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
    image1: "",
    image2: "",
    criteria: {
      dimension: "",
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

  const loadedRef = useRef(false);

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

  // 🔹 Load data SPIS untuk isi otomatis Quality Criteria
  useEffect(() => {
    const loadSpisData = async () => {
      const spisId = localStorage.getItem("spis_id");
      if (!spisId) return;
  
      try {
        const res = await api.get(`/spis/${spisId}`);
        const spisData = res.data;
        console.log("✅ Loaded SPIS data:", spisData);
  
        if (spisData) {
          setData((prev) => ({
            ...prev,
            part_number: spisData.part_number || "",
            part_description: spisData.part_description || "",
            supplier: spisData.supplier || "",
            photo1_url: spisData.photo1_url || "",
            photo2_url: spisData.photo2_url || "",
            criteria: {
              ...prev.criteria,
              // Isi otomatis dari SPIS
              package_dimension:
                spisData.inspection?.package_dimension ||
                `${spisData.inspection?.length || 0}x${spisData.inspection?.width || 0}x${spisData.inspection?.height || 0} mm`,
              weight: spisData.inspection?.weight || "",
              material: Array.isArray(spisData.part_material)
                ? spisData.part_material.join(", ")
                : spisData.part_material || "",
              finishing: spisData.inspection?.visual_condition || "",
              function: spisData.inspection?.part_system || "",
              completeness: spisData.inspection?.completeness || "",
            },
          }));
        }
      } catch (err) {
        console.error("❌ Failed to load SPIS data:", err);
      }
    };
  
    loadSpisData();
  }, []);

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


  // 🔹 Load draft SPQS (jika ada)
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId && !loadedRef.current) {
      loadedRef.current = true;
      api.get(`/spqs/draft/${userId}`).then((res) => {
        if (res.data) {
          setData(res.data);
          toast.info("Loaded SPQS draft.");
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("surface.")) {
      const key = name.split(".")[1];
      setData({
        ...data,
        criteria: {
          ...data.criteria,
          surface: { ...data.criteria.surface, [key]: checked },
        },
      });
    } else if (name in data.criteria) {
      setData({
        ...data,
        criteria: { ...data.criteria, [name]: value },
      });
    } else {
      setData({ ...data, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSaveDraft = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("Please login first.");
        return;
      }

      await api.post("/spqs/save-draft", {
        user_id: userId,
        data,
      });
      toast.success("SPQS draft saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save draft");
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     const userId = localStorage.getItem("user_id");
  //     const spisId = localStorage.getItem("spis_id"); 
  
  //     if (!userId) {
  //       toast.error("Please login first.");
  //       return;
  //     }
  
  //     if (!spisId) {
  //       toast.error("SPIS ID tidak ditemukan. Silakan isi SPIS terlebih dahulu.");
  //       return;
  //     }
  
  //     const payload = {
  //       ...data,
  //       user_id: userId,
  //       spis_id: spisId, // 🔹 Tambahkan ini
  //     };
  
  //     await api.post("/spqs", payload);
  //     toast.success("SPQS submitted successfully!");
  //     onNext && onNext(data);
  
  //     // Bersihkan doc_no dari localStorage
  //     localStorage.removeItem("spis_doc_no");
  //     localStorage.removeItem("spps_doc_no");
  //     localStorage.removeItem("spqs_doc_no");
  //     localStorage.removeItem("user_id");
  //     localStorage.removeItem("spis_id");
  //     localStorage.removeItem("spps_form_data");
  //     localStorage.removeItem("spqs_form_data");
  //     localStorage.removeItem("spis_form_data");
  //     localStorage.removeItem("spps_id");
  //     localStorage.removeItem("spqs_id");
  //     localStorage.removeItem("persist:root");
  //   } catch (err) {
  //     console.error("❌ Submit error:", err);
  //     toast.error("Failed to submit SPQS");
  //   }
  // };
  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const spisId = localStorage.getItem("spis_id"); 
  
      if (!userId) {
        toast.error("Please login first.");
        return;
      }
  
      if (!spisId) {
        toast.error("SPIS ID tidak ditemukan. Silakan isi SPIS terlebih dahulu.");
        return;
      }
  
      const payload = {
        ...data,
        user_id: userId,
        spis_id: spisId,
      };
  
      // ⏳ Kirim data ke backend
      await api.post("/spqs", payload);
  
      toast.success("✅ SPQS submitted successfully!");
  
      // 🧹 1️⃣ Hapus semua localStorage form agar benar-benar fresh
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
      ].forEach((key) => localStorage.removeItem(key));
  
      // 🧠 2️⃣ Reset data form agar kosong
      setData({
        doc_no: "",
        part_number: "",
        date: "",
        part_description: "",
        supplier: "",
        image1: "",
        image2: "",
        criteria: {
          dimension: "",
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
      });
  
      // ⏳ 3️⃣ Tunggu sebentar biar state & localStorage sinkron
      await new Promise((r) => setTimeout(r, 200));
  
      // 🔁 4️⃣ Panggil parent (Step Container) untuk balik ke Step 1 (SPIS)
      if (onPrev) onPrev(true);
  
      // 🆕 5️⃣ Setelah balik, trigger auto-generate doc_no baru untuk SPIS
      // (Pastikan di komponen StepSpis.jsx kamu ada useEffect yang generateDocNo saat mount)
      localStorage.setItem("trigger_new_spis_doc", "1");
    } catch (err) {
      console.error("❌ Submit error:", err);
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

      {/* Foto diambil dari SPIS (photo1 & photo2) */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Foto dari SPIS</h3>
        <div className="border p-3 rounded mb-4 flex justify-between gap-3">
          {/* Foto 1 */}
          <div className="flex-1">
            <p className="mb-2 text-sm">Foto 1</p>
            <div className="w-full h-40 border border-dashed border-gray-300 rounded-md bg-gray-50 overflow-hidden flex items-center justify-center">
              {data.photo1_url ? (
                <img
                  src={data.photo1_url}
                  alt="Part Image 1"
                  className="w-full h-full object-contain rounded-md"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>
          </div>

          {/* Foto 2 */}
          <div className="flex-1">
            <p className="mb-2 text-sm">Foto 2</p>
            <div className="w-full h-40 border border-dashed border-gray-300 rounded-md bg-gray-50 overflow-hidden flex items-center justify-center">
              {data.photo2_url ? (
                <img
                  src={data.photo2_url}
                  alt="Part Image 2"
                  className="w-full h-full object-contain rounded-md"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quality Criteria */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Quality Criteria</h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            "package_dimension",
            "weight",
            "material",
            "finishing",
            "function",
            "completeness",
          ].map((crit) => (
            <div key={crit} className="border p-3 rounded">
              <label className="block text-sm font-semibold mb-1 capitalize">
                {crit}
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

              <input
                type="text"
                name={crit}
                value={data.criteria[crit]}
                onChange={handleChange}
                className="border p-2 w-full rounded mb-2"
                placeholder={`Nilai dari SPIS (${crit})`}
                readOnly
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
          ))}
        </div>
      </div>

      {/* Surface Condition */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Kondisi Part</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.keys(data.criteria.surface).map((key) => (
            <label key={key} className="flex items-center space-x-2">
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

      {/* Signature */}
      <div className="mt-6 grid grid-cols-3 gap-4 hidden">
        <div>
          <label className="block text-sm mb-1">Created By</label>
          <input
            type="text"
            name="created_by"
            value={data.created_by}
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
        <div>
          <label className="block text-sm mb-1">Checked By</label>
          <input
            type="text"
            name="checked_by"
            value={data.checked_by}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
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
    </div>
  );
}