import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import api from "../../api/axios"; 

export default function SppsImages({ data }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [illustrationPart, setIllustrationPart] = useState("/placeholder-image.png");

  // 🧠 Helper agar URL blob & uploads bisa tampil
  const getImageSrc = (url) => {
    if (!url) return "/placeholder-image.png";
    if (url.startsWith("blob:")) return url;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads")) return `${serverUrl}${url}`;
    return "/placeholder-image.png";
  };

  // 🔹 Ambil ilustrasi part dari SPIS
  useEffect(() => {
    const fetchIllustration = async () => {
      try {
        if (!data.spis_id) return;
        const res = await api.get(`/spareparts/spis/photo/${data.spis_id}`);
        if (res.data?.photo1) {
          setIllustrationPart(getImageSrc(res.data.photo1));
        }
      } catch (err) {
        console.error("Error fetching SPIS illustration:", err);
      }
    };
    fetchIllustration();
  }, [data.spis_id]);

  // 🔹 Ambil gambar kemasan (gunakan *_url kalau ada)
  const packageImages = [0, 1, 2, 3]
    .map((i) => data[`package_${i}_url`] || data[`package_${i}`])
    .filter((url) => !!url);

  // 🔹 Hasil dan ilustrasi kemasan
  const result_package = getImageSrc(data.result_illustration_url || data.result_illustration);
  const result_illustration1 = getImageSrc(data.package_illustration_0_url || data.package_illustration_0);
  const result_illustration2 = getImageSrc(data.package_illustration_1_url || data.package_illustration_1);

  return (
    <div className="flex gap-6 items-stretch">
        <table className="w-full border border-gray-500 text-sm mb-6">
            <tbody>
                <tr className="align-center justify-start h-full bg-gray-100">
                    <td className="border border-gray-500 px-3 py-2 font-semibold">Illustrasi Part</td>
                </tr>
                <tr className="h-80">
                    <td className="border border-gray-500 p-3">
                    <img
                        src={getImageSrc(data.photo1_url || illustrationPart)}
                        alt="Illustrasi Part"
                        className="mx-auto h-64 object-contain mb-2"
                    />
                    </td>
                </tr>

                <tr className="align-top items-start h-full  bg-gray-100">
                    <td className="border border-gray-500 px-3 py-2 font-semibold">Illustrasi Kemasan</td>
                </tr>
                <tr className="h-96">
                    <td className="border border-gray-500 p-3">
                    <div className="flex gap-3 justify-center items-center">
                        <img
                            src={result_illustration1}
                            alt="Result Package 1"
                            className="mx-auto h-32 object-contain mb-2"
                        />
                        <div className="text-gray-800 text-lg">
                            <FaArrowRight />
                        </div>
                        <img
                            src={result_illustration2}
                            alt="Result Package 2"
                            className="mx-auto h-32 object-contain mb-2"
                        />
                    </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <table className="w-full border border-gray-500 text-sm mb-6">
            <tbody>
                <tr className="bg-gray-100">
                    <td className="border border-gray-500 px-3 py-2 font-semibold">Kemasan</td>
                </tr>
                <tr className="h-90">
                    <td className="border border-gray-500 p-3">
                    <div className="grid grid-cols-2 gap-4">
                        {packageImages.length > 0 ? (
                        packageImages.map((img, index) => (
                            <img
                            key={index}
                            src={getImageSrc(img)}
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
                <tr className="bg-gray-100">
                    <td className="border border-gray-500 px-3 py-2 font-semibold">Hasil</td>
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
  );
}