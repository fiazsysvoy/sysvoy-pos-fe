import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const items = Array.from({ length: 6 })

export default function MenuTable() {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-9 px-4 py-3 text-sm text-zinc-400">
        <span></span>
        <span>Product</span>
        <span className="col-span-2">Product Name</span>
        <span>Item ID</span>
        <span>Stock</span>
        <span>Category</span>
        <span>Price</span>
        <span>Availability</span>
      </div>

      {/* Rows */}
      {items.map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-9 items-center px-4 py-4 border-t border-white/5 hover:bg-white/5"
        >
          <Checkbox />

          <Image
            src="https://unsplash.com/60"
            alt="food"
            width={50}
            height={50}
            className="rounded-md"
          />

          <div className="col-span-2">
            <p className="font-medium">Chicken Parmesan</p>
            <p className="text-sm text-zinc-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing.
            </p>
          </div>

          <span>#2234644</span>
          <span>119 items</span>
          <span>Chicken</span>
          <span>$55.00</span>

          <div className="flex items-center justify-between">
            <span className="text-green-400 text-sm">In Stock</span>
            <div className="flex gap-3">
              <Pencil className="h-4 w-4 cursor-pointer" />
              <Trash2 className="h-4 w-4 text-red-500 cursor-pointer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
