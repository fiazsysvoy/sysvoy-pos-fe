import { Card } from "@/components/ui/card"
import {
  Pizza,
  Beef,
  Drumstick,
  Cake,
  Coffee,
  Fish,
  Grid2X2
} from "lucide-react"

const categories = [
  { title: "All", count: "116 items", icon: Grid2X2, active: true },
  { title: "Pizza", count: "20 items", icon: Pizza },
  { title: "Burger", count: "15 items", icon: Beef },
  { title: "Chicken", count: "10 items", icon: Drumstick },
  { title: "Bakery", count: "18 items", icon: Cake },
  { title: "Beverage", count: "12 items", icon: Coffee },
  { title: "Seafood", count: "16 items", icon: Fish },
]

export default function CategoryCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {categories.map((cat) => (
        <Card
          key={cat.title}
          className={`p-4 flex flex-col items-start gap-3 cursor-pointer border-none
            ${cat.active ? "bg-pink-200 text-black" : "bg-zinc-800 text-white"}
          `}
        >
          <cat.icon className="h-6 w-6" />
          <div>
            <p className="font-medium">{cat.title}</p>
            <p className="text-sm opacity-70">{cat.count}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
