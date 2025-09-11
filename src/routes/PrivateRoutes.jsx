import { Routes, Route, Navigate } from "react-router-dom";
import VendorProfile from "../pages/private/Profile/VendorProfile";
import { VendorOrderList } from "../pages/private/Order/VendorOrderList";





export default function PrivateRoutes() {

  return (
    <Routes>

      <Route index element={<Navigate to="vendor" replace />} />


      <Route path="/profile" element={<VendorProfile />} />
      <Route path="/order" element={<VendorOrderList />} />





    </Routes>
  );
}