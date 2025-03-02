"use client";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import { useState } from "react";

export default function Navbar({ onAddProject }: { onAddProject: () => void }) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <div className="space-x-4">
        <button
          onClick={onAddProject}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          + Add Project
        </button>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
