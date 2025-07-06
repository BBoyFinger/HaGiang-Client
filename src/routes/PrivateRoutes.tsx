import { Routes, Route, Navigate } from "react-router-dom";
import Admin from "@/pages/Admin";
import Profile from "@/pages/Profile";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import MainLayout from "@/layouts/MainLayout";

export default function PrivateRoutes() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
    
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route
                    path="/profile"
                    element={
                        isAuthenticated
                            ? <Profile />
                            : <Navigate to="/login" replace />
                    }
                />
            </Route>
            <Route
                path="/admin"
                element={
                    isAuthenticated && user?.role === 'admin' 
                        ? <Admin /> 
                        : <Navigate to="/login" replace />
                }
            />
        </Routes>
    );
} 