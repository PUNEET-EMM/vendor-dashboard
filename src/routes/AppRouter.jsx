import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import { RequireAuth, RedirectIfAuth } from "./RouteGuards";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<RedirectIfAuth />}>
          <Route path="/*" element={<PublicRoutes />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/vendor/*" element={<PrivateRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
}
