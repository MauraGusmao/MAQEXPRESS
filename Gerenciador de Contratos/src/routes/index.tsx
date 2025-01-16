import About from "@/pages/about";
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


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <h1>404</h1>,
  },
  {
    path: "/sobre",
    element: <About />,
  },
  {
    path: "/machine",
    element: <Machine/>,
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
    element: <CreateMachine/>
  },
  {
    path: "/user-profile",
    element: <UserProfile/>
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
    path: "/entrada-proibida",
    element: <Prohibited />,
  },
]);

export default router;
