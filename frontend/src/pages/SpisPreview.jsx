import { useLocation } from "react-router-dom";

export default function SpisPreview() {
  const { state } = useLocation();
  const data = state?.data || {};

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SPIS Preview</h1>
      <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}