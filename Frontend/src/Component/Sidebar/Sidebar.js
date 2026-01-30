const users = [
  { id: 1, name: "Aman", online: true },
  { id: 2, name: "Riya", online: false },
  { id: 3, name: "Rahul", online: true },
  { id: 4, name: "Sneha", online: false },
];

const SideBar = () => {
  return (
    <aside
      className="w-64 h-full border-r"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-main)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 font-semibold border-b"
        style={{
          color: "var(--text-label)",
          borderColor: "var(--border-main)",
        }}
      >
        Conversations
      </div>

      {/* Users */}
      <ul className="overflow-y-auto">
        {users.map((user) => (
          <li
            key={user.id}
            className="px-4 py-3 flex items-center gap-3 cursor-pointer transition"
            style={{ color: "var(--text-main)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(20, 184, 166, 0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-semibold"
                style={{
                  backgroundColor: "var(--accent-secondary)",
                  color: "#020617",
                }}
              >
                {user.name.charAt(0)}
              </div>

              {/* Online indicator */}
              {user.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border border-black"></span>
              )}
            </div>

            <span className="text-sm">{user.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
