import { useState } from "react";

const CreateGroupModal = ({ open, onClose, users, onCreate }) => {
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState([]);

  if (!open) return null;

  const toggleUser = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((u) => u !== id)
        : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim() || selected.length === 0) {
      alert("Enter group name and select members");
      return;
    }

    onCreate({
      group_name: groupName,
      members: selected,
    });

    setGroupName("");
    setSelected([]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="w-96 rounded-lg p-4"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <h2 className="text-lg font-semibold mb-3">Create Group</h2>

        <input
          type="text"
          placeholder="Group name"
          className="w-full p-2 mb-3 rounded border"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <div className="max-h-48 overflow-y-auto mb-3">
          {users.map((u) => (
            <label
              key={u.auth_id}
              className="flex items-center gap-2 mb-1 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(u.auth_id)}
                onChange={() => toggleUser(u.auth_id)}
              />
              {u.user_name}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="px-3 py-1 rounded bg-indigo-600 text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
