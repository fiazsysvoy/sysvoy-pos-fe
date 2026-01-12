"use client";

import { Card } from "@/components/ui/card";
import {
  Pizza,
  Beef,
  Drumstick,
  Cake,
  Coffee,
  Fish,
  Grid2X2,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
  itemsCount?: number;
  imageUrl?: string;
}

const iconMap: Record<string, any> = {
  Pizza: Pizza,
  Burger: Beef,
  Chicken: Drumstick,
  Bakery: Cake,
  Beverage: Coffee,
  Seafood: Fish,
  All: Grid2X2,
};

interface Props {
  categories: Category[];
  loading: boolean;
  onSelect: (category: Category) => void; // for opening sidebar for edit
}
export default function CategoryCards({ categories, loading, onSelect }: Props) {

  return (
    <div className=" overflow-hidden">
      <div className="flex gap-4 overflow-x-auto scrollbar-none px-2">
        {loading ? (
          <p className="text-white">Loading categories...</p>
        ) : (
          categories.length === 0 ? <div>No category to show</div> :
            categories.map((cat) => {
              const Icon = iconMap[cat.name] || Grid2X2;
              return (
                <Card
                  key={cat.id}
                  onClick={cat.name === 'All' ? () => { } : () => onSelect(cat)}
                  className={`flex-shrink-0 w-32 p-4 flex flex-col items-start gap-3 cursor-pointer border-none
                    ${cat.name === "All" ? "bg-pink-200 text-black" : "bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white"}
                  `}
                >
                  <div className="h-16 w-16 flex items-center">
                    {cat.name === "All" ? (
                      <Icon className="h-10 w-10 self-start" />
                    ) : (
                      <img src={cat.imageUrl} alt="img" className="h-12 w-12 object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium truncate w-28" title={cat.name}>
                      {cat.name}
                    </p>
                    <p className="text-sm opacity-70">{cat.itemsCount} items</p>
                  </div>
                </Card>
              );
            })
        )}
      </div>
    </div>

  );
}
