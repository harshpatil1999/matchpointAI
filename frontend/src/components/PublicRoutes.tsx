import { Navigate, Outlet } from "react-router-dom";
import { useAppData } from "../context/AppContext";

function PublicRoutes() {
  const { isAuth, loading } = useAppData();
  if (loading) return null;
  if (isAuth) {
    return <Navigate to={"/"} replace />;
  }
  return <Outlet />;
}

export default PublicRoutes;
