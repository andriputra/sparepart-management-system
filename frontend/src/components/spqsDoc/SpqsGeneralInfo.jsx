import { useEffect, useState } from "react";
import api from "../../api/axios"; 
export default function SpqsGeneralInfo({ data }) {
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

    const [photo1, setPhoto1] = useState("/placeholder-foto.png");
    const [photo2, setPhoto2] = useState("/placeholder-foto.png");

    useEffect(() => {
        const fetchIllustration = async () => {
            try {
                if (!data.spis_id) return;
                    const res = await api.get(`/spareparts/spis/photo/${data.spis_id}`);
                if (res.data?.photo1) {
                    setPhoto1(`${serverUrl}${res.data.photo1}`);
                }
                if (res.data?.photo2) {
                    setPhoto2(`${serverUrl}${res.data.photo2}`);
                }
            } catch (err) {
                console.error("Error fetching SPQS illustration:", err);
            }
        };
        fetchIllustration();
    }, [data.spis_id, serverUrl]);

    return (
        <>
            <table className="w-full border border-gray-500 text-sm mb-6">
                <tbody>
                    <tr>
                        <td className="border border-gray-500 p-1 w-1/4 font-semibold">Part Number</td>
                        <td className="border border-gray-500 p-1">{data.part_number}</td>
                        <td className="border border-gray-500 p-1 w-1/4 font-semibold">Tanggal</td>
                        <td className="border border-gray-500 p-1">{data.date ? new Date(data.date).toLocaleDateString("id-ID") : "-"}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 w-1/4 font-semibold">Part Deskripsi</td>
                        <td className="border border-gray-500 p-1">{data.part_description}</td>
                        <td className="border border-gray-500 p-1 w-1/4 font-semibold">Suplier</td>
                        <td className="border border-gray-500 p-1">{data.supplier || "-"}</td>
                    </tr>
                </tbody>
            </table>

            <div className="flex gap-6">
                <table className="w-full border border-gray-500 text-sm mb-6">
                    <tbody>
                        <tr className="bg-gray-100">
                            <td className="border border-gray-500 p-1 w-1/4 font-semibold text-center">Foto</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-500 p-3 w-1/4 font-semibold">
                                <img
                                    src={photo1}
                                    alt="Photo Part"
                                    className="mx-auto h-64 object-contain mb-2"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full border border-gray-500 text-sm mb-6">
                    <tbody>
                        <tr className="bg-gray-100">
                            <td className="border border-gray-500 p-1 w-1/4 font-semibold text-center">Foto</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-500 p-3 w-1/4 font-semibold">
                                <img
                                    src={photo2}
                                    alt="Photo Part"
                                    className="mx-auto h-64 object-contain mb-2"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}