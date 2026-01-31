import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/AuthSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
//   const authState = useSelector((state) => state.auth);
// console.log("Auth",authState);
  // 🔐 Read auth state from Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav
      className="h-14 flex items-center justify-between px-6 border-b"
      style={{
        background:
          "linear-gradient(to right, var(--bg-gradient-start), var(--bg-gradient-mid))",
        borderColor: "var(--border-main)",
      }}
    >
      {/* Logo */}
      <h1
        className="text-xl font-semibold tracking-wide cursor-pointer"
        style={{ color: "var(--accent-primary)" }}
        onClick={() => navigate("/")}
      >
        Talkify 💬
      </h1>
      
      {/* Right Section */}
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            {/* Username */}
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {user.user_name}
            </span>

            {/* Logout Button */}
            <button
              className="px-3 py-1 text-sm rounded-md transition"
              style={{
                backgroundColor: "var(--danger)",
                color: "#020617",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="px-3 py-1 text-sm rounded-md transition"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "#020617",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
