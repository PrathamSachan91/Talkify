import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
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
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const fileInputRef = useRef(null);

  const { data: convo } = useQuery({
    queryKey: ["conversation-meta", conversationId],
    queryFn: () => fetchConversationMeta(conversationId),
    enabled: !!conversationId,
  });
  const showSenderName = convo?.type !== "private";

  const { data: receiver } = useQuery({
    queryKey: ["user", convo?.receiver_id],
    queryFn: () => fetchUserById(convo.receiver_id),
    enabled: convo?.type === "private" && !!convo?.receiver_id,
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
      setImages([]);
      setPreviews([]);
      fileInputRef.current.value = null;
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
          {convo?.type === "group"
            ? convo.group_name?.charAt(0)
            : receiver?.user_name?.charAt(0) || "P"}
        </div>
        <span>
          {convo?.type === "private"
            ? receiver?.user_name || "Chat"
            : convo?.group_name}
        </span>
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
                {showSenderName && !isMe && (
                  <div
                    className="w-7 h-7 ml-[-10px] mr-[5px] rounded-full flex items-center justify-center font-semibold"
                    style={{
                      backgroundColor: "var(--accent-secondary)",
                      color: "#020617",
                    }}
                  >
                    <p className="mx-[-7px] mt-[-5px] ">
                      {msg.sender?.user_name.charAt(0)}
                    </p>
                  </div>
                )}
                <div
                  className="relative inline-block max-w-[60%] px-4 py-2 rounded-lg text-sm break-words"
                  style={{
                    backgroundColor: isMe
                      ? "var(--accent-primary)"
                      : "var(--bg-input)",
                    color: isMe ? "#020617" : "var(--text-main)",
                  }}
                >
                  {/* Arrow */}
                  {showSenderName && !isMe && (
                    <span
                      className="absolute -top-[-4.7px] -left-2 w-0 h-0 
                      border-l-8 border-l-transparent 
                      border-r-8 border-r-transparent 
                      border-b-8 -rotate-90"
                      style={{
                        borderBottomColor: "var(--bg-input)",
                      }}
                    />
                  )}

                  {showSenderName && !isMe && (
                    <p className="mx-[-7px] mt-[-5px] text-[10px] text-white/80 font-semibold opacity-90">
                      {msg.sender?.user_name}
                    </p>
                  )}

                  <div className="space-y-2">
                    {msg.images?.length > 0 && (
                      <div
                        className="relative cursor-pointer inline-block"
                        onClick={() => {
                          const urls = msg.images.map(
                            (img) => `http://localhost:3001${img}`,
                          );

                          const query = encodeURIComponent(
                            JSON.stringify(urls),
                          );

                          window.open(`/image.html?images=${query}`, "_blank");
                        }}
                      >
                        <img
                          src={`http://localhost:3001${msg.images[0]}`}
                          alt="sent"
                          className="max-w-60 max-h-60 object-contain rounded-lg"
                        />

                        {msg.images.length > 1 && (
                          <div className="absolute inset-0 bg-black/60 flex items-end justify-end rounded-lg px-2 py-1">
                            <span className="text-white text-xl font-semibold">
                              +{msg.images.length - 1}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {msg.text && <p>{msg.text}</p>}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      {previews && previews.length > 0 && (
        <div
          className="px-3 py-2 border-t flex gap-3 flex-wrap"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          {previews.map((src, idx) => (
            <div key={idx} className="relative">
              <img
                src={src}
                alt="preview"
                className="max-w-40 max-h-40 object-cover rounded-lg border"
              />

              <button
                type="button"
                onClick={() => {
                  const newImages = images.filter((_, i) => i !== idx);
                  const newPreviews = previews.filter((_, i) => i !== idx);

                  setImages(newImages.length ? newImages : null);
                  setPreviews(newPreviews.length ? newPreviews : null);

                  if (newImages.length === 0) {
                    fileInputRef.current.value = null;
                  }
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= INPUT ================= */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim() && !images) return;

          sendMessageMutation.mutate({
            conversationId,
            text,
            images,
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
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setImages(files);
            setPreviews(files.map((f) => URL.createObjectURL(f)));
          }}
        />

        <div className="relative flex-1">
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
