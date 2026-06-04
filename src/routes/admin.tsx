import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ListChecks,
  Bell,
  Settings,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  CalendarClock,
  Sparkles,
  MoreHorizontal,
  CircleDot,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — KKK Cleaning Services" },
      { name: "description", content: "Internal admin dashboard for managing bookings, customers, and analytics." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { title: "Bookings", icon: CalendarDays, key: "bookings" },
  { title: "Customers", icon: Users, key: "customers" },
  { title: "Schedule", icon: CalendarClock, key: "schedule" },
  { title: "Services", icon: ListChecks, key: "services" },
  { title: "Notifications", icon: Bell, key: "notifications" },
  { title: "Settings", icon: Settings, key: "settings" },
] as const;

function AdminPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <main className="flex-1 p-4 md:p-6 space-y-6">
            <StatsRow />
            <ChartsRow />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <BookingsTable />
                <ServiceTracker />
              </div>
              <div className="space-y-6">
                <Notifications />
                <Schedule />
              </div>
            </div>
            <CustomersTable />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const [active, setActive] = useState<string>("dashboard");
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-cyan-400 grid place-items-center text-primary-foreground font-bold">
            K
          </div>
          <div className="leading-tight group-data-[collapsible=icon]:hidden">
            <div className="font-bold text-sm">KKK Cleaning</div>
            <div className="text-[10px] text-muted-foreground">Admin Panel</div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={active === item.key}
                    onClick={() => setActive(item.key)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback>
          </Avatar>
          <div className="leading-tight group-data-[collapsible=icon]:hidden">
            <div className="text-xs font-semibold">Admin User</div>
            <div className="text-[10px] text-muted-foreground">admin@kkk.ph</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-10 h-16 flex items-center gap-3 border-b bg-background/80 backdrop-blur px-4 md:px-6">
      <SidebarTrigger />
      <div className="hidden md:block">
        <h1 className="text-base font-semibold">Dashboard Overview</h1>
        <p className="text-xs text-muted-foreground">Welcome back, here's what's happening today.</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search bookings…" className="pl-8 w-64" />
        </div>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground grid place-items-center">3</span>
        </Button>
        <Button asChild size="sm">
          <Link to="/book">New Booking</Link>
        </Button>
      </div>
    </header>
  );
}

const stats = [
  { label: "Total Bookings", value: "1,284", change: "+12.4%", icon: CalendarDays, tone: "text-primary" },
  { label: "Pending Services", value: "38", change: "+3 today", icon: Clock, tone: "text-amber-600" },
  { label: "Completed Services", value: "1,176", change: "+8.1%", icon: CheckCircle2, tone: "text-emerald-600" },
  { label: "Revenue Overview", value: "₱842,500", change: "+18.2%", icon: DollarSign, tone: "text-cyan-600" },
];

function StatsRow() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight">{s.value}</p>
                <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {s.change}
                </p>
              </div>
              <div className={`h-10 w-10 rounded-lg bg-muted grid place-items-center ${s.tone}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const revenueData = [
  { m: "Jan", revenue: 42000, bookings: 78 },
  { m: "Feb", revenue: 51000, bookings: 92 },
  { m: "Mar", revenue: 47000, bookings: 88 },
  { m: "Apr", revenue: 62000, bookings: 110 },
  { m: "May", revenue: 71000, bookings: 124 },
  { m: "Jun", revenue: 84000, bookings: 142 },
  { m: "Jul", revenue: 93000, bookings: 156 },
];

const serviceData = [
  { name: "Sofa", value: 320 },
  { name: "Mattress", value: 410 },
  { name: "Rug", value: 245 },
  { name: "Deep Clean", value: 180 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--primary)" },
  bookings: { label: "Bookings", color: "var(--primary)" },
  value: { label: "Sessions", color: "var(--primary)" },
} satisfies ChartConfig;

function ChartsRow() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trend</CardDescription>
          </div>
          <Tabs defaultValue="6m">
            <TabsList>
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="6m">6M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <AreaChart data={revenueData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="m" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#fillRev)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sessions by Service</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={serviceData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

type Status = "Pending" | "Ongoing" | "Completed" | "Cancelled";
const statusStyle: Record<Status, string> = {
  Pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Ongoing: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Completed: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Cancelled: "bg-rose-100 text-rose-700 hover:bg-rose-100",
};

const bookings: { id: string; customer: string; service: string; date: string; amount: string; status: Status }[] = [
  { id: "BK-1042", customer: "Maria Santos", service: "Sofa Deep Cleaning", date: "May 28, 10:00", amount: "₱1,200", status: "Ongoing" },
  { id: "BK-1041", customer: "Daniel Cruz", service: "Mattress Sanitization", date: "May 28, 13:00", amount: "₱1,500", status: "Pending" },
  { id: "BK-1040", customer: "Ana Reyes", service: "Full Deep Clean", date: "May 27, 09:00", amount: "₱3,500", status: "Completed" },
  { id: "BK-1039", customer: "Jose Mendoza", service: "Rug Cleaning", date: "May 27, 15:00", amount: "₱900", status: "Completed" },
  { id: "BK-1038", customer: "Liza Pangan", service: "Sofa Deep Cleaning", date: "May 26, 11:00", amount: "₱1,200", status: "Cancelled" },
  { id: "BK-1037", customer: "Mark Aquino", service: "Mattress Sanitization", date: "May 26, 14:00", amount: "₱1,500", status: "Completed" },
];

function BookingsTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Manage and track all incoming bookings</CardDescription>
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Service</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.id}</TableCell>
                <TableCell className="font-medium">{b.customer}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{b.service}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{b.date}</TableCell>
                <TableCell className="font-semibold">{b.amount}</TableCell>
                <TableCell>
                  <Badge className={statusStyle[b.status]} variant="secondary">{b.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const tracker: { id: string; customer: string; service: string; progress: number; status: Status }[] = [
  { id: "BK-1042", customer: "Maria Santos", service: "Sofa Deep Cleaning", progress: 65, status: "Ongoing" },
  { id: "BK-1041", customer: "Daniel Cruz", service: "Mattress Sanitization", progress: 10, status: "Pending" },
  { id: "BK-1036", customer: "Rico Tan", service: "Rug Cleaning", progress: 100, status: "Completed" },
];

function ServiceTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Status Tracker</CardTitle>
        <CardDescription>Live progress of today's services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tracker.map((t) => (
          <div key={t.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{t.customer}</span>
                  <Badge className={statusStyle[t.status]} variant="secondary">{t.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{t.service} • {t.id}</p>
              </div>
              <span className="text-sm font-semibold tabular-nums">{t.progress}%</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all"
                style={{ width: `${t.progress}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const notifications = [
  { icon: Sparkles, text: "New booking from Maria Santos", time: "2m ago", tone: "text-primary" },
  { icon: CheckCircle2, text: "BK-1040 marked as completed", time: "1h ago", tone: "text-emerald-600" },
  { icon: Clock, text: "Upcoming service in 30 minutes", time: "2h ago", tone: "text-amber-600" },
  { icon: Bell, text: "Daniel Cruz left a 5-star review", time: "5h ago", tone: "text-cyan-600" },
];

function Notifications() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Latest activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm">View all</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/60 transition-colors">
            <div className={`h-8 w-8 rounded-full bg-muted grid place-items-center ${n.tone}`}>
              <n.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{n.text}</p>
              <p className="text-xs text-muted-foreground">{n.time}</p>
            </div>
            <CircleDot className="h-2 w-2 text-primary mt-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const schedule = [
  { time: "09:00", title: "Rug Cleaning", who: "Ana Reyes", tag: "Quezon City" },
  { time: "10:30", title: "Sofa Deep Cleaning", who: "Maria Santos", tag: "Makati" },
  { time: "13:00", title: "Mattress Sanitization", who: "Daniel Cruz", tag: "Pasig" },
  { time: "15:30", title: "Full Deep Clean", who: "Liza Pangan", tag: "Mandaluyong" },
];

function Schedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
        <CardDescription>Thursday, May 28, 2026</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule.map((s, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
            <div className="w-14 text-center">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-semibold tabular-nums">{s.time}</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{s.title}</p>
              <p className="text-xs text-muted-foreground truncate">{s.who} • {s.tag}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const customers = [
  { name: "Maria Santos", email: "maria@example.com", bookings: 12, spent: "₱18,400", last: "May 28" },
  { name: "Daniel Cruz", email: "daniel@example.com", bookings: 8, spent: "₱12,000", last: "May 28" },
  { name: "Ana Reyes", email: "ana@example.com", bookings: 15, spent: "₱24,750", last: "May 27" },
  { name: "Jose Mendoza", email: "jose@example.com", bookings: 5, spent: "₱6,500", last: "May 27" },
  { name: "Liza Pangan", email: "liza@example.com", bookings: 3, spent: "₱4,200", last: "May 26" },
];

function CustomersTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Recently active customers</CardDescription>
        </div>
        <Button variant="outline" size="sm">Export CSV</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead className="hidden sm:table-cell">Last Service</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{c.email}</TableCell>
                <TableCell>{c.bookings}</TableCell>
                <TableCell className="font-semibold">{c.spent}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{c.last}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}