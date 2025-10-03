import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, FileText, BarChart3 } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/dashboard")}>
            Complaint Management
          </h1>
          <nav className="flex gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/complaint-form")}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Complaint Forms
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/status")}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Status
            </Button>
          </nav>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;