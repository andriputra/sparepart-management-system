import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi"; 

export default function Register() {
    const [name, setName] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("viewer");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
        toast.error("Password and confirmation do not match!", {
            position: "top-right",
            autoClose: 2500,
        });
        return;
        }

        try {
        const { data } = await registerUser(name, fullname, email, password, role);

        toast.success("User registered successfully!", {
            position: "top-right",
            autoClose: 2000,
        });

        setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
        const message = err.response?.data?.error || "Registration failed";
        toast.error(message, {
            position: "top-right",
            autoClose: 2500,
        });
        }
    };

    return (
        <div
        className="flex justify-center items-center h-screen bg-gray-100"
        style={{
            backgroundImage: "url('/bg-login2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
        <form
            onSubmit={handleRegister}
            className="bg-white p-8 rounded-2xl shadow-md w-96"
        >
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                Register User
            </h2>

            <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
                required
            />

            <input
                type="text"
                placeholder="User Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
                required
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
                required
            />

            {/* Password field */}
            <div className="relative mb-3">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded pr-10"
                required
            />
            <span
                className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <FiEye /> : <FiEyeOff />}
            </span>
            </div>

            {/* Confirm Password field */}
            <div className="relative mb-3">
            <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded pr-10"
                required
            />
            <span
                className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
            </span>
            </div>

            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
            >
                <option value="viewer">Viewer</option>
                <option value="approval">Approver</option>
                <option value="admin">Admin</option>
            </select>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                Register
            </button>

            <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
            >
                Login
            </span>
            </p>
        </form>
        </div>
    );
}