import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import DestinationDetail from "@/pages/Destination/DestinationDetail";
import Destinations from "@/pages/Destination/Destinations";
import TourDetail from "@/pages/Tour/TourDetail";
import Tour from "@/pages/Tour/Tour";
import Rent from "@/pages/Rent/Rent";
import Stay from "@/pages/Stay/Stay";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Blog from "@/pages/Blog/Blog";
import BlogDetail from "@/pages/Blog/BlogDetail";
import VehicleDetail from "@/pages/Rent/VehicleDetail";
import Favorites from "@/pages/Favorites";
import StayDetail from "@/pages/Stay/[id]";
import Search from "@/pages/Search";
import Admin from "@/pages/Admin";
import Profile from "@/pages/Profile";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Navigate } from "react-router-dom";
import AuthInitializer from "@/components/AuthInitializer";

export default function App() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AuthInitializer>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destinations/:slug" element={<DestinationDetail />} />
            <Route path="tours/:slug" element={<TourDetail />} />
            <Route path="tour" element={<Tour />} />
            <Route path="rent" element={<Rent />} />
            <Route path="rent/:slug" element={<VehicleDetail />} />
            <Route path="stay" element={<Stay />} />
            <Route path="stay/:id" element={<StayDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="blogs" element={<Blog />} />
            <Route path="blogs/:slug" element={<BlogDetail />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="search" element={<Search />} />
          </Route>

          {/* Private Routes */}
          <Route path="/profile" element={<MainLayout />}>
            <Route index element={
              isAuthenticated
                ? <Profile />
                : <Navigate to="/login" replace />
            } />
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
      </AuthInitializer>
    </BrowserRouter>
  );
}
