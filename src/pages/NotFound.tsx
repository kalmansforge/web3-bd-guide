
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-6 animate-scale-in">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10">
          <FileWarning className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/")} className="px-8">
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
