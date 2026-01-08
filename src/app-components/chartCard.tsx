import { ComponentType, ReactNode, SVGProps } from "react";
import CustomChart from "./statsChart";
import { Card } from "@/components/ui/card";
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]
const ChartCard = ({ title, revenue, data, date, icon: Icon }: { title: string; revenue: number; data: any; date: string, icon: ComponentType<SVGProps<SVGSVGElement>> }) => {
    return (
        <Card className="p-4 pb-0 shadow-md bg-card w-full ">
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg text-card-foreground font-semibold">{title}</h3>
                    <p className="text-lg text-card-foreground/70 font-semibold">{`$${revenue}`}</p>
                </div>
                <div className="w-8 h-8 bg-chart-accent rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-sidebar-accent-foreground" />
                </div>

            </div>
            <div className="flex items-end justify-between gap-4">
            <p className="text-sm text-white font-medium pb-2">{date}</p>
            {/* <div className="flex-1 min-w-0"> */}
            <CustomChart data={chartData} />
            {/* </div> */}
            </div>


        </Card>
    )
}
export default ChartCard;