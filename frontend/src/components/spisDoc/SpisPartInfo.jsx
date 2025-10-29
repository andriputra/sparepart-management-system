export default function SpisPartInfo({ data }) {
    const serverUrl = "http://127.0.0.1:5050";
  
    return (
      <>
        <table className="w-full border border-gray-500 text-sm mb-6">
          <tbody>
            <tr>
              <td className="border border-gray-500 p-2 font-semibold">Tanggal</td>
              <td className="border border-gray-500 p-2">
                {data.date ? new Date(data.date).toLocaleDateString("id-ID") : "-"}
              </td>
              <td className="border border-gray-500 p-2 font-semibold">Lokasi</td>
              <td className="border border-gray-500 p-2">{data.location || "-"}</td>
              <td className="border border-gray-500 p-2 font-semibold">Kode</td>
              <td className="border border-gray-500 p-2">{data.code || "-"}</td>
            </tr>
            <tr>
              <td className="border border-gray-500 p-2 font-semibold">Nama</td>
              <td className="border border-gray-500 p-2">{data.name || "-"}</td>
              <td className="border border-gray-500 p-2 font-semibold">Departemen</td>
              <td className="border border-gray-500 p-2">{data.department || "-"}</td>
              <td className="border border-gray-500 p-2 font-semibold">Telepon</td>
              <td className="border border-gray-500 p-2">{data.telephone || "-"}</td>
            </tr>
          </tbody>
        </table>
  
        <table className="w-full border border-gray-500 text-sm mb-4">
          <tbody>
            <tr>
              <td className="border border-gray-500 p-2 w-1/4 font-semibold">Part Number</td>
              <td className="border border-gray-500 p-2">{data.part_number || "-"}</td>
              <td className="border border-gray-500 p-2 w-1/4 font-semibold">Supplier</td>
              <td className="border border-gray-500 p-2">{data.supplier || "-"}</td>
            </tr>
            <tr>
              <td className="border border-gray-500 p-2 w-1/4 font-semibold">Part Deskripsi</td>
              <td className="border border-gray-500 p-2">{data.part_description || "-"}</td>
              <td className="border border-gray-500 p-2 w-1/4 font-semibold">Detail Part</td>
              <td className="border border-gray-500 p-2">{data.detail_part || "-"}</td>
            </tr>
            <tr>
              <td colSpan="2" className="border border-gray-500 p-2 w-1/2 text-center font-semibold">Foto 1</td>
              <td colSpan="2" className="border border-gray-500 p-2 w-1/2 text-center font-semibold">Foto 2</td>
            </tr>
            <tr>
              <td colSpan="2" className="border border-gray-500 p-2 w-1/2 text-center">
                <img
                  src={data.photo1 ? `${serverUrl}${data.photo1}` : "/placeholder-image.png"}
                  alt="Foto 1"
                  className="mx-auto max-h-48 object-contain"
                />
              </td>
              <td colSpan="2" className="border border-gray-500 p-2 w-1/2 text-center">
                <img
                  src={data.photo2 ? `${serverUrl}${data.photo2}` : "/placeholder-image.png"}
                  alt="Foto 2"
                  className="mx-auto max-h-48 object-contain"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }