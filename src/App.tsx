import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import DestinationDetail from "@/pages/DestinationDetail";
import Destinations from "@/pages/Destinations";
import TourDetail from "@/pages/TourDetail";
import Booking from "@/pages/Booking";
import Rent from "./pages/Rent";
import Stay from "./pages/Stay";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Blog from "@/pages/Blog/Blog";
import BlogDetail from "@/pages/Blog/BlogDetail";
import Admin from "@/pages/Admin";
import MotorbikeDetail from "@/pages/MotorbikeDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="destinations/:id" element={<DestinationDetail />} />
          <Route path="tours/:slug" element={<TourDetail />} />
          <Route path="booking" element={<Booking />} />
          <Route path="rent" element={<Rent />} />
          <Route path="rent/:slug" element={<MotorbikeDetail />} />
          <Route path="stay" element={<Stay />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="blogs" element={<Blog />} />
          <Route path="blogs/:slug" element={<BlogDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
