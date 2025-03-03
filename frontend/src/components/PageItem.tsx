import React, { useState } from "react";
function PageItem({ page }: { page: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className="relative group mb-2"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="w-full flex items-center justify-between text-left p-2 bg-gray-700 hover:bg-gray-600 rounded">
        {page.name}
        {page.children && page.children.length > 0 && (
          <span className="ml-2">▼</span>
        )}
      </button>

      {/* Submenu */}
      {isOpen && page.children && (
        <ul className="absolute left-full top-0 ml-2 w-48 bg-gray-700 border border-gray-500 rounded shadow-lg hidden group-hover:block">
          {page.children.map((child: any) => (
            <PageItem key={child._id} page={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
