const BASE_URL = import.meta.env.VITE_SERVER_URL;
const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
};
import { useState, useEffect } from "react";
import StepSpis from "../components/StepSpis";
import StepSpps from "../components/StepSpps";
import StepSpqs from "../components/StepSpqs";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DocumentCreate() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    spis: {},
    spps: {},
    spqs: {},
  });

  // Step navigation from URL
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const targetStep = parseInt(stepParam);
      if (targetStep >= 1 && targetStep <= 3) setStep(targetStep);
    }
  }, [searchParams]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spisId = urlParams.get("spis_id");
    const sppsId = urlParams.get("spps_id");
    const spqsId = urlParams.get("spqs_id");
    console.log({ spisId, sppsId, spqsId });
  
    const fetchSpis = async (id) => {
      try {
        const res = await api.get(`/spis/by-id/${id}`);
        if (res.data) {
          // Parse inspection if string
          let inspection = res.data.inspection;
          if (typeof inspection === "string") {
            try {
              inspection = JSON.parse(inspection);
            } catch (e) {
              inspection = {};
            }
          }
          // Sanitize part_images
          let part_images = res.data.part_images;
          if (typeof part_images === "string") {
            try {
              part_images = JSON.parse(part_images);
            } catch (e) {
              part_images = [];
            }
          }
          if (!Array.isArray(part_images)) part_images = [];
          // Map part_images to ensure URL is absolute
          part_images = part_images.map((img) => {
            if (!img) return img;
            // If img is a string, convert to object
            if (typeof img === "string") {
              return { url: getFullImageUrl(img), description: "" };
            }
            return {
              ...img,
              url: img.url ? getFullImageUrl(img.url) : "",
            };
          });
          setFormData((prev) => ({
            ...prev,
            spis: {
              ...res.data,
              date: formatDate(res.data.date),
              photo1_url: getFullImageUrl(res.data.photo1_url || res.data.photo1),
              photo2_url: getFullImageUrl(res.data.photo2_url || res.data.photo2),
              inspection: inspection,
              part_images,
            },
          }));
          localStorage.setItem("spis_id", id);
        }
      } catch (err) {
        toast.error("Gagal mengambil data SPIS.");
      }
    };
  
    const fetchSpps = async (id) => {
      try {
        const res = await api.get(`/spps/by-id/${id}`);
        if (res.data) {
          // Sanitize illustration_part and part_images if present
          let illustration_part = getFullImageUrl(res.data.illustration_part);
          let part_images = res.data.part_images;
          if (typeof part_images === "string") {
            try {
              part_images = JSON.parse(part_images);
            } catch (e) {
              part_images = [];
            }
          }
          if (!Array.isArray(part_images)) part_images = [];
          // Map part_images to ensure URL is absolute
          part_images = part_images.map((img) => {
            if (!img) return img;
            // If img is a string, convert to object
            if (typeof img === "string") {
              return { url: getFullImageUrl(img), description: "" };
            }
            return {
              ...img,
              url: img.url ? getFullImageUrl(img.url) : "",
            };
          });
          setFormData((prev) => ({
            ...prev,
            spps: {
              ...res.data,
              illustration_part,
              part_images,
            },
          }));
          localStorage.setItem("spps_id", id);
        }
      } catch (err) {
        toast.error("Gagal mengambil data SPPS.");
      }
    };
  
    const fetchSpqs = async (id) => {
      try {
        const res = await api.get(`/spqs/by-id/${id}`);
        if (res.data) {
          // Sanitize illustration_part and part_images if present
          let illustration_part = getFullImageUrl(res.data.illustration_part);
          let part_images = res.data.part_images;
          if (typeof part_images === "string") {
            try {
              part_images = JSON.parse(part_images);
            } catch (e) {
              part_images = [];
            }
          }
          if (!Array.isArray(part_images)) part_images = [];
          // Map part_images to ensure URL is absolute
          part_images = part_images.map((img) => {
            if (!img) return img;
            if (typeof img === "string") {
              return { url: getFullImageUrl(img), description: "" };
            }
            return {
              ...img,
              url: img.url ? getFullImageUrl(img.url) : "",
            };
          });
          setFormData((prev) => ({
            ...prev,
            spqs: {
              ...res.data,
              illustration_part,
              part_images,
            },
          }));
          localStorage.setItem("spqs_id", id);
        }
      } catch (err) {
        toast.error("Gagal mengambil data SPQS.");
      }
    };
  
    // Only fetch if ID is valid (not 'undefined' and numeric)
    const isValidId = (id) => id && id !== "undefined" && !isNaN(Number(id));
    if (isValidId(spisId)) fetchSpis(spisId);
    if (isValidId(sppsId)) fetchSpps(sppsId);
    if (isValidId(spqsId)) fetchSpqs(spqsId);
  }, []);

  // --- Step Handler ---
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
      return newData;
    });
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = (data) => {
    if (step === 2) {
      setFormData((prev) => ({
        ...prev,
        spps: data,
        spis: prev.spis || JSON.parse(localStorage.getItem("spis_form_data") || "{}"),
      }));
    }
    if (step === 3) {
      setFormData((prev) => ({
        ...prev,
        spqs: data,
        spps: prev.spps || JSON.parse(localStorage.getItem("spps_form_data") || "{}"),
      }));
    }
    if (step > 1) setStep(step - 1);
  };

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
          <StepSpis onNext={handleNext} initialData={formData.spis} />
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
            initialData={{ ...formData.spis, ...formData.spps, ...formData.spqs }}
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