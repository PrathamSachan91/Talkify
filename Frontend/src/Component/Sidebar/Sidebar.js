import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, getConversation, fetchGroups } from "../Tanstack/Chatlist";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSocket } from "../../socket/socketContext";
import api from "../api/api";
import CreateGroupModal from "./groupModal";

const SideBar = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const [openingUserId, setOpeningUserId] = useState(null);
  const [open, setOpen] = useState(false);

  /* ---------------- FETCH USERS ---------------- */
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  /* ---------------- FETCH GROUPS ---------------- */
  const { data: groups = [] } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  /* ---------------- OPEN PRIVATE CHAT ---------------- */
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

  /* ---------------- CREATE GROUP ---------------- */
  const createGroupMutation = useMutation({
    mutationFn: (payload) =>
      api.post("/conversations/group", payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["groups"]);
      setOpen(false);
      navigate(`/chat/${res.data.conversation_id}`);
    },
    onError: () => {
      alert("Failed to create group");
    },
  });

  /* ---------------- SOCKET: USER CREATED ---------------- */
  useEffect(() => {
    if (!socket) return;

    const handleUserCreated = (user) => {
      queryClient.setQueryData(["users"], (old = []) => {
        if (old.some((u) => u.auth_id === user.auth_id)) return old;
        return [...old, user];
      });
    };

    socket.on("user_created", handleUserCreated);

    return () => {
      socket.off("user_created", handleUserCreated);
    };
  }, [socket, queryClient]);

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
      className="w-64 h-full border-r flex flex-col"
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

      {/* New Group Button */}
      <button
        onClick={() => setOpen(true)}
        className="mx-4 my-2 px-3 py-2 rounded bg-indigo-600 text-white text-sm"
      >
        + New Group
      </button>

      {/* List */}
      <ul className="overflow-y-auto flex-1">

        {/* GROUPS */}
        {groups.length > 0 && (
          <>
            <li className="px-4 py-1 text-xs uppercase opacity-60">
              Groups
            </li>

            {groups.map((group) => (
              <li
                key={`group-${group.conversation_id}`}
                className="px-4 py-3 flex items-center gap-3 cursor-pointer transition"
                style={{ color: "var(--text-main)" }}
                onClick={() =>
                  navigate(`/chat/${group.conversation_id}`)
                }
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
                    backgroundColor: "var(--accent-primary)",
                    color: "#020617",
                  }}
                >
                  {group.group_name.charAt(0)}
                </div>

                <span className="text-sm">
                  {group.group_name}
                </span>
              </li>
            ))}
          </>
        )}

        {/* USERS */}
        <li className="px-4 py-1 text-xs uppercase opacity-60 mt-2">
          Direct Messages
        </li>

        {filteredUsers.map((user) => (
          <li
            key={`user-${user.auth_id}`}
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

      {/* Create Group Modal */}
      <CreateGroupModal
        open={open}
        onClose={() => setOpen(false)}
        users={filteredUsers}
        onCreate={(data) => createGroupMutation.mutate(data)}
      />
    </aside>
  );
};

export default SideBar;
