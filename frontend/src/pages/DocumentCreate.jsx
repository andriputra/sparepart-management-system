import { useState } from "react";
import StepSpis from "../components/StepSpis";
import StepSpps from "../components/StepSpps";
import StepSpqs from "../components/StepSpqs";

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
  };

  const handlePrev = () => setStep(step - 1);

  const handleSubmit = () => {
    console.log("Submit All Data:", formData);
    alert("Dokumen berhasil disubmit!");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Input Dokumen Sparepart</h1>

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

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">Step {step} dari 3</p>
      </div>
    </div>
  );
}