import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import SpisHeader from "./SpisHeader";
import SpisPartInfo from "./SpisPartInfo";
import SpisInspectionDetail from "./SpisInspectionDetail";
import SpisFooter from "./SpisFooter";
import SpisDetailPart from "./SpisDetailPart";

export default function SpisView() {
    const { doc_no } = useParams();
    const [data, setData] = useState(null);
    const decodedDocNo = decodeURIComponent(doc_no);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await api.get(`/spareparts/spis?doc_no=${encodeURIComponent(decodedDocNo)}`);
            setData(res.data);
            console.log("📄 Fetched SPIS data:", res.data);
          } catch (err) {
            console.error("Error fetching SPIS:", err);
          }
        };
        fetchData();
    }, [decodedDocNo]);

    if (!data) return <p className="text-center py-10">Memuat data SPIS...</p>;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow p-6 print:p-0 print:shadow-none mt-6 mb-6">
            <SpisHeader data={data} />
            <SpisPartInfo data={data} />
            <SpisInspectionDetail data={data} />
            <SpisFooter data={data} />

            {/* Page Lanjut */}
            <SpisDetailPart data={data}/>

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