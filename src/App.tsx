import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import DestinationDetail from "@/pages/DestinationDetail";
import Destinations from "@/pages/Destinations";
import TourDetail from "@/pages/TourDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="destinations/:id" element={<DestinationDetail />} />
          <Route path="tours/:slug" element={<TourDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
