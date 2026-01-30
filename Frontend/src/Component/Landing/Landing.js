const Landing = () => {
  return (
    <div
      className="flex-1 p-6 flex flex-col justify-center items-center text-center"
      style={{
        background: "linear-gradient(to bottom, var(--bg-gradient-mid), var(--bg-gradient-end))",
        color: "var(--text-main)",
      }}
    >
      <h2 className="text-3xl font-semibold mb-2">
        Welcome to Talkify 🌿
      </h2>

      <p className="max-w-md" style={{ color: "var(--text-muted)" }}>
        Select a user from the sidebar to start a real-time conversation.
        Messages are secure, fast, and seamless.
      </p>

      <div
        className="mt-6 px-6 py-3 rounded-lg"
        style={{
          backgroundColor: "var(--bg-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <span style={{ color: "var(--accent-primary)" }}>
          💬 Your chats will appear here
        </span>
      </div>
    </div>
  );
};

export default Landing;
