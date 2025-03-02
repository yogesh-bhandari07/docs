"use client";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";

export default function ProjectPage() {
  const { slug } = useParams();
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <nav className="p-4 bg-gray-900 text-white shadow-md flex items-center">
          <h1 className="text-xl font-bold">{slug}</h1>
        </nav>

        <div className="flex flex-1 p-4 gap-4">
          <div className="flex-1 bg-white shadow-md p-4 rounded-lg">
            <Editor />
          </div>

          <div className="w-64 bg-gray-100 shadow-md rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
