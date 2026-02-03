import { useSelector } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchUsers, getConversation } from "../Tanstack/Chatlist";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SideBar = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [openingUserId, setOpeningUserId] = useState(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const openChatMutation = useMutation({
    mutationFn: getConversation,
    onSuccess: (conver) => {
      navigate(`/chat/${conver.conversation_id}`);
      setOpeningUserId(null);
    },
    onError: () => {
      setOpeningUserId(null);
      alert("Failed to open chat");
    },
  });

  const openChat = (userId) => {
    if (openingUserId) return;
    setOpeningUserId(userId);
    openChatMutation.mutate(userId);
  };

  if (isLoading) {
    return (
      <aside className="w-64 h-full flex items-center justify-center">
        <span className="text-sm text-gray-400">Loading users...</span>
      </aside>
    );
  }

  const filteredUsers = users.filter(
    (u) => u.auth_id !== currentUser?.auth_id
  );

  return (
    <aside
      className="w-64 h-full border-r"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-main)",
      }}
    >
      <div
        className="px-4 py-3 font-semibold border-b"
        style={{
          color: "var(--text-label)",
          borderColor: "var(--border-main)",
        }}
      >
        Conversations
      </div>

      <ul className="overflow-y-auto">
        {filteredUsers.map((user) => (
          <li
            key={user.auth_id}
            className="px-4 py-3 flex items-center gap-3 cursor-pointer transition"
            style={{
              color: "var(--text-main)",
              opacity: openingUserId === user.auth_id ? 0.6 : 1,
            }}
            onClick={() => openChat(user.auth_id)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(20, 184, 166, 0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold"
              style={{
                backgroundColor: "var(--accent-secondary)",
                color: "#020617",
              }}
            >
              {user.user_name.charAt(0)}
            </div>

            <span className="text-sm">{user.user_name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
