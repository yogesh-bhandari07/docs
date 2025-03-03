"use client";
import { useEffect, useState } from "react";
import AddPageModal from "./AddPageModal";
import { apiRequest } from "@/services/api";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ArrowRight,
} from "lucide-react";

export default function Sidebar({ project_id }: { project_id: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useEffect(() => {
    const fetchPages = async () => {
      try {
        console.log("Fetching pages for project:", project_id);
        const response = await apiRequest(
          `get-pages/${project_id}`,
          "GET",
          null,
          false
        );
        const formattedPages = buildPageHierarchy(response || []);
        setPages(formattedPages);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };
    fetchPages();
  }, [project_id]);

  // Convert flat list of pages into a nested structure
  const buildPageHierarchy = (pages: any[]) => {
    let pageMap: any = {};
    let rootPages: any[] = [];

    // Initialize page map with children array
    pages.forEach((page) => {
      pageMap[page._id] = {
        ...page,
        children: pageMap[page._id]?.children || [],
      };
    });

    pages.forEach((page) => {
      if (page.parentID && pageMap[page.parentID]) {
        if (!pageMap[page.parentID].children) {
          pageMap[page.parentID].children = [];
        }
        pageMap[page.parentID].children.push(pageMap[page._id]);
      } else {
        rootPages.push(pageMap[page._id]);
      }
    });

    return rootPages;
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white h-screen p-4 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {isSidebarOpen && (
          <>
            <button
              className="w-full bg-blue-500 p-2 rounded mb-4 mt-10"
              onClick={() => setIsModalOpen(true)}
            >
              Add Page
            </button>

            {isModalOpen && (
              <AddPageModal
                onClose={() => setIsModalOpen(false)}
                project_id={project_id}
                onSave={(data) => {
                  console.log("Page added:", data);
                  setIsModalOpen(false);
                }}
              />
            )}

            <PageList pages={pages} />
          </>
        )}
      </aside>

      <button
        className="absolute left-0 top-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-all"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
}

function PageList({ pages }: { pages: any[] }) {
  return (
    <ul>
      {pages.map((page) => (
        <PageItem key={page._id} page={page} />
      ))}
    </ul>
  );
}

function PageItem({ page }: { page: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="mb-2">
      <button
        className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{page.name}</span>
        {page.children &&
          page.children.length > 0 &&
          (isOpen ? <ChevronDown size={16} /> : <ArrowRight size={16} />)}
      </button>

      {isOpen && page.children && page.children.length > 0 && (
        <ul className="pl-4 border-l-2 border-gray-500 mt-1">
          {page.children.map((child: any) => (
            <PageItem key={child._id} page={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
