import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios"; 
import SpisView from "../components/spisDoc/SpisView";
import SppsView from "../components/sppsDoc/SppsView";
import SpqsView from "../components/spqsDoc/SpqsView";

export default function DocumentView() {
    const { type, doc_no } = useParams();
    const decodedDocNo = decodeURIComponent(doc_no);
    const docType = type?.toUpperCase();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res;
                if (docType === "SPIS") {
                    res = await api.get(`/spis/by-doc/${encodeURIComponent(decodedDocNo)}`);
                  } else if (docType === "SPPS") {
                    res = await api.get(`/spps/by-doc/${encodeURIComponent(decodedDocNo)}`);
                  } else if (docType === "SPQS") {
                    res = await api.get(`/spqs/by-doc/${encodeURIComponent(decodedDocNo)}`);
                  }
                setData(res.data);
                console.log("📄 Loaded document data:", res.data);
            } catch (err) {
                console.error("Failed to load document data:", err);
            }
        };

        if (decodedDocNo && docType) {
            fetchData();
        }
    }, [decodedDocNo, docType]);
  
    if (docType === "SPIS") {
        return (
            <SpisView
                data={data}
                doc_no={decodedDocNo}
            />
        );
    }
    else if (docType === "SPPS") {
        return (
            <SppsView 
                data={data} 
                doc_no={decodedDocNo} 
            />
        );
    } 
    else if (docType === "SPQS") {
        return (
            <SpqsView 
                data={data}
                doc_no={decodedDocNo} 
            />
        );
    } 
    else {
        return <p className="text-center py-10 text-red-600">Dokumen tidak dikenali.</p>;
    }
}