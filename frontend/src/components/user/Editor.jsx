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

  return (
    <div className="p-4 mx-auto">
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
