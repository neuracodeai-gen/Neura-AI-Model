import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  username: string;
  email: string;
  password?: string; // Optional for security display, but needed for storage as per requirements
  about: string;
  customInstructions: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  username: '',
  email: '',
  password: '',
  about: '',
  customInstructions: '',
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload, isAuthenticated: true };
    },
    updateProfile: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    logout: () => initialState,
  },
});

export const { setUser, updateProfile, logout } = userSlice.actions;
export default userSlice.reducer;
