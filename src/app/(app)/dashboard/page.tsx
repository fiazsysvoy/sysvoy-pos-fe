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
    const [revenueStats, setRevenueStats] = useState({
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        todayData: [] as Array<{ time: string; revenue: number }>,
        weekData: [] as Array<{ date: string; revenue: number }>,
        monthData: [] as Array<{ date: string; revenue: number; week?: number }>
    });

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

    const fetchRevenueStats = async () => {
        try {
            const res = await api.get('/api/orders/stats/revenue');
            setRevenueStats(res.data.data);
        } catch (err: any) {
            toast.error(err.message || "Something went wrong fetching revenue stats.")
        }
    }

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        fetchRevenueStats();
    }, [])

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    const todayFormatted = formatDate(today);

    // Get start of week date (Monday)
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday (0) to 6 days back
    startOfWeek.setDate(now.getDate() - daysToMonday);
    const weekStartFormatted = formatDate(startOfWeek.toISOString().split('T')[0]);

    // Get start of month date (first day of current month)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Format directly without timezone conversion to avoid date shifts
    const monthStartFormatted = startOfMonth.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });

    // Prepare chart data for today (hourly) - format time labels
    const prepareTodayChartData = (hourlyData: Array<{ time: string; revenue: number }>) => {
        return hourlyData.map(item => {
            // Format time to be more readable (e.g., "09:00" -> "9 AM" or just "9")
            const hour = parseInt(item.time.split(':')[0]);
            const label = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
            return {
                time: label,
                revenue: item.revenue
            };
        });
    };

    // Prepare chart data for week (daily) - shorter labels
    const prepareWeekChartData = (dailyData: Array<{ date: string; revenue: number }>) => {
        return dailyData.map(item => {
            const date = new Date(item.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();
            return {
                date: `${dayName} ${dayNum}`,
                revenue: item.revenue
            };
        });
    };

    // Prepare chart data for month (weekly) - W1, W2, W3, W4 format
    const prepareMonthChartData = (weeklyData: Array<{ date: string; revenue: number; week?: number }>) => {
        return weeklyData.map(item => {
            // If date is already in W1, W2 format, use it directly
            if (item.date.startsWith('W')) {
                return {
                    date: item.date,
                    revenue: item.revenue
                };
            }
            // Fallback for old format
            const date = new Date(item.date);
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const dayNum = date.getDate();
            return {
                date: `${month} ${dayNum}`,
                revenue: item.revenue
            };
        });
    };

    const todayChartData = prepareTodayChartData(revenueStats.todayData);
    const weekChartData = prepareWeekChartData(revenueStats.weekData);
    const monthChartData = prepareMonthChartData(revenueStats.monthData);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                <ChartCard 
                    title="Today's Revenue" 
                    revenue={revenueStats.today} 
                    data={todayChartData} 
                    date={todayFormatted} 
                    icon={Dollar} 
                />
                <ChartCard 
                    title="This Week's Revenue" 
                    revenue={revenueStats.thisWeek} 
                    data={weekChartData} 
                    date={`${weekStartFormatted} - ${todayFormatted}`} 
                    icon={Dollar} 
                />
                <ChartCard 
                    title="This Month's Revenue" 
                    revenue={revenueStats.thisMonth} 
                    data={monthChartData} 
                    date={monthStartFormatted} 
                    icon={Dollar} 
                />
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