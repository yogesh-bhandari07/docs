"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Editor({ page }: { page: any }) {
  console.log("Page:", page);
  const [markdown, setMarkdown] = useState(
    page?.page?.content || "## Hello, Markdown!"
  );

  useEffect(() => {
    setMarkdown(page?.page?.content || "## Hello, Markdown!");
  }, [page]);

  return (
    <div className="p-4 mx-auto">
      <textarea
        className="w-full h-40 p-2 border rounded-md focus:ring focus:ring-blue-300"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Write Markdown here..."
      />

      <div className="border p-4 mt-4 bg-gray-100 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Preview:</h2>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
