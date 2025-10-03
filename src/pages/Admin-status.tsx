import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Clock, CheckCircle, TrendingUp, BarChart, PieChart } from "lucide-react";
import { PieChart as RechartsPieChart, Cell, Pie, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Header from "@/components/Header";

type Complaint = {
  complaint_id: number;
  name: string;
  department: string;
  category: "TECHNICAL" | "MESS" | "MAINTENANCE" | "OTHER";
  description: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  created_at: string;
};

const AdminStatus = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/complaints");
      if (!response.ok) throw new Error("Failed to fetch complaints");
      const data: Complaint[] = await response.json();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, status: "IN_PROGRESS" | "RESOLVED") => {
    try {
      const response = await fetch(`http://localhost:8080/api/complaints/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      fetchComplaints(); 
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

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

  const total = complaints.length;
  const active = complaints.filter(c => c.status === "NEW" || c.status === "IN_PROGRESS").length;
  const resolved = complaints.filter(c => c.status === "RESOLVED").length;
  const successRate = total ? Math.round((resolved / total) * 100) : 0;

  const categoryCounts: Record<string, number> = {};
  complaints.forEach(c => (categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1));
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value, color: getCategoryColor(name) }));

  const statusData = [
    { name: "New", value: complaints.filter(c => c.status === "NEW").length, color: "#3b82f6" },
    { name: "In Progress", value: complaints.filter(c => c.status === "IN_PROGRESS").length, color: "#f59e0b" },
    { name: "Resolved", value: complaints.filter(c => c.status === "RESOLVED").length, color: "#10b981" },
    { name: "Closed", value: complaints.filter(c => c.status === "CLOSED").length, color: "#6b7280" },
  ];

  function getCategoryColor(category: string) {
    switch (category) {
      case "TECHNICAL": return "#3b82f6";
      case "MESS": return "#ef4444";
      case "MAINTENANCE": return "#f59e0b";
      case "OTHER": return "#8b5cf6";
      default: return "#6b7280";
    }
  }

  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const weeklyCounts: Record<string, number> = { Sun:0,Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0 };
  const weeklyResolved: Record<string, number> = { Sun:0,Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0 };
  complaints.forEach(c => {
    const day = daysOfWeek[new Date(c.created_at).getDay()];
    weeklyCounts[day]++;
    if(c.status==="RESOLVED") weeklyResolved[day]++;
  });
  const trendData = daysOfWeek.map(day=>({ date: day, complaints: weeklyCounts[day], resolved: weeklyResolved[day] }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin-dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">Admin Complaint Status</h1>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Complaints</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-orange-600">{active}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </CardContent>
          </Card>
        </div>

  
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5"/>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({name,value})=>`${name}: ${value}`}>
                    {categoryData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
                  </Pie>
                  <Tooltip/>
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5"/>Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <Tooltip/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {statusData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5"/>Weekly Complaint Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                <Area type="monotone" dataKey="complaints" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="New"/>
                <Area type="monotone" dataKey="resolved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Resolved"/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Complaints</CardTitle></CardHeader>
          <CardContent>
            {complaints.slice(-10).reverse().map(c=>(
              <div key={c.complaint_id} className="border rounded-lg p-4 mb-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.department}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{c.category}</Badge>
                    <Badge className={getStatusColor(c.status)}>{c.status.replace("_"," ")}</Badge>

                    {c.status === "NEW" && (
                      <Button size="sm" onClick={()=>updateStatus(c.complaint_id,"IN_PROGRESS")}>In Progress</Button>
                    )}

                    {(c.status === "IN_PROGRESS" || c.status === "NEW") && (
                      <Button size="sm" onClick={()=>updateStatus(c.complaint_id,"RESOLVED")}>Resolved</Button>
                    )}
                  </div>
                </div>
                <p className="text-sm mb-2">{c.description}</p>
                <p className="text-xs text-muted-foreground">Submitted: {new Date(c.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default AdminStatus;
