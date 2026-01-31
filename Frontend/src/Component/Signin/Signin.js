import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MessageCircle } from "lucide-react";

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({ msg: "", type: "" });
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
      await axios.post("http://localhost:3001/api/auth/signin", values);

      showAlert("Account created successfully", "success");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      showAlert(err.response?.data?.message || "Signup failed", "error");
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
            Create your account
          </h2>

          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Join Talkify and start chatting
          </p>
        </div>

        {/* Alert */}
        {alert.msg && (
          <div
            className="mb-4 text-sm px-4 py-2 rounded-md text-center"
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
          {/* Name */}
          <div>
            <label
              className="text-sm mb-1 block"
              style={{ color: "var(--text-label)" }}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full px-4 py-2 rounded-md outline-none"
              style={{
                backgroundColor: "var(--bg-input)",
                color: "var(--text-main)",
                border: "1px solid var(--border-input)",
              }}
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-md font-medium transition"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "#020617",
            }}
          >
            Sign Up
          </button>
        </form>

        {/* Login link */}
        <p
          className="mt-6 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--accent-secondary)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
