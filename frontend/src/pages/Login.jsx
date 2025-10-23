import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.id);

      toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
      console.log("Login response:", data);
    } catch (err) {
      const message = err.response?.data?.error || "Login failed";
      setError(message);
      toast.error(message);
    }
    
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-gray-100 flex-col"
      style={{
        backgroundImage: "url('/bg-login2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-96 relative"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <h4 className="text-lg mb-4 text-center">Sparepart Management System</h4>

        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        {/* Password + Icon Eye */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 border rounded pr-10"
            required
          />
          <span
            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEye/> : <FiEyeOff/>} 
          </span>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {/* Link ke register */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
      <p className="text-sm text-center mt-4 text-gray-400">
          created by: 2025 <a href="https://flexbox.id">flexbox.id</a> 
        </p>
    </div>
  );
}