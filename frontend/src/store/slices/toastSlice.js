import { createSlice } from '@reduxjs/toolkit';

let toastId = 0;

const toastSlice = createSlice({
  name: 'toast',
  initialState: { toasts: [] },
  reducers: {
    addToast: (state, action) => {
      state.toasts.push({
        id: ++toastId,
        type: action.payload.type || 'info', // success | error | warning | info
        message: action.payload.message,
        duration: action.payload.duration || 3500,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;

// Helper shortcuts
export const toast = {
  success: (message, duration) => addToast({ type: 'success', message, duration }),
  error:   (message, duration) => addToast({ type: 'error',   message, duration }),
  warning: (message, duration) => addToast({ type: 'warning', message, duration }),
  info:    (message, duration) => addToast({ type: 'info',    message, duration }),
};