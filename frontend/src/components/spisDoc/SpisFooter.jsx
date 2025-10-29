export default function SpisFooter({ data }) {
    const serverUrl = "http://127.0.0.1:5050"; 

    const createdSignature =
        data.created_signature_url
            ? `${serverUrl}${data.created_signature_url}`
            : data.created_signature
                ? `${serverUrl}${data.created_signature}`
                : "/placeholder-signature.png";

    const approvedSignature =
        data.approved_signature_url
            ? `${serverUrl}${data.approved_signature_url}`
            : data.approved_signature
                ? `${serverUrl}${data.approved_signature}`
                : null; 

    const isApproved = data.approved_by && approvedSignature;
        

    return (
        <div className="flex gap-8 items-start">
            <table className="w-full border border-gray-500 text-sm mb-6">
                <tbody>
                    <tr>
                        <td className="border border-gray-500 p-2 font-semibold text-center">Keterangan</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-2 h-20 align-top">{data.description || "-"}</td>
                    </tr>
                </tbody>
            </table>

            {/* Signature Section */}
            <table className="w-full border border-gray-500 text-sm mb-6">
                <tbody>
                    <tr>
                        <td className="border border-gray-500 p-2 font-semibold text-center">
                            Dibuat Oleh
                        </td>
                        <td className="border border-gray-500 p-2 font-semibold text-center">
                            Menyetujui
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-8 align-end text-center">
                            <img
                                src={createdSignature}
                                alt="Signature Created By"
                                className="mx-auto max-h-16 object-contain mb-2"
                            />
                            {data.created_by || "-"}
                        </td>
                        <td className="border border-gray-500 p-8 align-end text-center">
                            {isApproved ? (
                                <>
                                    <img
                                        src={approvedSignature}
                                        alt="Signature Approved By"
                                        className="mx-auto max-h-16 object-contain mb-2"
                                    />
                                    {data.approved_by}
                                </>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Belum di-approve
                                </p>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}