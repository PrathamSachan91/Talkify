import {useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate=useNavigate();
  return (
    <nav
      className="h-14 flex items-center justify-between px-6 border-b"
      style={{
        background: "linear-gradient(to right, var(--bg-gradient-start), var(--bg-gradient-mid))",
        borderColor: "var(--border-main)",
      }}
    >
      {/* Logo */}
      <h1
        className="text-xl font-semibold tracking-wide"
        style={{ color: "var(--accent-primary)" }}
      >
        Talkify 💬
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          Pratham
        </span>

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
      </div>
    </nav>
  );
};

export default Navbar;
