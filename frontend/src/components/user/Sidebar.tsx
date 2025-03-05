"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ArrowRight,
} from "lucide-react";

export default function Sidebar({
  project_id,
  onPageSelect,
}: {
  project_id: any;
  onPageSelect: (page: any) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState<any>(null);

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
        console.log("API Response:", response);

        setPages(response || []);

        if (response.length > 0) {
          setSelectedPage(response[0]);
          onPageSelect(response[0]);
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };
    fetchPages();
  }, [project_id]);

  const handlePageSelect = (page: any) => {
    setSelectedPage(page);
    onPageSelect(page);
  };

  return (
    <div className="flex">
      <aside
        className={`bg-gray-800 text-white h-screen p-4 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {isSidebarOpen && (
          <>
            <PageList
              pages={pages}
              selectedPage={selectedPage}
              onPageSelect={handlePageSelect}
            />
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

function PageList({
  pages,
  selectedPage,
  onPageSelect,
}: {
  pages: any[];
  selectedPage: any;
  onPageSelect: (page: any) => void;
}) {
  return (
    <ul>
      {pages.map((page) => (
        <PageItem
          key={page._id}
          page={page}
          selectedPage={selectedPage}
          onSelectPage={onPageSelect}
        />
      ))}
    </ul>
  );
}

function PageItem({
  page,
  selectedPage,
  onSelectPage,
}: {
  page: any;
  selectedPage: any;
  onSelectPage: (page: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="mb-2">
      <button
        className={`w-full text-left p-2 rounded flex items-center justify-between ${
          selectedPage && selectedPage._id === page._id
            ? "bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
        onClick={() => {
          setIsOpen(!isOpen);
          onSelectPage(page); // ✅ Send the full page object
        }}
      >
        <span>{page.name}</span>
        {page.children?.length > 0 &&
          (isOpen ? <ChevronDown size={16} /> : <ArrowRight size={16} />)}
      </button>

      {isOpen && page.children?.length > 0 && (
        <ul className="pl-4 border-l-2 border-gray-500 mt-1">
          {page.children.map((child: any) => (
            <PageItem
              key={child._id}
              page={child}
              selectedPage={selectedPage}
              onSelectPage={onSelectPage}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
