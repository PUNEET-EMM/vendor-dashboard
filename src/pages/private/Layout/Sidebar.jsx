import { Link, useNavigate } from "react-router-dom";

import profileicon from "../../../assets/profileicon.png";
import ordericon from "../../../assets/ordericon.png";
import supporticon from "../../../assets/supporticon.png";
import approvalicon from "../../../assets/approvalicon.png";
import invoiceicon from "../../../assets/invoiceicon.png";
import logouticon from "../../../assets/logouticon.png";
import { useState } from "react";


const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <aside className={` fixed top-[86px] left-0 bottom-0 w-64 bg-white shadow-lg z-40 overflow-y-auto
                        transform transition-transform duration-300 ease-in-out
                        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                      `}>

      <nav className="flex flex-col p-6 space-y-6 text-sm font-poppins text-gray-900">
        {/* Profile */}
        <div className="flex items-center gap-3">
          <Link to="/vendor/profile">
            <img src={profileicon} alt="Profile" className="w-6 h-6" />
          </Link>
          <Link to="/vendor/profile" className="hover:text-blue-600">
            My Profile
          </Link>
        </div>

        {/* Orders */}
        <div className="flex items-center gap-3">
          <Link to="/vendor/orders">
            <img src={ordericon} alt="Orders" className="w-6 h-6" />
          </Link>
          <Link to="/vendor/orders" className="hover:text-blue-600">
            Orders
          </Link>
        </div>


        <div className="flex items-center gap-3">
          <Link to="/support">
            <img src={supporticon} alt="Support" className="w-6 h-6" />
          </Link>
          <Link to="/support" className="hover:text-blue-600">
            Support
          </Link>
        </div>

        {/* Approvals */}
        <div className="flex items-center gap-3 relative">
          <Link to="/approval">
            <div className="relative">
              <img src={approvalicon} alt="Approval" className="w-6 h-6" />
         
            </div>
          </Link>
          <Link to="/approval" className="hover:text-blue-600">
            Approvals
          </Link>
        </div>

        {/* Invoices */}
        <div className="flex items-center gap-3">
          <Link to="/invoice">
            <img src={invoiceicon} alt="Invoice" className="w-6 h-6" />
          </Link>
          <Link to="/invoice" className="hover:text-blue-600">
            Invoices
          </Link>
        </div>


                <div className="flex items-center gap-3 relative">
          <Link to="/approval">
            <div className="relative">
              <img src={approvalicon} alt="Approval" className="w-6 h-6" />
            </div>
          </Link>
          <Link to="/approval" className="hover:text-blue-600">
                   Catalog

          </Link>
        </div>

        



        {/* Logout */}
        <div className="flex items-center gap-3 ml-1">
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 mr-2 cursor-pointer text-red-600 hover:text-red-800"
          >
            <img src={logouticon} alt="Logout" className="w-5 h-5" />
            <span>Log out</span>
          </div>
        </div>

      </nav>
    </aside>


  )
}

export default Sidebar