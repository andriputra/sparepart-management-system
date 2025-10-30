export default function SpqsFooter({ data }) {
    const serverUrl = import.meta.env.VITE_SERVER_URL;

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

    const isApproved = !!data.approved_by;

    return (
        <div className="flex gap-8 items-start">
            {/* Signature Section */}
            <table className="w-full border border-gray-500 text-sm mb-6">
                <tbody>
                    <tr className="bg-gray-100">
                        <td className="border border-gray-500 p-2 font-semibold text-center w-1/3">
                            Dibuat Oleh
                        </td>
                        <td className="border border-gray-500 p-2 font-semibold text-center w-1/3">
                            Menyetujui
                        </td>
                        <td className="border border-gray-500 p-2 font-semibold text-center w-1/3">
                            Mengetahui
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
                        <td className="border border-gray-500 p-8 align-end text-center">

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}