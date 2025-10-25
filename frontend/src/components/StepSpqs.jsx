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
  
//   useEffect(() => {
//     if (initialData?.date) {
//       setData((prev) => ({ ...prev, date: initialData.date }));
//     }
//   }, [initialData?.date]);

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

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("Please login first.");
        return;
      }

      const payload = {
        ...data,
        user_id: userId,
      };

      await api.post("/spqs", payload);
      toast.success("SPQS submitted successfully!");
      onNext && onNext(data);
      localStorage.removeItem("spis_doc_no");
      localStorage.removeItem("spps_doc_no");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit SPQS");
    }
  };

  return (
    <div>
      {/* Header Info */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Doc No", name: "doc_no", type: "text", readOnly: true },
          { label: "Date", name: "date", type: "date" },
          { label: "Part Number", name: "part_number", type: "text" },
          { label: "Supplier", name: "supplier", type: "text" },
          { label: "Part Description", name: "part_description", type: "text" },
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

      {/* Quality Criteria */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Quality Criteria</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            "dimension",
            "weight",
            "material",
            "finishing",
            "function",
            "completeness",
          ].map((crit) => (
            <div key={crit}>
              <label className="block text-sm mb-1 capitalize">{crit}</label>
              <input
                type="text"
                name={crit}
                value={data.criteria[crit]}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                placeholder="according to specifications or measured value"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Surface Condition */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Surface Condition</h3>
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
      <div className="mt-6 grid grid-cols-3 gap-4">
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
      <div className="flex justify-between mt-6">
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