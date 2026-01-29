import axios from "axios";
import { toast } from 'react-toastify';

// ✅ Use environment variable for backend URL (fixes Issue #1)
const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ---------------------------
// REQUEST INTERCEPTOR
// ---------------------------
api.interceptors.request.use(
  (config) => {
    // Check both local and session storage (fixes Issue #7 - Remember Me)
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------
// RESPONSE INTERCEPTOR: Handle 401 errors
// ---------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear both storages
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('authToken');

      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// =====================
// TASK API
// =====================
export const getAllToDo = async (setToDo) => {
  try {
    const response = await api.get("/tasks");
    if (setToDo) setToDo(response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching todos:", err.response?.data || err.message);
    if (err.response?.status !== 401) toast.error("Failed to load tasks.");
    throw err;
  }
};

export const addToDo = async (todoData, setFormState, setToDo, navigate) => {
  try {
    const response = await api.post("/tasks/save", todoData);
    if (setFormState) {
      setFormState({ text: '', ongoingDate: '', lastDate: '', priority: 'Medium', emoji: '📅' });
    }
    if (setToDo) await getAllToDo(setToDo);
    if (navigate) navigate("/dashboard");
    toast.success("Task added successfully!");
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to add task";
    console.error("Add todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) toast.error(`Error: ${msg}`);
    throw err;
  }
};
export const updateToDo = async (todoData, setFormState, setToDo, setIsUpdating, navigate) => {
  try {
    const response = await api.put("/tasks/update", todoData);
    if (setFormState) setFormState({ text: '', ongoingDate: '', lastDate: '', priority: 'Medium', emoji: '📅' });
    if (setIsUpdating) setIsUpdating(false);
    if (setToDo) await getAllToDo(setToDo);
    if (navigate) navigate("/dashboard");
    toast.success("Task updated successfully!");
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to update task";
    console.error("Update todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) toast.error(`Error: ${msg}`);
    throw err;
  }
};

export const toggleComplete = async (todoData, setToDo) => {
  try {
    const response = await api.put("/tasks/update", todoData);
    if (setToDo) await getAllToDo(setToDo);
    return response.data;
  } catch (err) {
    console.error("Toggle complete error:", err.response?.data || err.message);
    if (err.response?.status !== 401) toast.error("Failed to update task status");
    throw err;
  }
};

export const deleteToDo = async (todoId, setToDo) => {
  try {
    const response = await api.delete("/tasks/delete", { data: { id: todoId } });
    if (setToDo) await getAllToDo(setToDo);
    toast.success("Task deleted");
    return response.data;
  } catch (err) {
    console.error("Delete todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) toast.error("Failed to delete task");
    throw err;
  }
};


// =====================
// AUTH API with JWT fallback
// =====================
export const registerUser = async (userData, callback) => {
  try {
    const res = await api.post("/auth/register", userData);
    toast.success(res.data.message);
    if (callback) callback(true);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Registration failed";
    toast.error(`Error: ${msg}`);
    if (callback) callback(false);
    throw err;
  }
};

export const loginUser = async (credentials, navigate, remember = true) => {
  try {
    const res = await api.post("/auth/login", credentials);

    const storage = remember ? localStorage : sessionStorage;

    // Store user info
    if (res.data.user) storage.setItem('user', JSON.stringify(res.data.user));

    // ✅ Store token if backend returns it
    if (res.data.token) storage.setItem('authToken', res.data.token);

    const firstName = res.data.user?.firstName ||
      (res.data.user?.name ? res.data.user.name.split(' ')[0] : 'User');

    toast.success(`Welcome back, ${firstName}!`);
    if (navigate) navigate("/dashboard");
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Login failed";
    toast.error(msg);
    throw err;
  }
};

export const logoutUser = async (navigate) => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    toast.info("Logged out successfully");
    if (navigate) navigate("/");
  }
};

export const verifyEmail = async (verificationData, setVerificationMode, navigate) => {
  try {
    const res = await api.post("/auth/verify", verificationData);

    // Store token and user if returned after verification (for Google flow)
    if (res.data.token) {
      localStorage.setItem('authToken', res.data.token);
      if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
    }

    toast.success(res.data.message);
    if (setVerificationMode) setVerificationMode(false);

    // Redirect to dashboard if logged in, otherwise go to home
    if (res.data.token && navigate) {
      navigate("/dashboard");
    } else if (navigate) {
      navigate("/");
    }
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Verification failed";
    toast.error(msg);
    throw err;
  }
};

export const resendVerificationCode = async (email) => {
  try {
    const res = await api.post("/auth/resend-code", { email });
    toast.success(res.data.message);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to resend code";
    toast.error(msg);
    throw err;
  }
};