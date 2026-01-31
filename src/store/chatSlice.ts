import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

export interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  memory: string;
  isLoading: boolean;
  error: string | null;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialState: ChatState = {
  sessions: [],
  activeSessionId: null,
  memory: '',
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createSession: {
      reducer: (state, action: PayloadAction<{ id: string; title: string }>) => {
        const newSession: ChatSession = {
          id: action.payload.id,
          title: action.payload.title,
          messages: [],
          lastUpdated: Date.now(),
        };
        state.sessions.unshift(newSession);
        state.activeSessionId = newSession.id;
      },
      prepare: (title?: string) => ({
        payload: {
          id: generateId(),
          title: title || 'New Chat',
        },
      }),
    },
    switchSession: (state, action: PayloadAction<string>) => {
      state.activeSessionId = action.payload;
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload);
      if (state.activeSessionId === action.payload) {
        state.activeSessionId = state.sessions.length > 0 ? state.sessions[0].id : null;
      }
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const session = state.sessions.find(s => s.id === state.activeSessionId);
      if (session) {
        session.messages.push(action.payload);
        session.lastUpdated = Date.now();
        
        // Auto-generate title from first message if it's "New Chat"
        if (session.title === 'New Chat' && action.payload.role === 'user') {
          session.title = action.payload.content.slice(0, 30) + (action.payload.content.length > 30 ? '...' : '');
        }
      }
    },
    setMemory: (state, action: PayloadAction<string>) => {
      state.memory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearChat: (state) => {
      const session = state.sessions.find(s => s.id === state.activeSessionId);
      if (session) {
        session.messages = [];
      }
    },
    updateActiveSessionTitle: (state, action: PayloadAction<string>) => {
      const session = state.sessions.find(s => s.id === state.activeSessionId);
      if (session) {
        session.title = action.payload;
        session.lastUpdated = Date.now();
      }
    },
    addMessageToSession: (state, action: PayloadAction<{ sessionId: string; message: Message }>) => {
      const session = state.sessions.find(s => s.id === action.payload.sessionId);
      if (session) {
        session.messages.push(action.payload.message);
        session.lastUpdated = Date.now();
      }
    },
    updateSessionTitle: (state, action: PayloadAction<{ sessionId: string; title: string }>) => {
      const session = state.sessions.find(s => s.id === action.payload.sessionId);
      if (session) {
        session.title = action.payload.title;
        session.lastUpdated = Date.now();
      }
    }
  },
});

export const { 
  createSession, 
  switchSession, 
  deleteSession, 
  addMessage, 
  setMemory, 
  setLoading, 
  setError, 
  clearChat,
  updateActiveSessionTitle,
  addMessageToSession,
  updateSessionTitle
} = chatSlice.actions;

export default chatSlice.reducer;
