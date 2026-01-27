"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios"; // use your interceptor

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  publicId: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
  categoryId: string;
  images?: ProductImage[];
}

interface Props {
  onClose: () => void;
  onSuccess: () => Promise<void>;
  categories: Category[];
  product?: Product;
}

export default function SingleProductSidebar({
  onClose,
  categories,
  product,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [cost, setCost] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState("");

  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(product);

  // Prefill for edit
  useEffect(() => {
    if (!product) return;

    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price);
    setCost(product.cost ?? "");
    setStock(product.stock);
    setCategoryId(product.categoryId);

    if (product.images?.length) setExistingImages(product.images);
  }, [product]);

  // Handle new image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = "";
  };

  const removeExistingImage = (index: number) =>
    setExistingImages((prev) => prev.filter((_, i) => i !== index));

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !price || cost === "" || !stock || !categoryId) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("cost", String(cost));
    formData.append("stock", String(stock));
    formData.append("categoryId", categoryId);

    // Retained old images
    formData.append("images", JSON.stringify(existingImages));

    // Append new images
    newImages.forEach((file) => formData.append("prodImages", file));

    try {
      setLoading(true);

      if (isEdit && product) {
        await api.patch(`/api/products/${product.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } else {
        await api.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully!");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-[420px] bg-zinc-300 dark:bg-[#0f0f0f] z-50 p-6 flex flex-col px-4 py-6 text-black">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose}>
            <X className="text-black dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-auto scrollbar-none">
          {/* Images */}
          <div>
            <label className="text-sm text-black dark:text-gray-300">
              Product Images
            </label>

            <div className="mt-2 flex flex-wrap gap-3">
              {existingImages.map((img, i) => (
                <div key={img.publicId} className="relative">
                  <img
                    src={img.url}
                    className="h-36 w-36 rounded object-cover border border-gray-600"
                    alt="existing"
                  />
                  <button
                    onClick={() => removeExistingImage(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {newPreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    className="h-36 w-36 rounded object-cover border border-gray-600"
                    alt="preview"
                  />
                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {!existingImages.length && !newPreviews.length && (
                <div className="h-36 w-36 bg-zinc-400 dark:bg-gray-700 flex items-center justify-center dark:text-gray-400 rounded">
                  No Images
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="product-images"
            />

            <label
              htmlFor="product-images"
              className="inline-block mt-2 cursor-pointer dark:bg-gray-800 dark:text-white px-4 py-2 rounded dark:hover:bg-gray-700 text-pink-500"
            >
              Select Images
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-black dark:text-gray-300">
              Product Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full dark:bg-gray-800 dark:text-white rounded px-3 py-2"
              placeholder="e.g. Chicken Burger"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-black dark:text-gray-300">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full dark:bg-gray-800 dark:text-white rounded px-3 py-2"
            />
          </div>

          {/* Price, Cost & Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-black dark:text-gray-300">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 w-full dark:bg-gray-800 dark:text-white rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm text-black dark:text-gray-300">
                Cost <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={cost}
                onChange={(e) =>
                  setCost(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="mt-1 w-full dark:bg-gray-800 dark:text-white rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="text-sm text-black dark:text-gray-300">
                Stock
              </label>
              <input
                type="number"
                value={stock}
                min={0}
                step={1}
                onChange={(e) => {
                  const value = e.target.value;
                  setStock(value === "" ? 0 : Math.floor(Number(value)));
                }}
                className="mt-1 w-full dark:bg-gray-800 dark:text-white rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-black dark:text-gray-300">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full dark:bg-gray-800 dark:text-white rounded px-3 py-2"
            >
              <option value="">Select category</option>
              {categories
                .filter((cat) => cat.id !== "all")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-pink-500 dark:bg-pink-300 text-black dark:hover:bg-pink-400 hover:bg-pink-400 mt-4"
        >
          {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </>
  );
}
