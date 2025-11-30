import { createBrowserRouter } from "react-router";
import { Layout } from "../components/Layout.jsx";
import { Home } from "../pages/Home.jsx";
import { EcoTips } from "../pages/EcoTips.jsx";
import { Team } from "../pages/Team.jsx";
import { LoginAdmin } from "../pages/LoginAdmin.jsx";
import { RegisterAdmin } from "../pages/RegisterAdmin.jsx";
import { DashboardAdmin } from "../pages/DashboardAdmin.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "eco-tips", Component: EcoTips },
      { path: "team", Component: Team },
    ],
  },
  {
    path: "/login-admin",
    Component: LoginAdmin,
  },
  {
    path: "/register-admin",
    Component: RegisterAdmin,
  },
  {
    path: "/dashboard-admin",
    Component: DashboardAdmin,
  },
]);
