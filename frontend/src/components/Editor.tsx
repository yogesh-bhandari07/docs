"use client";

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";

const Editor = () => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!editorRef.current) {
        editorRef.current = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
            list: List,
            image: ImageTool,
            paragraph: Paragraph,
          },
          placeholder: "Start typing here...",
        });
      }
    }

    return () => {
      // ✅ Fix: Ensure destroy is called only if editor instance exists
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-4 border rounded-md shadow-md">
      <div id="editorjs"></div>
    </div>
  );
};

export default Editor;
