export default function SppsGeneralInfo({ data }) {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const inspection = data.spis_inspection ? JSON.parse(data.spis_inspection) : null;

    const createdSignature =
        data.created_signature_url
            ? `${serverUrl}${data.created_signature_url}`
            : data.created_signature
                ? `${serverUrl}${data.created_signature}`
                : "/placeholder-image.png";

    const approvedSignature =
        data.approved_signature_url
            ? `${serverUrl}${data.approved_signature_url}`
            : data.approved_signature
                ? `${serverUrl}${data.approved_signature}`
                : null; 
    
    const isApproved = !!data.approved_by;

    return (
        <>
        <p className="mb-2"><i>General Information</i></p>
        <div className="flex gap-6 items-start">
            <table className="w-full border border-gray-500 text-sm mb-6">
                <tbody>
                    <tr>
                        <td className="border border-gray-500 p-1 font-semibold">Part Number</td>
                        <td className="border border-gray-500 p-1">{data.part_number}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 font-semibold">Part Deskripsi</td>
                        <td className="border border-gray-500 p-1">{data.part_description || "-"}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 font-semibold">Qty</td>
                        <td className="border border-gray-500 p-1">{data.qty || "-"}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 font-semibold">Berat Part</td>
                        <td className="border border-gray-500 p-1">{data.part_weight || "-"} Kg</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 font-semibold">Dimensi Part</td>
                        <td className="border border-gray-500 p-1">
                            {inspection?.length && inspection?.width && inspection?.height
                                ? `${inspection.length} x ${inspection.width} x ${inspection.height}`
                                : data.part_dimension || "-"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 font-semibold">Suplier</td>
                        <td className="border border-gray-500 p-1">{data.supplier}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 font-semibold">Detail Part</td>
                        <td className="border border-gray-500 p-1">{data.detail_part || "-"}</td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full border border-gray-500 text-sm mb-6">
                <tbody>
                    <tr>
                        <td className="border border-gray-500 p-1 font-semibold">Tanggal</td>
                        <td className="border border-gray-500 p-1">{data.date ? new Date(data.date).toLocaleDateString("id-ID") : "-"}</td>
                    </tr>
                    <tr>
                        <td colSpan="1" className="border border-black p-1 text-center font-semibold">Dibuat Oleh</td>
                        <td colSpan="1" className="border border-black p-1 text-center font-semibold">Menyetujui</td>
                    </tr>
                    <tr>
                        <td className="border border-black h-[116px] text-center align-bottom">
                            <img
                                src={createdSignature}
                                alt="Tanda Tangan PIC"
                                className="mx-auto h-16 object-contain mb-4"
                            />
                        </td>
                        <td className="border border-black [116px] text-center align-bottom">
                            {isApproved ? (
                                <>
                                    <img
                                        src={approvedSignature}
                                        alt="Signature Approved By"
                                        className="mx-auto max-h-16 object-contain mb-4"
                                    />
                                </>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Belum di-approve
                                </p>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-black p-1 text-center font-semibold">
                            {data?.created_by || "-"}
                        </td>
                        <td className="border border-black p-1 text-center font-semibold">
                            {data?.approved_by || "-"}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div className="flex gap-6 items-start mb-3">
            <table className="w-full border border-gray-500 text-sm mb-4">
                <thead>
                    <tr>
                        <td className="border border-gray-500 p-1 font-semibold text-center">No</td>
                        <td className="border border-gray-500 p-1 font-semibold">Material Kemasan</td>
                        <td className="border border-gray-500 p-1 font-semibold">Code</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-500 p-1 text-center">1</td>
                        <td className="border border-gray-500 p-1">{data.package_material_0 || "-"}</td>
                        <td className="border border-gray-500 p-1">{data.package_code_0 || "-"}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 text-center">2</td>
                        <td className="border border-gray-500 p-1">{data.package_material_1 || "-"}</td>
                        <td className="border border-gray-500 p-1">{data.package_code_1 || "-"}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 text-center">3</td>
                        <td className="border border-gray-500 p-1">{data.package_material_2 || "-"}</td>
                        <td className="border border-gray-500 p-1">{data.package_code_2 || "-"}</td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full border border-gray-500 text-sm mb-4">
                <thead>
                    <tr>
                        <td className="border border-gray-500 p-1 font-semibold">Detail Kemasan:</td>
                    </tr>
                </thead>
                <tbody>
                    <tr className="h-[87px]">
                        <td className="border border-gray-500 p-1 align-top" style={{ whiteSpace: "pre-line" }}>{data.package_detail || "-"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        </>
    );
}