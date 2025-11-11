export default function SpisFooter({ data }) {
    const serverUrl = import.meta.env.VITE_SERVER_URL;

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
        <div className="flex gap-8 items-stretch">
            {/* Kolom Keterangan */}
            <table className="w-full border border-gray-500 text-sm mb-6 h-full">
                <tbody>
                    <tr className="bg-gray-100">
                        <td className="border border-gray-500 p-2 font-semibold text-center">
                        Keterangan
                        </td>
                    </tr>
                    <tr className="align-top h-40">
                        <td className="border border-gray-500 p-2 align-top h-full">
                        <div className="h-full" style={{ whiteSpace: "pre-line" }}>{data.description || "-"}</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Kolom Tanda Tangan */}
            <table className="w-full border border-gray-500 text-sm mb-6 h-full">
                <tbody>
                    <tr className="bg-gray-100">
                        <td className="border border-gray-500 p-2 font-semibold text-center">
                        Dibuat Oleh
                        </td>
                        <td className="border border-gray-500 p-2 font-semibold text-center">
                        Menyetujui
                        </td>
                    </tr>
                    <tr className="h-40">
                        <td className="border border-gray-500 align-end text-center h-full">
                            <img
                                src={createdSignature}
                                alt="Signature Created By"
                                className="mx-auto max-h-16 object-contain mb-6"
                            />
                            {data.created_by || "-"}
                        </td>
                        <td className="border border-gray-500 align-end text-center h-full">
                        {isApproved ? (
                            <>
                            <img
                                src={approvedSignature}
                                alt="Signature Approved By"
                                className="mx-auto max-h-16 object-contain mb-6"
                            />
                            {data.approved_by}
                            </>
                        ) : (
                            <p className="text-gray-500 italic">Belum di-approve</p>
                        )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}