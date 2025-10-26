import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSpisData } from "../store/spisSlice";
import StepSpis from "../components/StepSpis";
import StepSpps from "../components/StepSpps";
import StepSpqs from "../components/StepSpqs";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

export default function DocumentCreate() {
    // === Bypass step dari query param ===
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);

    useEffect(() => {
        const stepParam = searchParams.get("step");
        if (stepParam) {
        const targetStep = parseInt(stepParam);
        if (targetStep >= 1 && targetStep <= 3) setStep(targetStep);
        }
    }, [searchParams]);

    const dispatch = useDispatch();
    const { form: spisForm } = useSelector((state) => state.spis);

    // === Local formData untuk cross-step ===
    const [formData, setFormData] = useState({
        spis: {},
        spps: {},
        spqs: {},
    });

    // === Handle Next Step ===
    const handleNext = (data) => {
        if (step === 1) {
            setFormData((prev) => ({ ...prev, spis: data }));
            dispatch(setSpisData(data));
        }
        if (step === 2) setFormData((prev) => ({ ...prev, spps: data }));
        if (step === 3) setFormData((prev) => ({ ...prev, spqs: data }));

        // Kalau belum step terakhir, baru naik step
        if (step < 3) setStep(step + 1);
    };

    // === Handle Previous Step ===
    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    // === Handle Final Submit ===
    const handleSubmit = () => {
        console.log("Submit All Data:", formData);
        toast.success("Dokumen berhasil disubmit!");
    };

    // === Step Titles ===
    const steps = [
        { id: 1, label: "SPIS - Spare Part Information Sheet" },
        { id: 2, label: "SPPS - Spare Part Package Sheet" },
        { id: 3, label: "SPQS - Spare Part Quality Sheet" },
    ];

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
                initialData={formData.spis} // untuk draft auto-fill kalau user kembali
            />
            )}

            {step === 2 && (
            <StepSpps 
                onNext={handleNext} 
                onPrev={handlePrev}
                initialData={formData.spis} // ⚡ bawa data dari SPIS
            />
            )}

            {step === 3 && (
            <StepSpqs 
                onPrev={handlePrev} 
                onNext={handleSubmit}
                initialData={{ ...formData.spis, ...formData.spps }} // ⚡ gabungkan data SPIS & SPPS
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