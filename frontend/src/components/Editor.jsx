"use client";

import { apiRequest } from "@/services/api";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Toast from "@/components/Toast";
export default function Editor({ page }) {
  console.log("Page:", page);
  const pageID = page?.page?.id;
  const [markdown, setMarkdown] = useState(
    page?.page?.content || "## Write Markdown here..."
  );
  const [toast, setToast] = useState(null);
  useEffect(() => {
    setMarkdown(page?.page?.content || "## Write Markdown here...");
  }, [page]);

  const handleSave = async () => {
    try {
      console.log("Saving Markdown...", markdown);
      const response = await apiRequest(
        "/update-page",
        "PUT",
        {
          _id: pageID,
          content: markdown ?? "",
        },
        false
      );
      setToast({ message: "Markdown saved successfully!", type: "success" });
    } catch (error) {
      console.error("Error saving Markdown:", error);
      setToast({ message: error.message, type: "error" });
    }
  };

  return (
    <div className="p-4 mx-auto">
      <textarea
        className="w-full h-40 p-2 border rounded-md focus:ring focus:ring-blue-300"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Write Markdown here..."
      />
      <button
        className="bg-amber-500 px-4 py-2 rounded-md mt-2"
        onClick={handleSave}
      >
        Save
      </button>

      <div className="border p-4 mt-4 bg-gray-100 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Preview:</h2>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
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
