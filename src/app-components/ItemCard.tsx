"use client"
import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import globe from '../../public/globe.svg';

interface Props {
    CardTitle: string,
    buttonText: string,
    path: string,
    Items: Array<{ title: string, description: string, price: string, status: string }>
}

const ItemCard = (
    { CardTitle, buttonText, path, Items }: Props) => {
    const router = useRouter()
    return (
        <Card className="grid grid-rows-[auto_1fr] gap-6 p-6 w-full shadow-md bg-card">
            <CardHeader className="flex justify-between items-center flex-row">
                <h2 className="text-card-foreground font-medium">{CardTitle}</h2>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => { router.push(path) }}>{buttonText}</Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 self-start">
                {Items.map((item, index) => (
                    <Item key={index} variant="outline" className="bg-transparent">
                        <ItemContent className="flex flex-row">
                            <Image src={globe} alt="image" width={40} height={40} className="rounded-md mr-4" />
                            <div>
                                <ItemTitle className="text-card-foreground">{item.title}</ItemTitle>
                                <ItemDescription className="text-card-foreground/70">
                                    {item.description}
                                </ItemDescription>
                            </div>
                        </ItemContent>
                        <ItemActions className="flex flex-col gap-2 text-sm">
                            <ItemDescription className="text-card-foreground/80">
                                ${item.price}
                            </ItemDescription>
                            <ItemDescription className="text-card-foreground/60">
                                {item.status}
                            </ItemDescription>
                        </ItemActions>
                    </Item>
                ))}
            </CardContent>
        </Card>
    )
};

export default ItemCard;