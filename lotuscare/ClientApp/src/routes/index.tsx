import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/patients/Patients";
import MedicalServices from "@/pages/medical-service/MedicalServices";
import HerbalFormulas from "@/pages/herbal-formulas/HerbalFormulas";
import { Acupoints } from "@/pages/acupoints/Acupoints";
import Appointments from "@/pages/Appointments";
import Settings from "@/pages/Settings";
import History from "@/pages/History";
import Starred from "@/pages/Starred";

export const appRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/patients",
    element: <Patients />,
  },
  {
    path: "/medical-services",
    element: <MedicalServices />,
  },
  {
    path: "/herbal-formulas",
    element: <HerbalFormulas />,
  },
  {
    path: "/acupoints",
    element: <Acupoints />,
  },
  {
    path: "/appointments",
    element: <Appointments />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/starred",
    element: <Starred />,
  },
];
