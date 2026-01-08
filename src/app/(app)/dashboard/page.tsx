import ChartCard from "@/app-components/chartCard"
import { OverviewChart } from "@/app-components/LineGraph"
import ItemCard from "@/app-components/ItemCard"
const Dollar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
        <path fill="#000000" d="M16 1.466C7.973 1.466 1.466 7.973 1.466 16c0 8.027 6.507 14.534 14.534 14.534c8.027 0 14.534-6.507 14.534-14.534c0-8.027-6.507-14.534-14.534-14.534zm1.255 22.414v2.047h-1.958v-2.024c-3.213-.44-4.62-3.08-4.62-3.08l2-1.673s1.277 2.223 3.587 2.223c1.276 0 2.244-.683 2.244-1.85c0-2.728-7.35-2.397-7.35-7.458c0-2.2 1.74-3.785 4.138-4.16V5.86h1.958v2.045c1.672.22 3.652 1.1 3.652 2.993v1.452H18.31v-.704c0-.726-.925-1.21-1.96-1.21c-1.32 0-2.287.66-2.287 1.584c0 2.794 7.35 2.112 7.35 7.415c0 2.18-1.628 4.07-4.158 4.445z"></path>
    </svg>
)
const DashBoard = () => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                <ChartCard title="Revenue" revenue={1000} data={[1, 2, 3]} date="2023-01-01" icon={Dollar} />
                <ChartCard title="Revenue" revenue={1000} data={[1, 2, 3]} date="2023-01-01" icon={Dollar} />
                <ChartCard title="Revenue" revenue={1000} data={[1, 2, 3]} date="2023-01-01" icon={Dollar} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <ItemCard CardTitle="Recent Orders" buttonText="View All" path="/orders" Items={[{title:"Item #1234",description:"Description for order #1234", price:"$20", status:"Shipped"},{title:"Order #5678",description:"Description for order #5678", price:"$30", status:"Pending"},{title:"Order #9101",description:"Description for order #9101", price:"$40", status:"Delivered"}]} />
                <ItemCard CardTitle="Recent Products" buttonText="View All" path="/products" Items={[{title:"Item #1234",description:"Description for product #1234", price:"$50", status:"In Stock"},{title:"Item #5678",description:"Description for product #5678", price:"$60", status:"Out of Stock"},{title:"Item #9101",description:"Description for product #9101", price:"$70", status:"In Stock"}]} />
            </div>
            <div className="p-6">
                <OverviewChart />
            </div>
        </>
    )
}


export default DashBoard