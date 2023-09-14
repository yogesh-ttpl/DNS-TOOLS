import SPFSearch from "./components/SPFSearch";
import Problems from "./pages/Problems";

export const appRoutes = [
  {
    path: "/",
    exact: true,
    component: SPFSearch,
  },
  {
    path: "/problems",
    exact: true,
    component: Problems,
  },
];
