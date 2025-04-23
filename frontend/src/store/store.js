import { configureStore, createSlice } from '@reduxjs/toolkit';

// Helper to safely parse JSON
const parseJSON = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Initial user and token fetched from localStorage
const initialUser = parseJSON(localStorage.getItem('user'), null);
const initialToken = localStorage.getItem('token') || null;

// Initial state
const initialState = {
  user: initialUser || null,
  token: initialToken,
  userId: initialUser?.userId || null,
  role: initialUser ? 'user' : 'guest',
  isGuest: initialUser ? false : true, // Track guest status
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      const userId = user?.userId;

      if (!userId) return;

      state.user = user;
      state.token = token;
      state.userId = userId;
      state.role = 'user';
      state.isGuest = false; // User is authenticated, not a guest

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', 'user');

      console.log('[Redux] Logged in:', user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      state.role = 'guest';
      state.isGuest = true; // Now considered a guest user

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('isDark');

      console.log('[Redux] Logged out. Now guest.');
    },
    refreshToken: (state, action) => {
      state.token = action.payload.token;
    },
    setGuest: (state) => {
      const guestId = 'guest-' + Date.now(); // Create a unique guest ID

      state.user = {
        userId: guestId,
        username: 'Guest User',
        role: 'guest',
      };
      state.token = null;
      state.userId = guestId;
      state.role = 'guest';
      state.isGuest = true; // Mark as guest user

      console.log('[Redux] Guest user set:', guestId);
    }
  },
});

export const { login, logout, setGuest, refreshToken } = userSlice.actions;

// Configure store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;
