import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addMessage, setMemory, setLoading, setError, clearChat, createSession, updateActiveSessionTitle, addMessageToSession, updateSessionTitle } from '../store/chatSlice';
import Layout from '../components/Layout';
import MessageBubble from '../components/MessageBubble';
import { sendMessageToN8N, formatCurrentChat } from '../services/api';
import { cn } from '../utils/cn';

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const chatState = useSelector((state: RootState) => state.chat);
  const sessions = chatState?.sessions ?? [];
  const activeSessionId = chatState?.activeSessionId ?? null;
  const memory = chatState?.memory ?? '';
  const isLoading = chatState?.isLoading ?? false;
  const error = chatState?.error ?? null;
  const user = useSelector((state: RootState) => state.user);
  
  const [inputValue, setInputValue] = useState('');
  const [isMemoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession ? activeSession.messages : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const content = inputValue.trim();
    setInputValue('');

    let sessionId = activeSessionId;
    if (!sessionId) {
      const action = dispatch(createSession());
      sessionId = (action as any)?.payload?.id || null;
    }
    if (!sessionId) {
      dispatch(setError('Unable to create a new chat session.'));
      return;
    }

    // Add User Message
    const userMsg = { role: 'user' as const, content, timestamp: Date.now() };
    dispatch(addMessage(userMsg));

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const currentChatHistory = formatCurrentChat([...messages, userMsg]);
      const chatListTitles = sessions.map(s => s.title).join(', ');
      
      const payload = {
        User_Message: content,
        Session_ID: sessionId!,
        Chat_Title: activeSession?.title || 'New Chat',
        Username: user.username || 'User',
        About: user.about,
        Email: user.email,
        Custom_instructions: user.customInstructions,
        Current_Chat: currentChatHistory,
        Memory: memory,
        Chat_List: chatListTitles
      };

      const response = await sendMessageToN8N(payload);
      
      console.log("N8N Response:", response);

      const normalizeResponse = (value: unknown): unknown => {
        if (typeof value !== 'string') return value;
        const trimmed = value.trim();
        if (!trimmed) return value;
        try {
          return JSON.parse(trimmed);
        } catch {
          return value;
        }
      };

      const getFromObject = (obj: any, key: string): unknown => {
        if (!obj || typeof obj !== 'object') return undefined;
        return obj[key];
      };

      const getFirstMatch = (value: any, key: string): unknown => {
        if (Array.isArray(value)) {
          for (const item of value) {
            const found = getFromObject(item, key);
            if (found !== undefined) return found;
          }
          return undefined;
        }
        return getFromObject(value, key);
      };

      const normalized = normalizeResponse(response);
      const responseSessionId =
        getFirstMatch(normalized, 'Session_ID') ??
        getFirstMatch(normalized, 'session_id') ??
        getFirstMatch(normalized, 'sessionId');
      const aiContentCandidate =
        getFirstMatch(normalized, 'reply') ??
        getFirstMatch(normalized, 'output') ??
        getFirstMatch(normalized, 'text') ??
        getFirstMatch(normalized, 'response') ??
        getFirstMatch(normalized, 'message') ??
        "I received your message but couldn't generate a text response.";

      const nextMemoryCandidate =
        getFirstMatch(normalized, 'Memory') ??
        getFirstMatch(normalized, 'memory') ??
        getFirstMatch(normalized, 'updated_memory');
      if (typeof nextMemoryCandidate === 'string') dispatch(setMemory(nextMemoryCandidate));

      const nextTitleCandidate =
        getFirstMatch(normalized, 'chat-title') ??
        getFirstMatch(normalized, 'chat_title');
      if (typeof nextTitleCandidate === 'string' && nextTitleCandidate.trim().length > 0) {
        const newTitle = nextTitleCandidate.trim();
        if (typeof responseSessionId === 'string' && responseSessionId && responseSessionId !== sessionId) {
          dispatch(updateSessionTitle({ sessionId: responseSessionId, title: newTitle }));
        } else {
          dispatch(updateActiveSessionTitle(newTitle));
        }
      }

      const assistantMsg = {
        role: 'assistant' as const,
        content: typeof aiContentCandidate === 'string' ? aiContentCandidate : JSON.stringify(aiContentCandidate),
        timestamp: Date.now()
      };
      if (typeof responseSessionId === 'string' && responseSessionId && responseSessionId !== sessionId) {
        dispatch(addMessageToSession({ sessionId: responseSessionId, message: assistantMsg }));
      } else {
        dispatch(addMessage(assistantMsg));
      }

    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 404) {
          dispatch(setError("N8N test webhook isn't registered right now. In test mode you must click 'Execute workflow' and the test URL usually works for one call."));
        } else if (status === 500) {
          dispatch(setError('N8N returned a 500 error. Check the workflow execution logs for details.'));
        } else if (err.message === 'Network Error') {
          dispatch(setError('Network error calling N8N. If running locally, ensure the dev server is restarted so the proxy is active.'));
        } else {
          dispatch(setError(`Request failed${status ? ` (HTTP ${status})` : ''}. Please try again.`));
        }
      } else {
        dispatch(setError('Failed to connect to the AI agent. Please try again.'));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!activeSessionId && sessions.length > 0) {
      return (
          <Layout>
              <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                      <Loader2 className="animate-spin mx-auto mb-4" />
                      <p>Loading chat...</p>
                  </div>
              </div>
          </Layout>
      )
  }

  return (
    <Layout>
      <div className="flex h-full">
        <div className={cn("flex-1 flex flex-col min-w-0", isMemoryOpen ? "mr-0" : "")}>
          {messages.length > 0 && (
          <div className="border-b border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-dark-bg/50 backdrop-blur-sm">
            <div className="mx-auto w-full max-w-4xl px-4 md:px-8 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {activeSession?.title || 'New Chat'}
                  </div>
                  <div className="text-xs text-gray-500">Neura</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    dispatch(clearChat());
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
          )}

          <div className="flex-1 overflow-y-auto scroll-smooth">
            {messages.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="w-full max-w-2xl px-4 md:px-8 text-center">
                  <div className="text-6xl md:text-7xl font-semibold text-gray-900 dark:text-white mb-6">
                    Neura
                  </div>
                  <div className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-10">
                    What&apos;s on your mind today?
                  </div>
                  <form onSubmit={handleSend} className="relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask anything"
                      className="w-full pl-5 pr-14 py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 shadow-sm"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Send"
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                  </form>
                  {error && (
                    <div className="mt-4 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <MessageBubble key={idx} {...msg} />
                ))}
              </>
            )}

            {isLoading && (
              <div className="mx-auto w-full max-w-4xl px-4 md:px-8 py-4 text-gray-400 text-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Neura is thinking...
              </div>
            )}

            {messages.length > 0 && error && (
              <div className="mx-auto w-full max-w-4xl px-4 md:px-8 py-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-800">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-dark-bg/50 backdrop-blur-sm">
            <div className="mx-auto w-full max-w-4xl px-4 md:px-8 py-4">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message Neura..."
                  className="w-full pl-4 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 outline-none transition-all shadow-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
              <div className="text-[11px] text-gray-400 mt-2">
                Neura can make mistakes. Consider checking important information.
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Memory editing is only available in Settings now; removed from Chat */}
      </div>
    </Layout>
  );
};

export default Chat;
