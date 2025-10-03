import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, TrendingUp, BarChart, PieChart } from "lucide-react";
import { PieChart as RechartsPieChart, Cell, Pie, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Header from "@/components/Header";

type Complaint = {
  id: string;
  name: string;
  department: string;
  category: "TECHNICAL" | "MESS" | "MAINTENANCE" | "OTHER";
  description: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  photo_path?: string | null;
  resolution_notes: string;
  created_at: string;
  updated_at: string;
};

const Status = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchComplaints = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/complaints"); 
        if (!response.ok) throw new Error("Failed to fetch complaints");
        const data: Complaint[] = await response.json();
        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  const categoryStats = {
    TECHNICAL: complaints.filter(c => c.category === "TECHNICAL").length,
    MESS: complaints.filter(c => c.category === "MESS").length,
    MAINTENANCE: complaints.filter(c => c.category === "MAINTENANCE").length,
    OTHER: complaints.filter(c => c.category === "OTHER").length,
  };

  const statusStats = {
    NEW: complaints.filter(c => c.status === "NEW").length,
    IN_PROGRESS: complaints.filter(c => c.status === "IN_PROGRESS").length,
    RESOLVED: complaints.filter(c => c.status === "RESOLVED").length,
    CLOSED: complaints.filter(c => c.status === "CLOSED").length,
  };

  const totalComplaints = complaints.length;
  const activeComplaints = statusStats.NEW + statusStats.IN_PROGRESS;
  const resolvedPercentage = totalComplaints > 0 ? Math.round((statusStats.RESOLVED / totalComplaints) * 100) : 0;


  const categoryChartData = [
    { name: "Technical", value: categoryStats.TECHNICAL, color: "#3b82f6" },
    { name: "Mess", value: categoryStats.MESS, color: "#ef4444" },
    { name: "Maintenance", value: categoryStats.MAINTENANCE, color: "#f59e0b" },
    { name: "Other", value: categoryStats.OTHER, color: "#8b5cf6" }
  ].filter(item => item.value > 0);


  const statusChartData = [
    { name: "New", count: statusStats.NEW, color: "#3b82f6" },
    { name: "In Progress", count: statusStats.IN_PROGRESS, color: "#f59e0b" },
    { name: "Resolved", count: statusStats.RESOLVED, color: "#10b981" },
    { name: "Closed", count: statusStats.CLOSED, color: "#6b7280" }
  ];


  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyCounts: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  const weeklyResolvedCounts: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

  complaints.forEach(c => {
    const day = daysOfWeek[new Date(c.created_at).getDay()];
    weeklyCounts[day] += 1;
    if (c.status === "RESOLVED") weeklyResolvedCounts[day] += 1;
  });

  const trendData = daysOfWeek.map(day => ({
    date: day,
    complaints: weeklyCounts[day],
    resolved: weeklyResolvedCounts[day]
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">Complaint Status & Statistics</h1>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Complaints</p>
                <p className="text-2xl font-bold">{totalComplaints}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-orange-600">{activeComplaints}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{statusStats.RESOLVED}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{resolvedPercentage}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5" />Category Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" />Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trends */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />Weekly Complaint Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="complaints" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="New Complaints" />
                <Area type="monotone" dataKey="resolved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            {complaints.slice(-10).reverse().map((complaint) => (
              <div key={complaint.id} className="border rounded-lg p-4 mb-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{complaint.name}</h3>
                    <p className="text-sm text-muted-foreground">{complaint.department}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{complaint.category}</Badge>
                    <Badge className={getStatusColor(complaint.status)}>{complaint.status.replace("_"," ")}</Badge>
                  </div>
                </div>
                <p className="text-sm mb-2">{complaint.description}</p>
                <p className="text-xs text-muted-foreground">
                  Submitted: {new Date(complaint.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Status;
