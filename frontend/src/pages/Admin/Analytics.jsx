import {
  Users,
  Home,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { fetchAdminAnalytics } from "../../api/admin";

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 58000 },
  { month: "Mar", revenue: 64000 },
  { month: "Apr", revenue: 72000 },
  { month: "May", revenue: 91000 },
  { month: "Jun", revenue: 125000 },
];

const bookingData = [
  { month: "Jan", bookings: 180 },
  { month: "Feb", bookings: 220 },
  { month: "Mar", bookings: 270 },
  { month: "Apr", bookings: 320 },
  { month: "May", bookings: 410 },
  { month: "Jun", bookings: 540 },
];

const usersData = [
  { name: "Guests", value: 72 },
  { name: "Hosts", value: 22 },
  { name: "Admins", value: 6 },
];

const COLORS = ["#f43f5e", "#fb7185", "#fecdd3"];

const topProperties = [
  {
    id: 1,
    name: "Luxury Villa Goa",
    bookings: 142,
    revenue: "₹6.4L",
  },
  {
    id: 2,
    name: "Mountain Cabin Manali",
    bookings: 118,
    revenue: "₹4.9L",
  },
  {
    id: 3,
    name: "Mumbai Skyline Apartment",
    bookings: 104,
    revenue: "₹4.3L",
  },
];

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data from API
  const fetchAnalytics = async () => {
    try {
      // In a real app, you would get the clerkId from auth context
      // For now, we'll use a placeholder or get it from localStorage/session
      const clerkId = localStorage.getItem('clerkId') || 'placeholder';
      
      if (clerkId && clerkId !== 'placeholder') {
        const data = await fetchAdminAnalytics(clerkId);
        setAnalyticsData(data);
        setError(null);
      } else {
        // If we don't have a clerkId, use mock data for now
        setAnalyticsData(getMockAnalyticsData());
        setError("Unable to load analytics: User not authenticated");
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
      // Fall back to mock data on error
      setAnalyticsData(getMockAnalyticsData());
      setError("Failed to load analytics. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAnalytics();
    
    // Set up polling for real-time updates (every 30 seconds for analytics)
    const intervalId = setInterval(fetchAnalytics, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Mock data function for fallback
  const getMockAnalyticsData = () => ({
    revenueData: [
      { month: "Jan", revenue: 42000 },
      { month: "Feb", revenue: 58000 },
      { month: "Mar", revenue: 64000 },
      { month: "Apr", revenue: 72000 },
      { month: "May", revenue: 91000 },
      { month: "Jun", revenue: 125000 },
    ],
    bookingData: [
      { month: "Jan", bookings: 180 },
      { month: "Feb", bookings: 220 },
      { month: "Mar", bookings: 270 },
      { month: "Apr", bookings: 320 },
      { month: "May", bookings: 410 },
      { month: "Jun", bookings: 540 },
    ],
    usersData: [
      { name: "Guests", value: 72 },
      { name: "Hosts", value: 22 },
      { name: "Admins", value: 6 },
    ],
    topProperties: [
      {
        id: 1,
        name: "Luxury Villa Goa",
        bookings: 142,
        revenue: "₹6.4L",
      },
      {
        id: 2,
        name: "Mountain Cabin Manali",
        bookings: 118,
        revenue: "₹4.9L",
      },
      {
        id: 3,
        name: "Mumbai Skyline Apartment",
        bookings: 104,
        revenue: "₹4.3L",
      },
    ],
    stats: {
      revenue: "₹8.4L",
      revenueChange: "+18.6%",
      bookings: "1,248",
      bookingsChange: "+12.3%",
      users: "4,842",
      usersChange: "+8.9%",
      properties: "624",
      propertiesChange: "-1.4%",
    },
    miniMetrics: [
      { title: "Conversion Rate", value: "12.4%" },
      { title: "Average Booking", value: "₹6,820" },
      { title: "Avg Stay", value: "4.8 Days" },
      { title: "Occupancy", value: "78%" },
    ],
  });

  // Use real data if available, otherwise use mock data
  const data = analyticsData || getMockAnalyticsData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Analytics</h1>

        <p className="mt-1 text-gray-500">
          Platform performance, revenue, users, bookings and growth insights.
        </p>
      </div>

       <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
         <StatCard
           title="Revenue"
           value={data.stats.revenue}
           change={data.stats.revenueChange}
           positive={data.stats.revenueChange.startsWith('+')}
           icon={IndianRupee}
         />

         <StatCard
           title="Bookings"
           value={data.stats.bookings}
           change={data.stats.bookingsChange}
           positive={data.stats.bookingsChange.startsWith('+')}
           icon={CalendarCheck}
         />

         <StatCard
           title="Users"
           value={data.stats.users}
           change={data.stats.usersChange}
           positive={data.stats.usersChange.startsWith('+')}
           icon={Users}
         />

         <StatCard
           title="Properties"
           value={data.stats.properties}
           change={data.stats.propertiesChange}
           positive={data.stats.propertiesChange.startsWith('+')}
           icon={Home}
         />
       </div>

       <div className="grid gap-6 xl:grid-cols-3">
         <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
           <div className="mb-6">
             <h2 className="text-xl font-black">Revenue Growth</h2>

             <p className="text-sm text-gray-500">Monthly platform revenue</p>
           </div>

           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data.revenueData}>
                 <XAxis dataKey="month" />
                 <YAxis />
                 <Tooltip />

                 <Area
                   type="monotone"
                   dataKey="revenue"
                   stroke="#f43f5e"
                   fill="#ffe4e6"
                   strokeWidth={3}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
         </div>

         <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
           <h2 className="text-xl font-black">User Distribution</h2>

           <div className="mt-8 h-72">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={data.usersData} dataKey="value" outerRadius={100}>
                   {data.usersData.map((_, index) => (
                     <Cell key={index} fill={COLORS[index]} />
                   ))}
                 </Pie>

                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>

           <div className="space-y-3">
             {data.usersData.map((item, index) => (
               <div
                 key={item.name}
                 className="flex items-center justify-between"
               >
                 <div className="flex items-center gap-3">
                   <div
                     className="h-3 w-3 rounded-full"
                     style={{
                       backgroundColor: COLORS[index],
                     }}
                   />

                   <span className="font-semibold">{item.name}</span>
                 </div>

                 <span className="font-black">{item.value}%</span>
               </div>
             ))}
           </div>
         </div>
       </div>

       <div className="grid gap-6 xl:grid-cols-2">
         <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
           <div className="mb-6">
             <h2 className="text-xl font-black">Booking Growth</h2>

             <p className="text-sm text-gray-500">Monthly reservations</p>
           </div>

           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.bookingData}>
                 <XAxis dataKey="month" />
                 <YAxis />
                 <Tooltip />

                 <Bar dataKey="bookings" fill="#f43f5e" radius={[8, 8, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>

         <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
           <div className="mb-6">
             <h2 className="text-xl font-black">Top Performing Properties</h2>

             <p className="text-sm text-gray-500">
               Highest revenue generating listings
             </p>
           </div>

           <div className="space-y-4">
             {data.topProperties.map((property, index) => (
               <div
                 key={property.id}
                 className="flex items-center justify-between rounded-2xl bg-gray-50 p-4"
               >
                 <div>
                   <p className="font-black">
                     #{index + 1} {property.name}
                   </p>

                   <p className="text-sm text-gray-500">
                     {property.bookings} bookings
                   </p>
                 </div>

                 <p className="text-lg font-black text-rose-500">
                   {property.revenue}
                 </p>
               </div>
             ))}
           </div>
         </div>
       </div>

       <div className="grid gap-5 md:grid-cols-4">
         {data.miniMetrics.map((metric, index) => (
           <MiniMetric
             key={index}
             title={metric.title}
             value={metric.value}
           />
         ))}
       </div>
     </div>
   );
 }

function StatCard({ title, value, change, positive, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-black">{value}</h2>

          <div
            className={`mt-3 flex items-center gap-1 text-sm font-bold ${
              positive ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}

            {change}
          </div>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ title, value }) {
  return (
    <div className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-500">{title}</p>

      <h3 className="mt-2 text-2xl font-black">{value}</h3>
    </div>
  );
}
