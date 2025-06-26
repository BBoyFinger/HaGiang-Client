import { BrowserRouter } from "react-router-dom";
import PublicRoutes from "@/routes/PublicRoutes";
import PrivateRoutes from "@/routes/PrivateRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <PublicRoutes />
      <PrivateRoutes />
    </BrowserRouter>
  );
}
