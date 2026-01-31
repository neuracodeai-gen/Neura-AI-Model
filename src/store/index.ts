import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import userReducer from './userSlice';
import chatReducer from './chatSlice';

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
});

const migratePersistedState = async (state: any) => {
  if (!state) return state;

  const chat = state.chat;
  if (!chat) return state;

  if (Array.isArray(chat.sessions)) return state;

  if (Array.isArray(chat.messages)) {
    const legacyMessages = chat.messages;
    const firstUser = legacyMessages.find((m: any) => m?.role === 'user' && typeof m?.content === 'string');
    const titleBase = typeof firstUser?.content === 'string' && firstUser.content.trim().length > 0 ? firstUser.content.trim() : 'Legacy Chat';
    const title = titleBase.slice(0, 30) + (titleBase.length > 30 ? '...' : '');
    const id = `legacy-${Date.now()}`;

    return {
      ...state,
      chat: {
        sessions: [
          {
            id,
            title,
            messages: legacyMessages,
            lastUpdated: Date.now(),
          },
        ],
        activeSessionId: id,
        memory: typeof chat.memory === 'string' ? chat.memory : '',
        isLoading: false,
        error: null,
      },
    };
  }

  return {
    ...state,
    chat: {
      sessions: [],
      activeSessionId: null,
      memory: typeof chat.memory === 'string' ? chat.memory : '',
      isLoading: false,
      error: null,
    },
  };
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'chat'], // persist both user and chat
  version: 2,
  migrate: migratePersistedState,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
