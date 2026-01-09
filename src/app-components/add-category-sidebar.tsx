"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export default function AddCategorySidebar({
    onClose,
    onSuccess,
}: {
    onClose: () => void,
    onSuccess: () => void
}) {
    const [categoryName, setCategoryName] = useState("")
    const [description, setDescription] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith("image/")) {
            setImageFile(file)
            setPreview(URL.createObjectURL(file))
        } else { 
            alert("Please select a valid image file")
        }
    }

    // Handle form submit
    const handleSubmit = async () => {
        if (!categoryName || !imageFile) {
            alert("Please fill all fields and select an image")
            return
        }

        const formData = new FormData()
        formData.append("name", categoryName)
        formData.append("description", description || "")
        formData.append("image", imageFile)

        try {
            setLoading(true)
            console.log(formData)
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const token = localStorage.getItem('token');
            const res = await axios.post(`${apiUrl}api/categories`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
            })
            toast.success("Category added!", {
                duration: 4000, // 4 seconds
            })
            onSuccess(); // fetch the updated categories
            onClose() // close sidebar
        } catch (err: unknown) {
            let message = "Failed to add new category!"

            if (axios.isAxiosError(err)) {
                // AxiosError type
                message = err.response?.data?.message || message
            }

            toast.error(message, {
                duration: 4000,
            })

            console.error(err)
            //   alert("Failed to add category")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed top-0 right-0 h-full w-[400px] bg-zinc-200 dark:bg-[#0f0f0f] z-50 p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold dark:text-white text-black">
                        Add New Category
                    </h2>
                    <button onClick={onClose}>
                        <X className="text-black dark:text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4 flex-1 overflow-auto">
                    {/* Image Picker */}
                    <div>
                        <label className="text-sm text-black dark:text-gray-300">Category Icon</label>
                        <div className="mt-2 flex flex-col items-start gap-3">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-36 w-36 rounded object-contain border border-gray-500"
                                />
                            ) : (
                                <div className="h-36 w-36 bg-zinc-400  dark:bg-gray-700 flex items-center justify-center dark:text-gray-400 rounded">
                                    No Icon
                                </div>
                            )}
                            {/* Hidden file input */}
                            <input
                                id="category-icon"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {/* Custom button/label */}
                            <label
                                htmlFor="category-icon"
                                className="inline-block mt-2 cursor-pointer
                                dark:bg-gray-800 dark:text-white px-4 py-2 
                                rounded dark:hover:bg-gray-700
                                text-pink-500"
                            >
                                {imageFile ? "Change Icon" : "Select Icon"}
                            </label>

                            {/* Show selected file name */}
                            {imageFile && (
                                <span className="text-sm text-gray-300">{imageFile.name}</span>
                            )}
                        </div>

                    </div>

                    {/* Category Name */}
                    <div>
                        <label className="text-sm dark:text-gray-300">Category Name</label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="mt-1 w-full rounded dark:bg-gray-800 px-3 py-2 dark:text-white outline-none"
                            placeholder="e.g. Burgers"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-black dark:text-gray-300">Description</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 w-full rounded dark:bg-gray-800 px-3 py-2 dark:text-white outline-none"
                            placeholder="Short description"
                        />
                    </div>
                </div>

                {/* Footer */}
                <Button
                    className="bg-pink-500 dark:bg-pink-300 text-black dark:hover:bg-pink-400 hover:bg-pink-400 mt-4"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Add Category"}
                </Button>
            </div>
        </>
    )
}
