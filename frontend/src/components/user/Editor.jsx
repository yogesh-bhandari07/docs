"use client";

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
  const [title, setTitle] = useState(page?.page?.title || "");
  const [toast, setToast] = useState(null);
  useEffect(() => {
    setMarkdown(page?.page?.content || "## Write Markdown here...");
  }, [page]);

  return (
    <div className="p-4 mx-auto ">
      <h1 className="text-3xl font-bold mb-4">{title ?? "title"}</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>

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
