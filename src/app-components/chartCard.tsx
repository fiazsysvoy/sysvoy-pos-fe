import { ComponentType, ReactNode, SVGProps } from "react";
import CustomChart from "./statsChart";
import { Card } from "@/components/ui/card";

const ChartCard = ({ title, revenue, data, date, icon: Icon }: { title: string; revenue: number; data: any; date: string, icon: ComponentType<SVGProps<SVGSVGElement>> }) => {
    // Format revenue to 2 decimal places
    const formattedRevenue = revenue.toFixed(2);
    
    return (
        <Card className="p-6 shadow-md bg-card w-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-base text-card-foreground/70 font-medium">{title}</h3>
                    <p className="text-2xl text-card-foreground font-bold">{`$${formattedRevenue}`}</p>
                    <p className="text-xs text-card-foreground/60 mt-1">{date}</p>
                </div>
                <div className="w-10 h-10 bg-chart-accent rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-sidebar-accent-foreground" />
                </div>
            </div>
            <div className="mt-6 -mx-2">
                <CustomChart data={data || []} />
            </div>
        </Card>
    )
}
export default ChartCard;