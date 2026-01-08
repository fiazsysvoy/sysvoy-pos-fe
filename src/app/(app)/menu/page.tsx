"use client"


import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CategoryCards from "@/app-components/category-cards"
import MenuTabs from "@/app-components/menu-tabs"
import MenuTable from "@/app-components/menu-table"

export default function MenuPage() {
  return (
    <div className="p-6 space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Button className="bg-pink-300 text-black hover:bg-pink-400">
          Add New Category
        </Button>
      </div>

      {/* Categories */}
      <CategoryCards />

      <Separator className="bg-white/10" />

      {/* Menu Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Special menu all items</h2>
        <Button className="bg-pink-300 text-black hover:bg-pink-400">
          Add Menu Item
        </Button>
      </div>

      {/* Tabs */}
      <MenuTabs />

      {/* Table */}
      <MenuTable />
    </div>
  )
}
