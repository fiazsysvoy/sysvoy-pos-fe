'use client'

import ChartCard from "@/app-components/chartCard"
import { OverviewChart } from "@/app-components/LineGraph"
import ItemCard from "@/app-components/ItemCard"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { toast } from "sonner"
const Dollar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
        <path fill="#000000" d="M16 1.466C7.973 1.466 1.466 7.973 1.466 16c0 8.027 6.507 14.534 14.534 14.534c8.027 0 14.534-6.507 14.534-14.534c0-8.027-6.507-14.534-14.534-14.534zm1.255 22.414v2.047h-1.958v-2.024c-3.213-.44-4.62-3.08-4.62-3.08l2-1.673s1.277 2.223 3.587 2.223c1.276 0 2.244-.683 2.244-1.85c0-2.728-7.35-2.397-7.35-7.458c0-2.2 1.74-3.785 4.138-4.16V5.86h1.958v2.045c1.672.22 3.652 1.1 3.652 2.993v1.452H18.31v-.704c0-.726-.925-1.21-1.96-1.21c-1.32 0-2.287.66-2.287 1.584c0 2.794 7.35 2.112 7.35 7.415c0 2.18-1.628 4.07-4.158 4.445z"></path>
    </svg>
)
const DashBoard = () => {
    const [ordersData, setOrdersData] = useState([]);
    const [productsData, setProductsData] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/orders?pageSize=3');
            const resData = res.data.data.data;
            const orders = resData.map((order: any) => {
                return {
                    title: order.name,
                    description: `Total items: ${order.items.length.toString()}`,
                    price: order.totalAmount,
                    status: order.status
                }
            })
            setOrdersData(orders);
        } catch (err: any) {
            toast.error(err.message || "Something went wrong fetching orders.")
        }
    }

    const fetchProducts = async () => {
        try {
            const res = await api.get('/api/products?pageSize=3');
            const resData = res.data.data;
            const products = resData.map((product: any) => {
                return {
                    title: product.name,
                    description: product.category.name,
                    price: product.price,
                    status: product.stock > 0 ? "In Stock" : "Out of Stock"
                }
            })
            setProductsData(products);
        } catch (err: any) {
            toast.error(err.message || "Something went wrong fetching orders.")
        }
    }
    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, [])

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                <ChartCard title="Revenue" revenue={1000} data={[1, 2, 3]} date="2023-01-01" icon={Dollar} />
                <ChartCard title="Revenue" revenue={1000} data={[1, 2, 3]} date="2023-01-01" icon={Dollar} />
                <ChartCard title="Revenue" revenue={1000} data={[1, 2, 3]} date="2023-01-01" icon={Dollar} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <ItemCard
                    CardTitle="Recent Orders"
                    buttonText="View All"
                    path="/orders"
                    Items={ordersData}
                />
                <ItemCard CardTitle="Recent Products" buttonText="View All" path="/products"
                    Items={productsData}
                />
            </div>
            <div className="p-6">
                <OverviewChart />
            </div>
        </>
    )
}


export default DashBoard