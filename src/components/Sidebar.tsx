import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, ChevronLeft, ChevronRight, Plus, Trash2, MessageCircle, Info, Pencil } from 'lucide-react';
import { cn } from '../utils/cn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { createSession, switchSession, deleteSession, updateSessionTitle } from '../store/chatSlice';

interface SidebarProps {
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatState = useSelector((state: RootState) => state.chat);
  const sessions = chatState?.sessions ?? [];
  const activeSessionId = chatState?.activeSessionId ?? null;
  const handleNewChat = () => {
    dispatch(createSession());
    navigate('/chat');
  };

  const handleSwitchChat = (id: string) => {
    dispatch(switchSession(id));
    navigate('/chat');
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(deleteSession(id));
  };

  const visibleSessions = (sessions || []).filter((s) => {
    if (!chatSearch.trim()) return true;
    return s.title.toLowerCase().includes(chatSearch.trim().toLowerCase());
  });

  const startEditing = (e: React.MouseEvent, id: string, current: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingTitle(current);
  };

  const commitEditing = () => {
    const title = editingTitle.trim();
    if (editingId && title.length > 0) {
      dispatch(updateSessionTitle({ sessionId: editingId, title }));
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  return (
    <div
      className={cn(
        "h-screen bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col shadow-lg z-20 flex-shrink-0",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 h-16">
        <Link
          to="/"
          className={cn(
            "font-bold bg-clip-text text-transparent bg-primary-gradient",
            isCollapsed ? "text-lg" : "text-xl"
          )}
          aria-label="Go to home"
        >
          {isCollapsed ? 'MB' : 'MoltBook AI'}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="p-4 space-y-2">
        <Link
          to="/about"
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
            location.pathname === '/about' && "bg-gray-100 dark:bg-gray-700"
          )}
        >
          <Info size={20} />
          {!isCollapsed && <span>About</span>}
        </Link>
        
        <button
          onClick={handleNewChat}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl w-full transition-colors bg-primary-gradient text-white shadow-md hover:shadow-cyan-500/20"
          )}
        >
          <Plus size={20} />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-thin">
        {!isCollapsed && (
          <div className="space-y-3 mb-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Chats</div>
              <div className="text-xs text-gray-400">{visibleSessions.length}</div>
            </div>
            <input
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        )}
        
        {visibleSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => handleSwitchChat(session.id)}
            className={cn(
              "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors relative",
              activeSessionId === session.id && location.pathname === '/chat'
                ? "bg-gray-100 dark:bg-gray-700 text-cyan-600 dark:text-cyan-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            )}
          >
            <MessageCircle size={20} className={cn("shrink-0", activeSessionId === session.id ? "text-cyan-500" : "text-gray-400")} />
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  {editingId === session.id ? (
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={commitEditing}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEditing();
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      className="w-full px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-sm"
                    />
                  ) : (
                    <>
                      <div className="truncate text-sm font-medium text-left">{session.title}</div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(session.lastUpdated).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                        {new Date(session.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={(e) => startEditing(e, session.id, session.title)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 transition-all"
                  title="Rename"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => handleDeleteChat(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
        
        {visibleSessions.length === 0 && !isCollapsed && (
            <div className="text-center text-gray-400 text-sm py-8">
                {sessions.length === 0 ? 'No chats yet' : 'No matches'}
            </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <button
          onClick={onOpenSettings}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl w-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          )}
        >
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
