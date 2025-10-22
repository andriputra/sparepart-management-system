import { useState } from "react";

export default function StepSpqs({ onPrev, onNext, initialData }) {
  const [data, setData] = useState(initialData || { catatan: "", tanggal: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 3 - SPQS</h2>

      <label className="block mb-2">Catatan</label>
      <textarea
        name="catatan"
        value={data.catatan}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
      ></textarea>

      <label className="block mb-2">Tanggal</label>
      <input
        type="date"
        name="tanggal"
        value={data.tanggal}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
      />

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Back
        </button>
        <button
          onClick={() => onNext(data)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}