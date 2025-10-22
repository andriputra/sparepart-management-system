import { useState } from "react";

export default function StepSpis({ onNext, initialData }) {
  const [data, setData] = useState(
    initialData || {
      doc_no: "",
      date: "",
      location: "Warehouse Jakarta",
      code: "",
      name: "",
      department: "Inventory Management",
      telephone: "",
      part_number: "",
      supplier: "",
      part_description: "",
      remarks: "",
      photo: null,
      part_material: [],
      inspection: {
        visual: "",
        part_system: "",
        length: "",
        width: "",
        height: "",
        weight: "",
        package_dimension: "",
        remarks: "",
      },
      created_by: "",
      approved_by: "",
    }
  );

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
    const updated = checked
      ? [...data.part_material, value]
      : data.part_material.filter((m) => m !== value);
    setData({ ...data, part_material: updated });
  };

  const handleInspectionChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      inspection: { ...data.inspection, [name]: value },
    });
  };

  const handleNext = () => {
    console.log("SPIS Data:", data);
    onNext(data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Step 1 - Service Part Information Sheet (SPIS)
      </h2>

      {/* General Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Doc No.</label>
          <input
            type="text"
            name="doc_no"
            value={data.doc_no}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Auto / Manual"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Code</label>
          <input
            type="text"
            name="code"
            value={data.code}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={data.department}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Telephone</label>
          <input
            type="text"
            name="telephone"
            value={data.telephone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Part Info */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Part Details</h3>
        <label className="block text-sm mb-1">Part Number</label>
        <input
          type="text"
          name="part_number"
          value={data.part_number}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        />

        <label className="block text-sm mb-1">Supplier</label>
        <input
          type="text"
          name="supplier"
          value={data.supplier}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        />

        <label className="block text-sm mb-1">Part Description</label>
        <textarea
          name="part_description"
          value={data.part_description}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        ></textarea>

        <label className="block text-sm mb-1">Remarks</label>
        <textarea
          name="remarks"
          value={data.remarks}
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        ></textarea>

        <label className="block text-sm mb-1">Upload Photo</label>
        <input
          type="file"
          name="photo"
          onChange={handleChange}
          className="border p-2 w-full rounded mb-3"
        />
      </div>

      {/* Material */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Part Material</h3>
        {["Rubber", "Metal", "Plastic", "Glass"].map((m) => (
          <label key={m} className="mr-4">
            <input
              type="checkbox"
              value={m}
              checked={data.part_material.includes(m)}
              onChange={handleMaterialChange}
              className="mr-1"
            />
            {m}
          </label>
        ))}
        <label className="ml-4">
          <input
            type="checkbox"
            value="Other"
            checked={data.part_material.includes("Other")}
            onChange={handleMaterialChange}
            className="mr-1"
          />
          Other
        </label>
      </div>

      {/* Inspection */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Inspection Detail</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            "visual",
            "part_system",
            "length",
            "width",
            "height",
            "weight",
            "package_dimension",
            "remarks",
          ].map((field) => (
            <div key={field}>
              <label className="block capitalize mb-1">
                {field.replace("_", " ")}
              </label>
              <input
                type="text"
                name={field}
                value={data.inspection[field]}
                onChange={handleInspectionChange}
                className="border p-2 w-full rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Created / Approved */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Created By</label>
          <input
            type="text"
            name="created_by"
            value={data.created_by}
            onChange={handleChange}
            className="border p-2 w-full rounded"
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

      {/* Next */}
      <div className="mt-6 text-right">
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}