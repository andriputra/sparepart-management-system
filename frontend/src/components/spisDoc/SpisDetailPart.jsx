export default function SpisDetailPart({ data }) {
    const serverUrl = "http://127.0.0.1:5050";
    const detailPartImage = Array.isArray(data.part_images)
      ? data.part_images
      : JSON.parse(data.part_images || "[]");
  
    return (
        <table className="w-full border border-gray-500 text-sm mb-6">
            <tbody>
            <tr>
                <td colSpan="5" className="border border-gray-500 p-2 font-semibold text-center">
                Detail
                </td>
            </tr>
    
            {/* ✅ Loop setiap item di part_images */}
            {detailPartImage.length > 0 ? (
                detailPartImage.map((item, index) => (
                <tr key={index}>
                    <td className="border border-gray-500 p-1 w-[30%] text-center">
                    <img
                        src={item.url ? `${serverUrl}${item.url}` : "/placeholder-image.png"}
                        alt={`Foto ${index + 1}`}
                        className="mx-auto max-h-48 object-contain"
                    />
                    </td>
                    <td className="border border-gray-500 p-1 align-top">
                    {item.description || "-"}
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td
                    colSpan="2"
                    className="border border-gray-500 p-2 text-center text-gray-500 italic"
                >
                    Tidak ada gambar detail
                </td>
                </tr>
            )}
            </tbody>
        </table>
    );
  }