"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAdmin } from "@/services/auth"; // API Call function
import Toast from "@/components/Toast";
import * as z from "zod";

// ✅ **Zod Validation Schema**
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const [toast, setToast] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerAdmin(data);
      setToast({ message: "Admin Registered Successfully!", type: "success" });
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-white w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ✅ Name Field */}
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full p-3 bg-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          {/* ✅ Email Field */}
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-3 bg-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* ✅ Password Field */}
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full p-3 bg-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* ✅ Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      {/* ✅ Toaster Notification */}
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
