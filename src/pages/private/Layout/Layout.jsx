import Navbar from "./Navbar";
import Sidebar from "./Sidebar";



const Layout = ({ children }) => {


  return (
    <>
      {/* Fixed Navbar */}
      <Navbar />

      <div className="w-full min-h-screen pt-[86px] bg-white relative overflow-auto">
        <Sidebar />
        {/* Main Content */}
        <main className="lg:ml-65 min-h-screen">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </>
  );
};

export default Layout;
