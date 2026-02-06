/**
 * Toast notification utility functions
 * Uses react-hot-toast for displaying notifications
 */

import toast from 'react-hot-toast';

/**
 * Display a success toast notification
 * @param message - The success message to display
 * @param duration - Optional duration in milliseconds (default: 3000)
 */
export const showSuccess = (message: string, duration: number = 3000) => {
  return toast.success(message, {
    duration,
    position: 'top-right',
    style: {
      background: '#10b981', // green-500
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#10b981',
    },
  });
};

/**
 * Display an error toast notification
 * @param message - The error message to display
 * @param duration - Optional duration in milliseconds (default: 4000)
 */
export const showError = (message: string, duration: number = 4000) => {
  return toast.error(message, {
    duration,
    position: 'top-right',
    style: {
      background: '#ef4444', // red-500
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#ef4444',
    },
  });
};

/**
 * Display an info toast notification
 * @param message - The info message to display
 * @param duration - Optional duration in milliseconds (default: 3000)
 */
export const showInfo = (message: string, duration: number = 3000) => {
  return toast(message, {
    duration,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3b82f6', // blue-500
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
    },
  });
};

/**
 * Display a loading toast notification
 * @param message - The loading message to display
 * @returns Toast ID that can be used to dismiss the toast
 */
export const showLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6b7280', // gray-500
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
    },
  });
};

/**
 * Dismiss a specific toast by ID
 * @param toastId - The ID of the toast to dismiss
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all active toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Display a promise-based toast that shows loading, success, or error states
 * @param promise - The promise to track
 * @param messages - Object containing loading, success, and error messages
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      position: 'top-right',
      style: {
        padding: '16px',
        borderRadius: '8px',
      },
    }
  );
};
