"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

interface Category {
    id: string
    name: string
}

export default function AddProductSidebar({
    onClose,
    categories,
}: {
    onClose: () => void
    categories: Category[]
}) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState<number | "">("")
    const [stock, setStock] = useState<number | "">("")
    const [categoryId, setCategoryId] = useState("")
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    // Handle multiple image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return

        setImages((prev) => [...prev, ...files])
        setPreviews((prev) => [
            ...prev,
            ...files.map((file) => URL.createObjectURL(file)),
        ])

        // reset input so same file can be re-selected
        e.target.value = ""
    }


    const handleSubmit = async () => {
        if (!name || !price || !stock || !categoryId || images.length === 0) {
            toast.error("Please fill all required fields")
            return
        }

        const formData = new FormData()
        formData.append("name", name)
        formData.append("description", description)
        formData.append("price", String(price))
        formData.append("stock", String(stock))
        formData.append("categoryId", categoryId)

        images.forEach((img) => {
            formData.append("prodImages", img)
        })

        try {
            setLoading(true)
            const apiUrl = process.env.NEXT_PUBLIC_API_URL
            const token = localStorage.getItem("token")

            await axios.post(`${apiUrl}api/products`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })

            toast.success("Product added successfully!")
            onClose()
        } catch (err: unknown) {
            let message = "Failed to add product"

            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || message
            }

            toast.error(message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setPreviews((prev) => prev.filter((_, i) => i !== index))
    }


    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

            {/* Sidebar */}
            <div className="fixed top-0 right-0 h-full w-[420px] bg-[#0f0f0f] z-50 p-6 flex flex-col px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Add New Product</h2>
                    <button onClick={onClose}>
                        <X className="text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                    {/* Images */}
                    <div>
                        <label className="text-sm text-gray-300">Product Images</label>

                        <div className="mt-2 flex flex-wrap gap-3">
                            {previews.map((src, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={src}
                                        className="h-36 w-36 rounded object-cover border border-gray-600"
                                        alt="preview"
                                    />

                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            {!previews.length && (
                                <div className="h-36 w-36 bg-gray-700 flex items-center justify-center text-gray-400 rounded">
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
                            className="inline-block mt-2 cursor-pointer bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Select Images
                        </label>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="text-sm text-gray-300 ">Product Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full bg-gray-800 text-white rounded px-3 py-2"
                            placeholder="e.g. Chicken Burger"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-gray-300">Description</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 w-full bg-gray-800 text-white rounded px-3 py-2"
                        />
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-300">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="mt-1 w-full bg-gray-800 text-white rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">Stock</label>
                            <input
                                type="number"
                                value={stock}
                                min={0}
                                step={1}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "") return setStock(0);

                                    setStock(Math.floor(Number(value)));
                                }}
                                className="mt-1 w-full bg-gray-800 text-white rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm text-gray-300">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="mt-1 w-full bg-gray-800 text-white rounded px-3 py-2"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
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
                    className="bg-pink-300 text-black hover:bg-pink-400 mt-4"
                >
                    {loading ? "Saving..." : "Add Product"}
                </Button>
            </div>
        </>
    )
}
