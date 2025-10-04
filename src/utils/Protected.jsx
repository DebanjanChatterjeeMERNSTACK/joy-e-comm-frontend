import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const Protected = ({ allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // prevent redirect until checked

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setRole(decoded.role);
        console.log(decoded.role)
      } catch (err) {
        console.error("Invalid token", err);
        setRole(null);
      }
    }
    setLoading(false);
  }, []); // <- important: only run once on mount

  if (loading) return null; // or a spinner

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default Protected;