import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../Tanstack/Credential";
import Footer from "../Footer/Footer"
import Navbar from "../Navbar/Navbar";
import SideBar from "../Sidebar/Sidebar";
import { setUser, logout } from "../redux/AuthSlice";

function Static() {
  const dispatch = useDispatch();

  const { data, error, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser({ user: data }));
    }
    if (error) {
      dispatch(logout());
    }
  }, [data, error, dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Static;
