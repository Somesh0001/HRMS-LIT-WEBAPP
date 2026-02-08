import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployees } from "@/hooks/use-employees";
import { useAttendance } from "@/hooks/use-attendance";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: employees = [] } = useEmployees();
  const { data: attendance = [] } = useAttendance();

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // Calculate stats
  const totalEmployees = employees.length;
  const presentToday = attendance.filter(
    (a) => format(new Date(a.date), 'yyyy-MM-dd') === todayStr && a.status === 'Present'
  ).length;
  const onLeave = attendance.filter(
    (a) => format(new Date(a.date), 'yyyy-MM-dd') === todayStr && a.status === 'Leave'
  ).length;

  // Chart data - attendance per department
  const deptStats = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(deptStats).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      desc: "+2 this month",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Present Today",
      value: presentToday,
      icon: UserCheck,
      desc: "92% attendance rate",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "On Leave",
      value: onLeave,
      icon: Clock,
      desc: "Scheduled leaves",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      John Doe marked present
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Checked in at 09:00 AM • Today
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
