"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { apiRequest } from "@/services/api";
import Toast from "@/components/Toast";

const pageSchema = z.object({
  name: z.string().min(3, "Page name must be at least 3 characters"),
  title: z.string().min(3, "Page title must be at least 3 characters"),
  parent_id: z.union([z.string(), z.number()]).optional(),
});

export default function AddPageModal({
  onClose,
  onSave,
  project_id,
}: {
  onClose: () => void;
  onSave: (data: any) => void;
  project_id: number;
}) {
  const [toast, setToast] = useState<any>({ message: "", type: "" });

  console.log("Project ID:", project_id);
  const [form, setForm]: any = useState({
    name: "",
    title: "",
    parentID: "",
    projectID: project_id,
  });

  const [parentPages, setParentPages] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: value, // Directly set the value
    }));
  };

  const handleSubmit = async () => {
    const validation = pageSchema.safeParse(form);
    if (!validation.success) {
      setErrors(validation.error.format());
      return;
    }

    try {
      const response = await apiRequest("add-page", "POST", form, false);
      if (response) {
        onSave(form);
        onClose();
        setToast({ message: "Page Added Successfully", type: "success" });
      }
    } catch (error) {
      setToast({
        message: "Something went wrong",
        type: "error",
      });
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    // Fetch parent pages from API
    const fetchParentPages = async () => {
      try {
        const response = await apiRequest(
          `get-parent-pages/${project_id}`,
          "GET",
          null,
          false
        );
        if (response) {
          setParentPages(response);
        }
      } catch (error) {
        console.error("Error fetching parent pages:", error);
      }
    };
    fetchParentPages();
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 dark:bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Add Page
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Page Name"
          className="w-full p-2 border rounded mb-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name._errors[0]}</p>
        )}

        <input
          type="text"
          name="title"
          placeholder="Page Title"
          className="w-full p-2 border rounded mb-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
          value={form.title}
          onChange={handleChange}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title._errors[0]}</p>
        )}

        {/* Parent Page Select Dropdown */}
        <select
          name="parentID"
          className="w-full p-2 border rounded mb-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
          value={form.parentID || ""}
          onChange={handleChange}
        >
          <option value="" selected disabled>
            Select Parent Page
          </option>
          {parentPages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.title}
            </option>
          ))}
        </select>
        {errors.parentID && (
          <p className="text-red-500 text-sm">{errors.parentID._errors[0]}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 dark:bg-gray-700 text-white rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
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
