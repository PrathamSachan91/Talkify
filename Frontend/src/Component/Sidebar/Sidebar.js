import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../Tanstack/Chatlist";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const currentUser = useSelector((state) => state.auth.user);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <aside className="w-64 h-full flex items-center justify-center">
        <span className="text-sm text-gray-400">Loading users...</span>
      </aside>
    );
  }

  const filteredUsers = users.filter(
    (user) => user.auth_id !== currentUser?.auth_id,
  );

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
        {filteredUsers.map((user) => (
          <li
            key={user.auth_id}
            className="px-4 py-3 flex items-center gap-3 cursor-pointer transition"
            style={{ color: "var(--text-main)" }}
            onClick={() => navigate(`/chat/${user.auth_id}`)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(20, 184, 166, 0.15)")
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
                {user.user_name.charAt(0)}
              </div>

              {/* Online indicator (later via sockets) */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-gray-500 border border-black"></span>
            </div>

            <span className="text-sm">{user.user_name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
