"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-lg font-bold mb-4">Project Menu</h2>
      <button className="w-full bg-blue-500 p-2 rounded">Add Page</button>
    </aside>
  );
}
