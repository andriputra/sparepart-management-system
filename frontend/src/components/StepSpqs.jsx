import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const generateDocNo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
  
    const randomNumber = Math.floor(Math.random() * 99999) + 1;
    const padded = String(randomNumber).padStart(5, "0");
  
    return `IM/SPQS/${year}/${month}/${padded}`;
};
export default function StepSpqs({ onPrev, onNext, initialData }) {
    const defaultData = {
        doc_no: generateDocNo(),
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

  // Load draft data (optional)
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
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
      await api.post("/spqs", data);
      toast.success("SPQS submitted successfully!");
      onNext && onNext(data);
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
          { label: "Doc No", name: "doc_no", type: "text" },
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
              className="border p-2 w-full rounded"
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
        {[
          { label: "Created By", name: "created_by" },
          { label: "Approved By", name: "approved_by" },
          { label: "Checked By", name: "checked_by" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm mb-1">{f.label}</label>
            <input
              type="text"
              name={f.name}
              value={data[f.name]}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}
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