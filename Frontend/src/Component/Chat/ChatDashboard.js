import { useParams } from "react-router-dom";

/* Dummy users (same as sidebar for now) */
const usersMap = {
  11: "Priyanshu",
  12: "Pratham",
  3: "Rahul",
  4: "Sneha",
};

/* Dummy chats */
const dummyChats = {
  11: [
    { from: "them", text: "Hey 👋" },
    { from: "me", text: "Hi! How are you?" },
    { from: "them", text: "All good 😊" },
  ],
  12: [
    { from: "them", text: "Did you check the update?" },
    { from: "me", text: "Yes, looks good!" },
  ],
  3: [
    { from: "them", text: "Meeting at 6?" },
    { from: "me", text: "Sure 👍" },
  ],
};

const ChatDashboard = () => {
  const { userId } = useParams();
  const userName = usersMap[userId] || "User";
  const messages = dummyChats[userId] || [];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div
        className="px-4 py-3 border-b font-semibold flex items-center gap-3"
        style={{
          borderColor: "var(--border-main)",
          color: "var(--text-main)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-semibold"
          style={{
            backgroundColor: "var(--accent-secondary)",
            color: "#020617",
          }}
        >
          {userName.charAt(0)}
        </div>
        <span>Chat with {userName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p
            className="text-center text-sm mt-10"
            style={{ color: "var(--text-muted)" }}
          >
            No messages yet. Say hello 👋
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                msg.from === "me" ? "ml-auto" : "mr-auto"
              }`}
              style={{
                backgroundColor:
                  msg.from === "me"
                    ? "var(--accent-primary)"
                    : "var(--bg-input)",
                color:
                  msg.from === "me"
                    ? "#020617"
                    : "var(--text-main)",
              }}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input (disabled for now) */}
      <div
        className="p-3 border-t"
        style={{
          borderColor: "var(--border-main)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full px-4 py-2 rounded-md outline-none"
          style={{
            backgroundColor: "var(--bg-input)",
            color: "var(--text-main)",
            border: "1px solid var(--border-input)",
          }}
          disabled
        />
      </div>
    </div>
  );
};

export default ChatDashboard;
