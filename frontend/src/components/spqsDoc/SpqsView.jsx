import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import SpqsHeader from "./SpqsHeader";
import SpqsGeneralInfo from "./SpqsGeneralInfo";
import SpqsQuality from "./SpqsQuality";
import SpqsFooter from "./SpqsFooter";

export default function SpqsView() {
    const { doc_no } = useParams();
    const [data, setData] = useState(null);
    const decodedDocNo = decodeURIComponent(doc_no);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await api.get(`/spareparts/spqs?doc_no=${encodeURIComponent(decodedDocNo)}`);
            setData(res.data);
            console.log("📄 Fetched SPQS data:", res.data);
          } catch (err) {
            console.error("Error fetching SPQS:", err);
          }
        };
        fetchData();
    }, [decodedDocNo]);

    if (!data) return <p className="text-center py-10">Memuat data SPQS...</p>;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow p-6 print:p-0 print:shadow-none mt-6 mb-6">
            <SpqsHeader data={data} />
            <SpqsGeneralInfo data={data}/>
            <SpqsQuality data={data}/>
            <SpqsFooter data={data}/>
            
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