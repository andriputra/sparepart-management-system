import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import SignaturePad from "react-signature-canvas";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwordOld, setPasswordOld] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [signature, setSignature] = useState("");
  const sigCanvas = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/settings/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setFullname(res.data.fullname || "");
      setUsername(res.data.name || "");
      setEmail(res.data.email || "");
      setSignature(res.data.signature_url || "");
    } catch (err) {
      console.error("Error fetching user profile:", err);
      toast.error("Gagal memuat data profil.");
    }
  };

  // === Ubah profil (fullname, username, email)
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/settings/profile",
        { fullname, username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profil berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui profil.");
    }
  };

  // === Ubah password dengan verifikasi password lama
  const handleChangePassword = async () => {
    if (!passwordOld || !passwordNew) {
      toast.info("Masukkan password lama dan baru.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/settings/password",
        { old_password: passwordOld, new_password: passwordNew },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordOld("");
      setPasswordNew("");
      toast.success("Password berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Gagal memperbarui password.");
    }
  };

  // === Simpan tanda tangan digital
  const handleSaveSignature = async () => {
    try {
      const token = localStorage.getItem("token");
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");

      const res = await api.post(
        "/settings/signature",
        { signature: dataURL },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSignature(res.data.signature_url);
      toast.success("Tanda tangan berhasil disimpan!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan tanda tangan.");
    }
  };

  const handleClearSignature = () => {
    sigCanvas.current.clear();
  };

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">Memuat data...</p>;
  }

  return (
    <DashboardLayout>
      <div className="w-full p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">Pengaturan Akun</h1>

        {/* ==== PROFIL USER ==== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              className="border rounded-md w-full p-2"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
            </label>
            <input
                type="text"
                className="border rounded-md w-full p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                value={username}
                readOnly
            />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <input
                    type="email"
                    className="border rounded-md w-full p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                    value={email}
                    readOnly
                />
            </div>
        </div>

        <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 text-sm mb-10"
            >
            Simpan Perubahan Profil
        </button>

        {/* ==== GANTI PASSWORD ==== */}
        <div className="mb-10 border-t pt-6">
            <h2 className="font-semibold mb-4 text-gray-700">Ubah Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Lama
                </label>
                <input
                    type="password"
                    className="border rounded-md w-full p-2"
                    value={passwordOld}
                    onChange={(e) => setPasswordOld(e.target.value)}
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru
                </label>
                <input
                    type="password"
                    className="border rounded-md w-full p-2"
                    value={passwordNew}
                    onChange={(e) => setPasswordNew(e.target.value)}
                />
                </div>
            </div>
            <button
                onClick={handleChangePassword}
                className="mt-4 bg-yellow-500 text-white px-4 py-3 rounded hover:bg-yellow-600 text-sm"
            >
                Ubah Password
            </button>
        </div>

        {/* ==== TANDA TANGAN DIGITAL ==== */}
        <div className="border-t pt-6">
          <h2 className="font-semibold mb-4 text-gray-700">Tanda Tangan Digital</h2>
            <>
              {signature ? (
                <div className="flex flex-col items-center">
                  <img
                    src={signature}
                    alt="Signature"
                    className="w-48 h-24 object-contain border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => setSignature("")}
                    className="mt-3 text-red-600 hover:text-red-700"
                  >
                    Hapus tanda tangan
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-400 rounded-md p-4 flex flex-col items-center">
                  <SignaturePad
                    ref={sigCanvas}
                    canvasProps={{
                      width: 500,
                      height: 150,
                      className: "border rounded-md",
                    }}
                    backgroundColor="white"
                    penColor="black"
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={handleSaveSignature}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={handleClearSignature}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </>
        </div>
      </div>
    </DashboardLayout>
  );
}