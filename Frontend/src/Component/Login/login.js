import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/Authentication";
import { MessageCircle } from "lucide-react";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ msg: "", type: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert({ msg: "", type: "" }), 1500);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        values
      );

      dispatch(setUser(res.data.user));
      showAlert("Login successful", "success");

      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      showAlert(err.response?.data?.message || "Login failed", "error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-mid), var(--bg-gradient-end))",
      }}
    >
      {/* Card */}
      <div
        className="w-full max-w-md rounded-xl p-8"
        style={{
          backgroundColor: "var(--bg-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
            style={{ backgroundColor: "var(--accent-primary)" }}
          >
            <MessageCircle className="text-black" />
          </div>

          <h2
            className="text-2xl font-semibold"
            style={{ color: "var(--text-main)" }}
          >
            Welcome back
          </h2>

          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Sign in to continue to Talkify
          </p>
        </div>

        {/* Alert */}
        {alert.msg && (
          <div
            className={`mb-4 text-sm px-4 py-2 rounded-md text-center`}
            style={{
              backgroundColor:
                alert.type === "success"
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.15)",
              color:
                alert.type === "success"
                  ? "var(--success)"
                  : "var(--danger)",
            }}
          >
            {alert.msg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="text-sm mb-1 block"
              style={{ color: "var(--text-label)" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-2 rounded-md outline-none"
              style={{
                backgroundColor: "var(--bg-input)",
                color: "var(--text-main)",
                border: "1px solid var(--border-input)",
              }}
            />
          </div>

          <div>
            <label
              className="text-sm mb-1 block"
              style={{ color: "var(--text-label)" }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-md outline-none"
              style={{
                backgroundColor: "var(--bg-input)",
                color: "var(--text-main)",
                border: "1px solid var(--border-input)",
              }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <Link
              to="/forgot-password"
              style={{ color: "var(--accent-secondary)" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md font-medium transition"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "#020617",
            }}
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-600/40" />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            OR
          </span>
          <div className="flex-1 h-px bg-gray-600/40" />
        </div>

        {/* Google Login Placeholder */}
        <button
          className="w-full py-2 rounded-md border text-sm transition"
          style={{
            borderColor: "var(--border-main)",
            color: "var(--text-main)",
          }}
        >
          Continue with Google
        </button>

        {/* Signup */}
        <p
          className="mt-6 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Don’t have an account?{" "}
          <Link
            to="/Signin"
            style={{ color: "var(--accent-secondary)" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
