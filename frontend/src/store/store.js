import { configureStore, createSlice } from '@reduxjs/toolkit';

// Helper to safely parse JSON
const parseJSON = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Fetch initial values from localStorage safely
const initialUser = parseJSON(localStorage.getItem('user'), null);
const initialToken = localStorage.getItem('token') || null;

console.log('Parsed initial user:', initialUser);
console.log('Parsed initial token:', initialToken);

// Initial state for the user slice
const initialState = {
  user: initialUser || null,  // No guest user here
  role: initialUser ? 'user' : 'guest', // Default to guest if no user
  token: initialToken,
  userId: initialUser?.userId || null,
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;

      // Ensure the payload contains `userId`
      const userId = user?.userId;

      if (!userId) {
        console.error('Missing userId in login payload:', action.payload);
        return;
      }

      state.user = user;
      state.token = token;
      state.userId = user.userId || null;
      state.role = 'user';  // Set role to 'user' when logged in

      // Persist session data in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('role', 'user');  // Store role as 'user'
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      state.role = 'guest'; // Set role to 'guest' when logged out

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role'); // Remove role from localStorage
      localStorage.removeItem('isDark');
    },
    refreshToken: (state, action) => {
      state.token = action.payload.token;
    },
    setGuest: (state) => {
      // Set guest user data without persisting in localStorage
      state.user = {
        userId: 'guest-' + Date.now(),  // Temporary unique ID for guest
        username: 'Guest User',
        role: 'guest',
      };
      state.token = null; // No token for guest
      state.userId = state.user.userId;
      state.role = 'guest'; // Set role to 'guest'
    }
  },
});

// Export actions
export const { login, logout, setGuest } = userSlice.actions;

// Configure and export the store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;
