import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/store";
import AuthInitializer from "@/components/AuthInitializer";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import { DataProvider } from "@/providers/DataProvider";

// Lazy load components for better performance
const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const DestinationDetail = lazy(() => import("@/pages/Destination/DestinationDetail"));
const Destinations = lazy(() => import("@/pages/Destination/Destinations"));
const TourDetail = lazy(() => import("@/pages/Tour/TourDetail"));
const Tour = lazy(() => import("@/pages/Tour/Tour"));
const Rent = lazy(() => import("@/pages/Rent/Rent"));
const Stay = lazy(() => import("@/pages/Stay/Stay"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));
const Blog = lazy(() => import("@/pages/Blog/Blog"));
const BlogDetail = lazy(() => import("@/pages/Blog/BlogDetail"));
const VehicleDetail = lazy(() => import("@/pages/Rent/VehicleDetail"));
const Favorites = lazy(() => import("@/pages/Favorites"));
const StayDetail = lazy(() => import("@/pages/Stay/[id]"));
const Search = lazy(() => import("@/pages/Search"));
const Admin = lazy(() => import("@/pages/Admin"));
const Profile = lazy(() => import("@/pages/Profile"));

// Loading component for Suspense
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

export default function App() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <AuthInitializer>
          <DataProvider>
            <Suspense fallback={<PageLoading />}>
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
            </Suspense>
          </DataProvider>
        </AuthInitializer>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
