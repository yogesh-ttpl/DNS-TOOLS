// import React from "react";
// import { BrowserRouter as Router, Switch } from "react-router-dom";

// import DmarcSearch from "./components/dmarcSearch";
// import { Route } from "react-router-dom";
// import { appRoutes } from "./routes";
// function App() {
//   return (
//     <div className="">
//       <Router>
//         <div className="p-[10px]">
//           <div>
//             <h1 className="font-lato text-[24px] border-b-[1px]">
//               DMARC CHECK TOOL
//             </h1>
//             <DmarcSearch />
//           </div>
//         </div>
//         <Switch>
//           {appRoutes.map((route, index) => (
//             <Route
//               key={index}
//               path={route.path}
//               exact={route.exact}
//               component={route.component}
//             />
//           ))}
//         </Switch>
//       </Router>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import DmarcSearch from "./components/dmarcSearch";
import Problems from "./pages/Problems"; // Make sure to import the Problems component
import { appRoutes } from "./routes";

function App() {
  return (
    <div className="">
      <div className="p-[10px]">
        <div>
          <h1 className="font-lato text-[24px] border-b-[1px]">
            DMARC CHECK TOOL
          </h1>
          {/* <DmarcSearch /> */}
        </div>
      </div>
      <Router>
        <Switch>
          {appRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
