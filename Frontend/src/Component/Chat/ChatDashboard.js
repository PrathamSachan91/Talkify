import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import {
  fetchMessages,
  sendMessage,
  fetchConversationMeta,
  fetchUserById,
} from "../Tanstack/Chatlist";

const ChatDashboard = () => {
  const { conversationId } = useParams();
  const currentUser = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const { data: convo } = useQuery({
    queryKey: ["conversation-meta", conversationId],
    queryFn: () => fetchConversationMeta(conversationId),
    enabled: !!conversationId,
  });

  const { data: receiver } = useQuery({
    queryKey: ["user", convo?.receiver_id],
    queryFn: () => fetchUserById(convo.receiver_id),
    enabled: !!convo?.receiver_id,
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join_conversation", conversationId);

    socket.on("receive_message", (message) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (old = []) => {
          // prevent duplicates
          if (old.some((m) => m.id === message.id)) return old;
          return [...old, message];
        }
      );
    });

    return () => {
      socket.off("receive_message");
    };
  }, [conversationId, queryClient]);

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setText("");
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span style={{ color: "var(--text-muted)" }}>Loading chat…</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* ================= HEADER ================= */}
      <div
        className="px-4 py-3 border-b font-semibold flex items-center gap-3"
        style={{
          borderColor: "var(--border-main)",
          backgroundColor: "var(--bg-card)",
          color: "var(--text-main)",
        }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-semibold"
          style={{
            backgroundColor: "var(--accent-secondary)",
            color: "#020617",
          }}
        >
          {receiver?.user_name?.charAt(0) || "?"}
        </div>

        <span>{receiver?.user_name || "Chat"}</span>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p
            className="text-center text-sm mt-10"
            style={{ color: "var(--text-muted)" }}
          >
            No messages yet. Say hello 👋
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.auth_id;

            return (
              <div
                key={msg.id}
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  isMe ? "ml-auto" : "mr-auto"
                }`}
                style={{
                  backgroundColor: isMe
                    ? "var(--accent-primary)"
                    : "var(--bg-input)",
                  color: isMe ? "#020617" : "var(--text-main)",
                }}
              >
                {msg.text}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT ================= */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;

          sendMessageMutation.mutate({
            conversationId,
            text,
          });
        }}
        className="p-3 border-t flex gap-2"
        style={{
          borderColor: "var(--border-main)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-md outline-none"
          style={{
            backgroundColor: "var(--bg-input)",
            color: "var(--text-main)",
            border: "1px solid var(--border-input)",
          }}
        />

        <button
          type="submit"
          disabled={sendMessageMutation.isLoading}
          className="px-4 py-2 rounded-md font-medium"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "#020617",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatDashboard;
