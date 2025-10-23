import { useState } from "react";
import StepSpis from "../components/StepSpis";
import StepSpps from "../components/StepSpps";
import StepSpqs from "../components/StepSpqs";
import DashboardLayout from "../layouts/DashboardLayout";

export default function DocumentCreate() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    spis: {},
    spps: {},
    spqs: {},
  });

  const handleNext = (data) => {
    if (step === 1) setFormData({ ...formData, spis: data });
    if (step === 2) setFormData({ ...formData, spps: data });
    if (step === 3) setFormData({ ...formData, spqs: data });
    setStep(step + 1);
    console.log("Current Step:", step);
  };

  const handlePrev = () => setStep(step - 1);

  const handleSubmit = () => {
    console.log("Submit All Data:", formData);
    alert("Dokumen berhasil disubmit!");
  };

  // Step titles untuk UI
  const steps = [
    { id: 1, label: "SPIS - Spare Part Information Sheet" },
    { id: 2, label: "SPPS - Spare Part Package Sheet" },
    { id: 3, label: "SPQS - Spare Part Quality Sheet" },
  ];

  return (
    <DashboardLayout>
        {/* ✅ STEP INDICATOR */}
        <div className="flex justify-between mb-10 relative bg-white shadow px-6 py-3 sticky top-0 z-10">
          {steps.map((s, index) => (
            <div key={s.id} className="flex-1 flex flex-col items-center">
              {/* Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white transition-all duration-300
                ${
                  step === s.id
                    ? "bg-blue-600 scale-110 shadow-lg"
                    : step > s.id
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                {s.id}
              </div>
              {/* Label */}
              <p
                className={`text-xs mt-2 text-center ${
                  step === s.id ? "text-blue-600 font-medium" : "text-gray-500"
                }`}
              >
                {s.label}
              </p>
              {/* Line connector */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-[calc(50%+20px)] right-[calc(50%-20px)] h-[2px] 
                  ${
                    step > s.id ? "bg-green-500" : "bg-gray-300"
                  } transition-all duration-300`}
                ></div>
              )}
            </div>
          ))}
        </div>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-8 text-center text-gray-700">
          Input Dokumen Sparepart
        </h1>

        {/* ✅ FORM STEPS */}
        {step === 1 && (
          <StepSpis onNext={handleNext} initialData={formData.spis} />
        )}
        {step === 2 && (
          <StepSpps
            onNext={handleNext}
            onPrev={handlePrev}
            initialData={formData.spps}
          />
        )}
        {step === 3 && (
          <StepSpqs
            onPrev={handlePrev}
            onNext={handleSubmit}
            initialData={formData.spqs}
          />
        )}

        {/* ✅ Footer Step Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Step {step} dari {steps.length}
        </div>
      </div>
    </DashboardLayout>
  );
}