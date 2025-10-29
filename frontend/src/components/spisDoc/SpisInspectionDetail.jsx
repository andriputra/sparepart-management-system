import { FiCheckSquare, FiSquare } from "react-icons/fi";

export default function SpisInspectionDetail({ data }) {
    
    const partMaterial = Array.isArray(data.part_material)
        ? data.part_material
        : JSON.parse(data.part_material || "[]");
    const materials = ["Rubber", "Metal", "Plastic", "Glass", "Other"];
    const hasMaterial = (material) => partMaterial.includes(material);
    const otherMaterials = partMaterial.filter(
        (m) => !["Rubber", "Metal", "Plastic", "Glass"].includes(m)
    );

    const inspectionData = data.inspection
        ? JSON.parse(data.inspection)
        : {};

    return (
        <>
        <table className="w-full border border-gray-500 text-sm mb-6">
            <tbody>
                <tr>
                    <td colSpan="5" className="border border-gray-500 p-2 font-semibold text-center">Part Material</td>
                </tr>
                <tr>
                    <td className="border border-gray-500 p-2 text-center">
                        {hasMaterial("Rubber") ? (
                            <FiCheckSquare className="inline text-green-600 mr-1" />
                        ) : (
                            <FiSquare className="inline text-gray-400 mr-1" />
                        )}
                        Karet
                    </td>

                    <td className="border border-gray-500 p-2 text-center">
                        {hasMaterial("Metal") ? (
                            <FiCheckSquare className="inline text-green-600 mr-1" />
                        ) : (
                            <FiSquare className="inline text-gray-400 mr-1" />
                        )}
                        Metal
                    </td>

                    <td className="border border-gray-500 p-2 text-center">
                        {hasMaterial("Plastic") ? (
                            <FiCheckSquare className="inline text-green-600 mr-1" />
                        ) : (
                            <FiSquare className="inline text-gray-400 mr-1" />
                        )}
                        Plastik
                    </td>

                    <td className="border border-gray-500 p-2 text-center">
                        {hasMaterial("Glass") ? (
                            <FiCheckSquare className="inline text-green-600 mr-1" />
                        ) : (
                            <FiSquare className="inline text-gray-400 mr-1" />
                        )}
                        Kaca
                    </td>

                    <td className="border border-gray-500 p-2 text-center">
                        {hasMaterial("Other") || otherMaterials.length > 0 ? (
                            <>
                                Lain-lain: 
                                <FiCheckSquare className="inline text-green-600 mr-1" />
                                {otherMaterials.join(", ") || "Other"}
                            </>
                        ) : (
                            <>
                                <FiSquare className="inline text-gray-400 mr-1" /> Lain-lain
                            </>
                        )}
                    </td>
                </tr>
            </tbody>
        </table>

        <table className="w-full border border-gray-500 text-sm mb-6">
            <tbody>
                <tr>
                    <td colSpan="4" className="border border-gray-500 p-2 font-semibold text-center">Detail Inspeksi</td>
                </tr>
                <tr>
                    <td className="border border-gray-500 p-1 font-semibold  w-[20%]">Kondisi Visual</td>
                    <td className="border border-gray-500 p-1">{inspectionData.visual_condition || "-"}</td>
                    <td className="border border-gray-500 p-1"></td>
                    <td className="border border-gray-500 p-1"></td>
                </tr>
                <tr>
                    <td className="border border-gray-500 p-1 font-semibold  w-[20%]">Part System</td>
                    <td className="border border-gray-500 p-1">{inspectionData.part_system || "-"}</td>
                    <td className="border border-gray-500 p-1 "></td>
                    <td className="border border-gray-500 p-1"></td>
                </tr>
                <tr>
                    <td className="border border-gray-500 p-1 font-semibold  w-[20%]">Panjang</td>
                    <td className="border border-gray-500 p-1">{inspectionData.length || "-"} mm</td>
                    <td className="border border-gray-500 p-1 "></td>
                    <td className="border border-gray-500 p-1"></td>
                </tr>
                <tr>
                    <td className="border border-gray-500 p-1 font-semibold  w-[20%]">Lebar</td>
                    <td className="border border-gray-500 p-1">{inspectionData.width || "-"} mm</td>
                    <td className="border border-gray-500 p-1 "></td>
                    <td className="border border-gray-500 p-1"></td>
                </tr>
                <tr>
                    <td className="border border-gray-500 p-1 font-semibold  w-[20%]">Tinggi</td>
                    <td className="border border-gray-500 p-1">{inspectionData.height || "-"} mm</td>
                    <td className="border border-gray-500 p-1 "></td>
                    <td className="border border-gray-500 p-1"></td>
                </tr>
                <tr>
                    <td className="border border-gray-500 p-1 font-semibold  w-[20%]">Berat</td>
                    <td className="border border-gray-500 p-1">{inspectionData.weight || "-"} Kg</td>
                    <td className="border border-gray-500 p-1 "></td>
                    <td className="border border-gray-500 p-1"></td>
                </tr>
                <tr>
                    <td className="border border-gray-500 p-1 font-semibold  w-[20%]">Dimensi Kemasan</td>
                    <td className="border border-gray-500 p-1">{inspectionData.package_dimension || "-"} </td>
                    <td className="border border-gray-500 p-1 "></td>
                    <td className="border border-gray-500 p-1"></td>
                </tr>
            </tbody>
        </table>
        </>
    );
}