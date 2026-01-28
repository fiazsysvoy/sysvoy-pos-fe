"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import ConfirmModal from "./ConfirmModal";

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export default function CategorySidebar({
  onClose,
  onSuccess,
  category,
}: {
  onClose: () => void;
  onSuccess: () => void;
  category?: Category;
}) {
  const isEdit = !!category;

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Prefill for edit
  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setDescription(category.description || "");
      setPreview(category.imageUrl || null);
    }
  }, [category]);

  // Image handler/edit image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Delete category
  const handleDelete = async () => {
    if (!isEdit || !category) return;

    try {
      setDeleting(true);
      await api.delete(`/api/categories/${category.id}`);
      toast.success("Category deleted!");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(
        (err as any)?.response?.data?.message || "Failed to delete category",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Submit category (add/update)
  const handleSubmit = async () => {
    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }
    if (!isEdit && !imageFile) {
      toast.error("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("description", description || "");
    if (imageFile) formData.append("image", imageFile);

    try {
      setSaving(true);

      if (isEdit) {
        await api.patch(`/api/categories/${category!.id}`, formData);
        toast.success("Category updated!");
      } else {
        await api.post(`/api/categories`, formData);
        toast.success("Category added!");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(
        (err as any)?.response?.data?.message ||
          (isEdit ? "Failed to update category" : "Failed to add category"),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-[400px] bg-zinc-200 dark:bg-[#0f0f0f] z-50 p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {isEdit ? "Edit Category" : "Add New Category"}
          </h2>
          <button onClick={onClose}>
            <X className="text-black dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 flex-1 overflow-auto">
          {/* Image */}
          <div>
            <label className="text-sm dark:text-gray-300">Category Icon</label>
            <div className="mt-2 flex flex-col gap-3">
              {preview ? (
                <img
                  src={preview}
                  className="h-36 w-36 rounded border object-contain"
                />
              ) : (
                <div className="h-36 w-36 bg-zinc-400 dark:bg-gray-700 flex items-center justify-center rounded">
                  No Icon
                </div>
              )}

              <input
                id="category-icon"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="category-icon"
                className="cursor-pointer text-pink-500"
              >
                {imageFile || preview ? "Change Icon" : "Select Icon"}
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm dark:text-gray-300">Category Name</label>
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 w-full rounded dark:bg-gray-800 px-3 py-2 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm dark:text-gray-300">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded dark:bg-gray-800 px-3 py-2 dark:text-white"
            />
          </div>
        </div>

        {isEdit && (
          <Button
            className="bg-red-500 mt-4 hover:bg-red-600"
            // onClick={handleDelete}
            onClick={() => setConfirmOpen(true)}
            disabled={deleting || saving}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        )}

        <Button
          className="bg-pink-500 mt-4 hover:bg-pink-600"
          onClick={handleSubmit}
          disabled={deleting || saving}
        >
          {saving ? "Saving..." : isEdit ? "Update Category" : "Add Category"}
        </Button>
        <ConfirmModal
          open={confirmOpen}
          title="Delete Category?"
          description="Deleting this category will also delete all its products. This action cannot be undone."
          loading={deleting}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={async () => {
            setConfirmOpen(false);
            await handleDelete();
          }}
        />
      </div>
    </>
  );
}
