"use client";
import { useState } from "react";
import { z } from "zod";
import { apiRequest } from "@/services/api";

const pageSchema = z.object({
  name: z.string().min(3, "Page name must be at least 3 characters"),
  title: z.string().min(3, "Page title must be at least 3 characters"),
  parent_id: z.union([z.string(), z.number()]).optional(),
});

export default function AddPageModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    title: "",
    parent_id: "",
  });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "parent_id" && value ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const validation = pageSchema.safeParse(form);
    if (!validation.success) {
      setErrors(validation.error.format());
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("title", form.title);
    if (form.parent_id) formData.append("parent_id", String(form.parent_id));

    try {
      const response = await apiRequest("add-page", "POST", formData, false);
      if (response) {
        onSave(form);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white/90 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Page</h2>

        <input
          type="text"
          name="name"
          placeholder="Page Name"
          className="w-full p-2 border rounded mb-2"
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
          className="w-full p-2 border rounded mb-2"
          value={form.title}
          onChange={handleChange}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title._errors[0]}</p>
        )}

        {/* Parent Page Select Dropdown */}
        <select
          name="parent_id"
          className="w-full p-2 border rounded mb-2"
          value={form.parent_id || ""}
          onChange={handleChange}
        >
          <option value="">Select Parent Page</option>
          <option value="1">Parent Page 1</option>
          <option value="2">Parent Page 2</option>
          <option value="3">Parent Page 3</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
