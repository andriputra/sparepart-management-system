import { useState } from "react";

export default function StepSpps({ onNext, onPrev, initialData }) {
  const [data, setData] = useState(initialData || { lokasi: "", jumlah: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 2 - SPPS</h2>

      <label className="block mb-2">Lokasi</label>
      <input
        type="text"
        name="lokasi"
        value={data.lokasi}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
      />

      <label className="block mb-2">Jumlah</label>
      <input
        type="number"
        name="jumlah"
        value={data.jumlah}
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}