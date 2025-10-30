import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import SppsHeader from "./SppsHeader";
import SppsGeneralInfo from "./SppsGeneralInfo";
import SppsImages from "./SppsImages";

export default function SpisView() {
    const { doc_no } = useParams();
    const [data, setData] = useState(null);
    const decodedDocNo = decodeURIComponent(doc_no);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await api.get(`/spareparts/spps?doc_no=${encodeURIComponent(decodedDocNo)}`);
            setData(res.data);
            console.log("Fetched SPPS data:", res.data);
          } catch (err) {
            console.error("Error fetching SPPS:", err);
          }
        };
        fetchData();
    }, [decodedDocNo]);

    if (!data) return <p className="text-center py-10">Memuat data SPPS...</p>;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow p-6 print:p-0 print:shadow-none mt-6 mb-6">
            <SppsHeader data={data} />
            <SppsGeneralInfo data={data}/>
            <SppsImages data={data}/>

            <div className="text-center mt-6 no-print">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Print PDF
                </button>
            </div>
        </div>
  );
}