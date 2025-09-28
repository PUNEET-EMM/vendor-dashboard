import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Mobile spacing div */}
      <div className="md:hidden md-[h-0] h-[50px]"></div>
      
      {/* Mobile Sidebar Toggle Button - Fixed positioning */}
      <button
        className="fixed top-20 md:top-24 right-4 z-49 lg:hidden bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>
      
      {/* Main Layout Container - Takes remaining height after navbar */}
      <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex">
        
        {/* Sidebar */}
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          closeSidebar={closeSidebar}
        />
        
        {/* Main Content - Scrollable within the remaining height */}
        <main className="flex-1 bg-white overflow-hidden flex flex-col lg:ml-0">
          <div className="flex-1 overflow-y-auto">
            <div className="">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;