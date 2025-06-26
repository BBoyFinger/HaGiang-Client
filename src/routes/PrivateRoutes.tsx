import { Routes, Route, Navigate } from "react-router-dom";
import Admin from "@/pages/Admin";
import { useUser } from "@/contexts/UserContext";

export default function PrivateRoutes() {
    //   const { user } = useUser();
    return (
        <Routes>
            <Route
                path="/admin"
                // element={user ? <Admin /> : <Navigate to="/login" replace />}
                element={<Admin />}


            />
        </Routes>
    );
} 