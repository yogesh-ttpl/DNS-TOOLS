import DmarcSearch from "./components/dmarcSearch";
import Problems from "./pages/Problems";

export const appRoutes = [
  {
    path: "/",
    exact: true,
    component: DmarcSearch,
  },
  {
    path: "/problems",
    exact: true,
    component: Problems,
  },
];
