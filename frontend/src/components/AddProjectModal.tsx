"use client";
import { useState } from "react";
import { z } from "zod";
import { apiRequest } from "@/services/api";
import { useRouter } from "next/router";

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  colorTheme: z.string(),
  url: z.string().url("Invalid URL"),
  logo: z.any(),
});

export default function AddProjectModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    colorTheme: "#000000",
    url: "",
    logo: null,
  });
  const [errors, setErrors] = useState<any>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, logo: file });

      // Logo preview
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const validation = projectSchema.safeParse(form);
    if (!validation.success) {
      setErrors(validation.error.format());
      return;
    }

    const formData: any = new FormData();
    formData.append("name", form.name);
    formData.append("colorTheme", form.colorTheme);
    formData.append("url", form.url);
    if (form.logo) {
      formData.append("logo", form.logo); // ✅ File ko as a file append karo
    }

    try {
      const response: any = await apiRequest(
        "add-project",
        "POST",
        formData,
        true
      );
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
        <h2 className="text-xl font-bold mb-4">Add Project</h2>

        <input
          type="text"
          name="name"
          placeholder="Project Name"
          className="w-full p-2 border rounded mb-2"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name._errors[0]}</p>
        )}

        {/* Color Picker */}
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="color"
            name="colorTheme"
            className="w-10 h-10 border rounded"
            value={form.colorTheme}
            onChange={handleChange}
          />
          <input
            type="text"
            name="colorTheme"
            placeholder="Hex Code (#000000)"
            className="w-full p-2 border rounded"
            value={form.colorTheme}
            onChange={handleChange}
          />
        </div>

        {/* Project URL */}
        <input
          type="text"
          name="url"
          placeholder="Project URL"
          className="w-full p-2 border rounded mb-2"
          value={form.url}
          onChange={handleChange}
        />
        {errors.url && (
          <p className="text-red-500 text-sm">{errors.url._errors[0]}</p>
        )}

        {/* Logo Upload */}
        <label className="block w-full cursor-pointer bg-gray-100 p-3 rounded text-center border">
          Upload Logo
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Logo Preview"
            className="w-16 h-16 mt-2 mx-auto rounded-full"
          />
        )}

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
