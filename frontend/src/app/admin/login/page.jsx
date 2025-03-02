"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import Toast from "@/components/Toast";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setToast({ message: "Login Successful!", type: "success" });
      setTimeout(() => router.push("/admin/dashboard"), 2000);
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    }
  };

  if (loading) return <SkeletonLoader />;
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-white w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
