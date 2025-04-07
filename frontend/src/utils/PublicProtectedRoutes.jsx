import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes=()=>{
    const token = localStorage.getItem('token');

    return (token)?<Outlet/>:<Navigate to="/login" replace/>
}

export const PublicRoutes = () =>{
    const token = localStorage.getItem('token');

    return (token)?<Navigate to="/pending-tasks" replace/>:<Outlet/>
}

export const ProtectedResetPasswordRoute = ()=>{
    const token = sessionStorage.getItem('reset-token');

    return (token)?<Outlet/>:<Navigate to='/forgot-password' replace/>
}