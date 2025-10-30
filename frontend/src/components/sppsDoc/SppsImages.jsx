import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import api from "../../api/axios"; 

export default function SppsImages({ data }) {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const [illustrationPart, setIllustrationPart] = useState("/placeholder-illustration.png");

    useEffect(() => {
        const fetchIllustration = async () => {
            try {
                if (!data.spis_id) return;
                    const res = await api.get(`/spareparts/spis/photo/${data.spis_id}`);
                if (res.data?.photo1) {
                    setIllustrationPart(`${serverUrl}${res.data.photo1}`);
                }
            } catch (err) {
                console.error("Error fetching SPIS illustration:", err);
            }
        };
        fetchIllustration();
    }, [data.spis_id, serverUrl]);

    const packageImages = [0, 1, 2, 3]
        .map((i) => data[`package_${i}`])
        .filter((url) => url); 

    const result_package = data.result_illustration
        ? `${serverUrl}${data.result_illustration}`
        : "/placeholder-result.png";

    const result_illustration1 = data.package_illustration_0
        ? `${serverUrl}${data.package_illustration_0}`
        : "/placeholder-illustration.png";
    const result_illustration2 = data.package_illustration_1
        ? `${serverUrl}${data.package_illustration_1}`
        : "/placeholder-illustration.png";

    const illustration_part = data.package_illustration_1
        ? `${serverUrl}${data.package_illustration_1}`
        : "/placeholder-illustration.png";

    return (
        <>
            <div className="flex gap-6 items-start">
                <table className="w-full border border-gray-500 text-sm mb-6">
                    <tbody>
                        <tr>
                            <td className="border border-gray-500 px-3 py-1 font-semibold">Illustrasi Part</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-500 p-3">
                                <img
                                    src={illustrationPart}
                                    alt="Illustrasi Part"
                                    className="mx-auto h-64 object-contain mb-2"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-500 px-3 py-1 font-semibold">Illustrasi Kemasan</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-500 p-3">
                                <div className="flex gap-3 justify-center items-center">
                                    <img
                                        src={result_illustration1}
                                        alt="Result Package"
                                        className="mx-auto h-40 object-contain mb-2"
                                    />
                                    <div className="text-gray-800 text-lg">
                                        <FaArrowRight/>
                                    </div>
                                    <img
                                        src={result_illustration2}
                                        alt="Result Package"
                                        className="mx-auto h-40 object-contain mb-2"
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full border border-gray-500 text-sm mb-6">
                    <tbody>
                        <tr>
                            <td className="border border-gray-500 px-3 font-semibold">Kemasan</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-500 p-3">
                                <div className="grid grid-cols-2 gap-4">
                                    {packageImages.length > 0 ? (
                                        packageImages.map((img, index) => (
                                            <img
                                                key={index}
                                                src={`${serverUrl}${img}`}
                                                alt={`Package ${index + 1}`}
                                                className="mx-auto h-48 object-contain"
                                            />
                                        ))
                                        ) : (
                                        <div className="col-span-2 text-gray-400 italic">
                                            Tidak ada gambar kemasan
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-500 px-3 py-1 font-semibold">Hasil</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-500 p-3">
                                <img
                                    src={result_package}
                                    alt="Result Package"
                                    className="mx-auto h-64 object-contain mb-2"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}