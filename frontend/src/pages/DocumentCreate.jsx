import { useState, useEffect } from "react";
import StepSpis from "../components/StepSpis";
import StepSpps from "../components/StepSpps";
import StepSpqs from "../components/StepSpqs";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

export default function DocumentCreate() {
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);

    useEffect(() => {
        const stepParam = searchParams.get("step");
        if (stepParam) {
        const targetStep = parseInt(stepParam);
        if (targetStep >= 1 && targetStep <= 3) setStep(targetStep);
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        spis: {},
        spps: {},
        spqs: {},
    });

    const handleNext = (data) => {
        if (data === "restart") {
          setFormData({ spis: {}, spps: {}, spqs: {} });
          localStorage.clear(); 
          setStep(1);
          toast.info("Form baru siap diisi.");
          return;
        }
      
        setFormData((prev) => {
          const newData = { ...prev };
          if (step === 1) newData.spis = data;
          if (step === 2) newData.spps = data;
          if (step === 3) newData.spqs = data;
      
          const safeData = JSON.parse(
            JSON.stringify(newData, (key, value) => {
              if (
                value instanceof File ||
                value instanceof Blob ||
                value instanceof HTMLElement ||
                value instanceof Window
              ) {
                return undefined;
              }
              return value;
            })
          );
      
          localStorage.setItem("formData", JSON.stringify(safeData));
          return newData;
        });
      
        if (step < 3) setStep(step + 1);
    };
    // === Handle Previous Step ===
    const handlePrev = (data) => {
        if (step === 2) {
            setFormData((prev) => ({ ...prev, spps: data }));
        }
        if (step === 3) {
            setFormData((prev) => ({ ...prev, spqs: data }));
        }
        if (step > 1) setStep(step - 1);
    };

    // === Handle Final Submit ===
    const handleSubmit = (action) => {
        if (action === "restart") {
          setFormData({ spis: {}, spps: {}, spqs: {} });
          setStep(1);
          toast.info("Form baru siap diisi.");
          return;
        }
      
        console.log("Submit All Data:", formData);
        toast.success("Dokumen berhasil disubmit & siap di-approve!");
      };

    // === Step Titles ===
    const steps = [
        { id: 1, label: "SPIS - Spare Part Information Sheet" },
        { id: 2, label: "SPPS - Spare Part Package Sheet" },
        { id: 3, label: "SPQS - Spare Part Quality Sheet" },
    ];

    // === Ambil data draft dari backend berdasarkan doc_no ===
    const fetchExistingDraft = async (docNo) => {
        try {
        const response = await fetch(`http://127.0.0.1:5050/api/spareparts/get_draft/${encodeURIComponent(docNo)}`);
        if (!response.ok) {
            throw new Error("Gagal mengambil data draft");
        }
    
        const data = await response.json();
        setFormData({
            spis: data.spis || {},
            spps: data.spps || {},
            spqs: data.spqs || {},
        });
    
        toast.info(`Draft ${docNo} berhasil dimuat.`);
        } catch (error) {
        console.error("Error fetching draft:", error);
        toast.error("Gagal memuat data draft.");
        }
    };
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const docNo = params.get("doc_no");
        const storedDocNo =
            docNo ||
            localStorage.getItem("spps_doc_no") ||
            localStorage.getItem("spqs_doc_no") ||
            localStorage.getItem("spis_doc_no");
      
        if (storedDocNo) {
            fetchExistingDraft(storedDocNo);
        }
    }, []);

    return (
        <DashboardLayout>
        {/* === STEP INDICATOR === */}
        <div className="flex justify-between mb-10 relative bg-white shadow px-6 py-3 sticky top-0 z-10">
            {steps.map((s, index) => (
            <div key={s.id} className="flex-1 flex flex-col items-center relative">
                {/* Garis kiri */}
                {index > 0 && (
                <div
                    className={`absolute top-5 left-0 w-1/2 h-[2px] border-t-2 border-dashed ${
                    step > s.id - 1 ? "border-green-500" : "border-gray-300"
                    } transition-all duration-300`}
                ></div>
                )}

                {/* Nomor step */}
                <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white z-10 transition-all duration-300 ${
                        step === s.id
                        ? "bg-blue-600 scale-110 shadow-lg"
                        : step > s.id
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                    >
                    {s.id}
                </div>

                {/* Garis kanan */}
                {index < steps.length - 1 && (
                    <div
                        className={`absolute top-5 right-0 w-1/2 h-[2px] border-t-2 border-dashed ${
                        step > s.id ? "border-green-500" : "border-gray-300"
                        } transition-all duration-300`}
                    ></div>
                )}

                {/* Label */}
                <p
                    className={`text-xs mt-2 text-center ${
                        step === s.id ? "text-blue-600 font-medium" : "text-gray-500"
                    }`}
                    >
                    {s.label}
                </p>
            </div>
            ))}
        </div>

        {/* === FORM CONTAINER === */}
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md mb-10">
            <h1 className="text-2xl font-bold mb-8 text-center text-gray-700">
            Input Dokumen Sparepart
            </h1>

            {step === 1 && (
            <StepSpis 
                onNext={handleNext}
                initialData={formData.spis}
            />
            )}

            {step === 2 && (
            <StepSpps 
                onNext={handleNext} 
                onPrev={handlePrev}
                initialData={{ ...formData.spis, ...formData.spps }}
            />
            )}

            {step === 3 && (
            <StepSpqs 
                onPrev={handlePrev} 
                onNext={handleSubmit}
                initialData={{ ...formData.spis, ...formData.spps }}
            />
            )}

            {/* === FOOTER === */}
            <div className="mt-8 text-center text-gray-500 text-sm">
            Step {step} dari {steps.length}
            </div>
        </div>
        </DashboardLayout>
    );
}