import { BrowserRouter } from "react-router-dom";
import PublicRoutes from "@/routes/PublicRoutes";
import PrivateRoutes from "@/routes/PrivateRoutes";
import AuthInitializer from "@/components/AuthInitializer";

export default function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <PublicRoutes />
        <PrivateRoutes />
      </AuthInitializer>
    </BrowserRouter>
  );
}
