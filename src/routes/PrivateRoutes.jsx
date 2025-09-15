import { Routes, Route, Navigate } from "react-router-dom";
import VendorProfile from "../pages/private/Profile/VendorProfile";
import Support from "../pages/private/Support/Support";
import VendorCatalog from "../pages/private/Catelog/VendorCatalog";
import VendorOrderView from "../pages/private/Order/VendorOrderList";
import OrderRequestManager from "../pages/private/ReqOrder/OrderRequestManager";





export default function PrivateRoutes() {

  return (
    <Routes>

      <Route index element={<Navigate to="vendor" replace />} />


      <Route path="/profile" element={<VendorProfile />} />
      <Route path="/orders" element={<VendorOrderView />} />
      <Route path="/support" element={<Support />} />
        <Route path="/catalog" element={<VendorCatalog />} />
        <Route path="/order-req" element={<OrderRequestManager />} />

    

      




    </Routes>
  );
}