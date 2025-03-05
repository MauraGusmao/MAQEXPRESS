import Logged from "@/pages/logged";
import Home from "@/pages/home";
import Machine  from "@/pages/machine";
import Login from "@/pages/login";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import { Prohibited } from "@/pages/prohibited";
import PasswordRecovery from "@/pages/password-recovery/index.js";
import CreateMachine from "@/pages/create-machine";
import UserProfile from "@/pages/user-profile";
import GoogleAuthCallback from "@/pages/google-auth-callback";
import HowWorks from "@/pages/howworks";
import MachineDetails from "@/pages/machine-details";
import PdfExample from "@/pages/pdf-example";
import { MachineList } from "@/pages/machine-list";
import UpdateMachine from "@/pages/update-machine";
import DetalhesMaquina from "@/pages/search";
import RentMachine from "@/pages/rent-machine";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <h1>404</h1>,
  },
  {
    path: "/howworks",
    element: <HowWorks />,
  },
  {
    path: "/machine",
    element: <Machine/>,
  },
  {
    path: "/machine-details/:publicid",
    element: <MachineDetails/>,
  },  
  {
    path: "/maquinas/:id",
    element: <DetalhesMaquina />,
  },
  {
    path: "/machine-list",
    element: <MachineList/>,
  },
  {
    path: "/update-machine/:publicid",
    element: <UpdateMachine/>,
  },
  {
    path: "/pdf-example",
    element: <PdfExample/>,
  },
  {
    path: "/password-recovery",
    element: <PasswordRecovery/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/create-machine",
    element: (
      <PrivateRoute>
        <CreateMachine/>
      </PrivateRoute>)
  },
  {
    path: "/user-profile",
    element: (
      <PrivateRoute>
        <UserProfile/>
      </PrivateRoute>)
  },
  {
    path: "/rent-machine/:publicid",
    element: (
      <RentMachine/>
    )
  },
  {
    path: "/logado",
    element: (
      <PrivateRoute>
        <Logged />,
      </PrivateRoute>
    ),
  },
  {
    path: "/auth/google/callback",
    element: (
      <GoogleAuthCallback/>
    )
  },

  {
    path: "/entrada-proibida",
    element: <Prohibited />,
  },
]);

export default router;
