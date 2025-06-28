import { Routes, Route } from "react-router-dom";
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

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/:id" element={<DestinationDetail />} />
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
        <Route path="/favourite" element={<Favorites />} />
      </Route>
    </Routes>
  );
} 