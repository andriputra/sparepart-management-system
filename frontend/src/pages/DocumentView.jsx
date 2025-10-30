import { useParams } from "react-router-dom";
import SpisView from "../components/spisDoc/SpisView";
import SppsView from "../components/sppsDoc/SppsView";
import SpqsView from "../components/spqsDoc/SpqsView";

export default function DocumentView() {
    const { type, doc_no } = useParams();
    const decodedDocNo = decodeURIComponent(doc_no);
    const docType = type?.toUpperCase();

    if (docType === "SPIS") {
        return <SpisView doc_no={decodedDocNo} />;
    } 
    else if (docType === "SPPS") {
        return <SppsView doc_no={decodedDocNo} />;
    } 
    else if (docType === "SPQS") {
        return <SpqsView doc_no={decodedDocNo} />;
    } 
    else {
        return <p className="text-center py-10 text-red-600">Dokumen tidak dikenali.</p>;
    }
}