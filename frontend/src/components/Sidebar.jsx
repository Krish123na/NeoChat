import { useState } from "react";

export default function Sidebar({
  folders,
  activeFolderId,
  activeChatId,
  onCreateFolder,
  onDeleteFolder,
  onCreateChat,
  onSelectChat,
  onDeleteChat,
}) {
  const [openFolderId, setOpenFolderId] = useState(null);

  function toggleFolder(id) {
    setOpenFolderId(openFolderId === id ? null : id);
  }

  function handleNewFolder() {
    const name = prompt("Folder name (e.g. 'College Projects'):");
    if (name && name.trim()) onCreateFolder(name.trim());
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>NeoChat</h2>
        <button className="btn-new-folder" onClick={handleNewFolder}>
          + Folder
        </button>
      </div>

      <div className="folder-list">
        {folders.length === 0 && (
          <p className="empty-hint">No folders yet. Create one above!</p>
        )}

        {folders.map((folder) => (
          <div key={folder.id} className="folder">
            <div
              className={`folder-row ${
                folder.id === activeFolderId ? "active" : ""
              }`}
              onClick={() => toggleFolder(folder.id)}
            >
              <span>{openFolderId === folder.id ? "📂" : "📁"} {folder.name}</span>
              <div className="folder-actions">
                <button
                  title="New chat in this folder"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateChat(folder.id);
                    setOpenFolderId(folder.id);
                  }}
                >
                  +
                </button>
                <button
                  title="Delete folder"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete folder "${folder.name}"?`)) {
                      onDeleteFolder(folder.id);
                    }
                  }}
                >
                  🗑
                </button>
              </div>
            </div>

            {openFolderId === folder.id && (
              <div className="chat-list">
                {folder.chats.length === 0 && (
                  <p className="empty-hint small">No chats yet.</p>
                )}
                {folder.chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-row ${
                      chat.id === activeChatId ? "active" : ""
                    }`}
                    onClick={() => onSelectChat(folder.id, chat.id)}
                  >
                    <span>💬 {chat.title}</span>
                    <button
                      title="Delete chat"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete chat "${chat.title}"?`)) {
                          onDeleteChat(folder.id, chat.id);
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
