export default function SpqsHeader({ data }) {
    return (
        <div className="flex pb-2 mb-3 justify-between">
            <div className="flex-1 text-center border border-gray-500 ">
                <img src="/doc-logo.png" alt="Logo" className="h-16 object-contain p-2" />
            </div>
            <div className="flex-0 border-t border-b border-gray-500 py-4 px-4">
                <h1 className="text-2xl font-semibold text-center uppercase">
                    Spare Part Quality Sheet
                </h1>
            </div>
            <div className="flex-1 border border-gray-500">
                <p className="border-b border-gray-500 px-2 py-1"><strong>Doc No.:</strong> </p>
                <p className="px-2">{data.doc_no || "-"}</p>
            </div>
        </div>
    );
}