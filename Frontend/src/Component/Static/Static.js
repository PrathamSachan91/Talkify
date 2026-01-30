import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import SideBar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

function Static() {
  return (
    <div className="layout">
      <Navbar />
      
      <div className="page-content">
        <SideBar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Static;
