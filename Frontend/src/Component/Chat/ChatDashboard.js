import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
// import socket from "../../socket/socket";
import { useSocket } from "../../socket/socketContext";
import { Paperclip } from "lucide-react";
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
  const socket = useSocket();
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);

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
    queryClient.invalidateQueries({
      queryKey: ["messages", conversationId],
    });
    socket.emit("join_conversation", conversationId);

    socket.on("receive_message", (message) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    });

    return () => {
      socket.off("receive_message");
    };
  }, [conversationId, socket, queryClient]);

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setText("");
      setImage(null);
      setPreview(null);
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
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="inline-block max-w-[60%] px-4 py-2 rounded-lg text-sm break-words"
                  style={{
                    backgroundColor: isMe
                      ? "var(--accent-primary)"
                      : "var(--bg-input)",
                    color: isMe ? "#020617" : "var(--text-main)",
                  }}
                >
                  {msg.type === "image" ? (
                    <img
                      src={`http://localhost:3001${msg.image_url}`}
                      alt="sent"
                      className="max-w-60 max-h-60 rounded-lg object-contain"
                    />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      {preview && (
        <div
          className="px-3 py-2 border-t flex items-center gap-3"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <img
            src={preview}
            alt="preview"
            className="max-w-40 max-h-40 object-cover rounded-lg border"
          />

          <button
            type="button"
            onClick={() => {
              setImage(null);
              setPreview(null);
              fileInputRef.current.value = null;
            }}
            className="text-sm text-red-500"
          >
            Remove
          </button>
        </div>
      )}

      {/* ================= INPUT ================= */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim() && !image) return;

          sendMessageMutation.mutate({
            conversationId,
            text,
            image,
          });
        }}
        className="p-3 border-t flex gap-2"
        style={{
          borderColor: "var(--border-main)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            setImage(file);
            setPreview(URL.createObjectURL(file));
          }}
        />
        <div className="relative flex-1">
          {/* 📎 ICON */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            title="Attach image"
          >
            <Paperclip size={18} />
          </button>

          {/* TEXT INPUT */}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="w-full pl-10 pr-4 py-2 rounded-md outline-none"
            style={{
              backgroundColor: "var(--bg-input)",
              color: "var(--text-main)",
              border: "1px solid var(--border-input)",
            }}
          />
        </div>

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
