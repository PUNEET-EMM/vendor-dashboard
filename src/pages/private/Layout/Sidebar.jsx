
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  ShoppingCart,
  HelpCircle,
  FileText,
  LogOut,
  Building2,
  TrendingUp
} from "lucide-react";
import { useOrderRequests } from "../../../hooks/order"; // Adjust path as needed

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order requests data for notifications
  const { data: requests = [] } = useOrderRequests();
  
  // Count pending requests for notification
  const pendingRequestsCount = requests.filter(request => request.status === 'Pending').length;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  const menuItems = [
    {
      path: "/partner/profile",
      icon: User,
      label: "My Profile",
      hasNotification: false,
      notificationCount: 0
    },
    {
      path: "/partner/orders",
      icon: ShoppingCart,
      label: "Ongoing Order",
      hasNotification: false,
      notificationCount: 0
    },
    {
      path: "/partner/order-req",
      icon: Building2,
      label: "Incoming Orders",
      hasNotification: pendingRequestsCount > 0,
      notificationCount: pendingRequestsCount > 99 ? '99+' : pendingRequestsCount
    },
    // {
    //   path: "/partner/analytics",
    //   icon: TrendingUp,
    //   label: "Analytics"
    // },
    // {
    //   path: "/partner/invoices",
    //   icon: FileText,
    //   label: "Invoices"
    // },
    // {
    //   path: "/partner/support",
    //   icon: HelpCircle,
    //   label: "Support"
    // }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`
        fixed top-16 md:top-20 left-0 z-40 w-80 bg-white shadow-xl border-r border-gray-200
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]
        lg:relative lg:top-0 lg:translate-x-0 lg:shadow-none lg:border-r lg:z-0 lg:w-72
        lg:sticky lg:self-start
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      aria-label="Navigation sidebar"
    >
      {/* Sidebar Content */}
      <div className="p-4 lg:p-6">
        {/* Navigation Menu */}
        <nav className="space-y-2">
          {/* Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border-blue-200 border'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }
                `}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.hasNotification && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full shadow-md px-1">
                      {item.notificationCount}
                    </span>
                  )}
                </div>
                <span className="font-medium text-sm">{item.label}</span>
                
                {/* Optional: Add a pulsing dot for active notifications */}
                {item.hasNotification && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Log out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;