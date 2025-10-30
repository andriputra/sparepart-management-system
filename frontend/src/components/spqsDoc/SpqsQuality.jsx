import { FiCheck, FiX } from "react-icons/fi";
export default function SpqsQuality({ data }) {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const renderCheck = (value) => {
        if (value === 1 || value === "1") {
            return <FiCheck className="text-green-600 mx-auto" size={18} />;
        }
        return <FiX className="text-red-600 mx-auto" size={18} />;
    };

    const renderValueCheck = (value) => {
        if (value && value !== "-") {
          return <FiCheck className="text-green-600 mx-auto" size={18} />;
        }
        return <FiX className="text-red-600 mx-auto" size={18} />;
    };

    return (
        <>
            <table className="w-full border border-gray-500 text-sm mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        <td className="border border-gray-500 p-1 font-semibold text-center">No</td>
                        <td className="border border-gray-500 p-1 px-3 font-semibold">Kriteria</td>
                        <td className="border border-gray-500 p-1 px-3 font-semibold">Standar Kualitas</td>
                        <td className="border border-gray-500 p-1 px-3 font-semibold text-center">Hasil</td>
                        <td className="border border-gray-500 p-1 px-3 font-semibold">Keterangan</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-500 p-1 text-center">1</td>
                        <td className="border border-gray-500 p-1">Dimensi</td>
                        <td className="border border-gray-500 p-1">Sesuai dengan standar kualitas</td>
                        <td className="border border-gray-500 p-1">{renderValueCheck(data.criteria_dimension)}</td>
                        <td className="border border-gray-500 p-1">{data.criteria_dimension || '-'}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 text-center">2</td>
                        <td className="border border-gray-500 p-1">Berat</td>
                        <td className="border border-gray-500 p-1">Sesuai dengan standar kualitas</td>
                        <td className="border border-gray-500 p-1">{renderValueCheck(data.criteria_weight)}</td>
                        <td className="border border-gray-500 p-1">{data.criteria_weight || '-'} Kg</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 text-center">3</td>
                        <td className="border border-gray-500 p-1">Material</td>
                        <td className="border border-gray-500 p-1">Sesuai dengan standar kualitas</td>
                        <td className="border border-gray-500 p-1">{renderValueCheck(data.criteria_material)}</td>
                        <td className="border border-gray-500 p-1">{data.criteria_material || '-'}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 text-center">4</td>
                        <td className="border border-gray-500 p-1">Finishing</td>
                        <td className="border border-gray-500 p-1">Sesuai dengan standar kualitas</td>
                        <td className="border border-gray-500 p-1">{renderValueCheck(data.criteria_finishing)}</td>
                        <td className="border border-gray-500 p-1">{data.criteria_finishing || '-'}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 text-center">5</td>
                        <td className="border border-gray-500 p-1">Fungsi</td>
                        <td className="border border-gray-500 p-1">Sesuai dengan standar kualitas</td>
                        <td className="border border-gray-500 p-1">{renderValueCheck(data.criteria_function)}</td>
                        <td className="border border-gray-500 p-1">{data.criteria_function || '-'}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 text-center">6</td>
                        <td className="border border-gray-500 p-1">Kelengkapan</td>
                        <td className="border border-gray-500 p-1">Sesuai dengan standar kualitas</td>
                        <td className="border border-gray-500 p-1">{renderValueCheck(data.criteria_completeness)}</td>
                        <td className="border border-gray-500 p-1">{data.criteria_completeness || '-'}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1 text-center">7</td>
                        <td className="border border-gray-500 p-1">Kondisi Part</td>
                        <td className="border border-gray-500 p-1">Keausan</td>
                        <td className="border border-gray-500 p-1 text-center">{renderCheck(data.surface_bend)}</td>
                        <td className="border border-gray-500 p-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1"></td>
                        <td className="border border-gray-500 p-1"></td>
                        <td className="border border-gray-500 p-1">Kerusakan</td>
                        <td className="border border-gray-500 p-1 text-center">{renderCheck(data.surface_damage)}</td>
                        <td className="border border-gray-500 p-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1"></td>
                        <td className="border border-gray-500 p-1"></td>
                        <td className="border border-gray-500 p-1">Goresan</td>
                        <td className="border border-gray-500 p-1 text-center">{renderCheck(data.surface_scratch)}</td>
                        <td className="border border-gray-500 p-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1"></td>
                        <td className="border border-gray-500 p-1"></td>
                        <td className="border border-gray-500 p-1">Pecah</td>
                        <td className="border border-gray-500 p-1 text-center">{renderCheck(data.surface_crack)}</td>
                        <td className="border border-gray-500 p-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1"></td>
                        <td className="border border-gray-500 p-1"></td>
                        <td className="border border-gray-500 p-1">Karat</td>
                        <td className="border border-gray-500 p-1 text-center">{renderCheck(data.surface_corrosion)}</td>
                        <td className="border border-gray-500 p-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-500 p-1"></td>
                        <td className="border border-gray-500 p-1"></td>
                        <td className="border border-gray-500 p-1">Bengkok</td>
                        <td className="border border-gray-500 p-1 text-center">{renderCheck(data.surface_wear)}</td>
                        <td className="border border-gray-500 p-1"></td>
                    </tr>
                </tbody>
            </table>

            <table className="w-full border border-gray-500 text-sm mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        <td colSpan={3} className="border border-gray-500 p-1 px-3 font-semibold">Hasil</td> 
                    </tr>
                </thead>
                <tbody>
                    <tr className="text-center">
                        {["Lulus", "Ditolak", "Butuh Perbaikan"].map((label, idx) => {
                            const isChecked =
                            (data.result === "Passed" && label === "Lulus") ||
                            (data.result === "Rejected" && label === "Ditolak") ||
                            (data.result === "Need Improvement" && label === "Butuh Perbaikan");

                            return (
                            <td key={idx} className="border border-gray-500 p-3 font-semibold">
                                <div className="flex items-center justify-center gap-2">
                                    <div
                                        className={`w-5 h-5 border border-gray-700 flex items-center justify-center ${
                                        isChecked ? "bg-gray-400 text-white" : "bg-white"
                                        }`}
                                    >
                                        {isChecked && "✓"}
                                    </div>
                                    <span>{label}</span>
                                </div>
                            </td>
                            );
                        })}
                        </tr>

                    <tr>
                        <td colSpan={3} className="border border-gray-500 p-1 px-3"><b>Komentar:</b><br/>
                            {data.comment}
                        </td> 
                    </tr>
                </tbody>
            </table>
        </>
    );
}