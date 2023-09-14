import EmailVerify from "./components/EmailVerify";
import Problems from "./pages/Problems";

export const appRoutes = [
  {
    path: "/",
    exact: true,
    component: EmailVerify,
  },
  {
    path: "/problems",
    exact: true,
    component: Problems,
  },
];
