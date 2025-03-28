
import React from "react";
import { Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

// This component is intentionally disabled as we're moving away from user/team functionality
// and only using local storage
const TeamsPage = () => {
  // Redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default TeamsPage;
