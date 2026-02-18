import axios from "axios";
import { toast } from 'react-toastify';

// =====================
// Backend URL from .env
// =====================
const baseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // ✅ include cookies for session auth
  headers: { "Content-Type": "application/json" },
});

// =====================
// REQUEST INTERCEPTOR: attach JWT if available
// =====================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================
// RESPONSE INTERCEPTOR: handle 401 (Session expired only if logged in)
// =====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // ✅ check if token exists

    if (error.response?.status === 401 && token) {
      // Only alert if user had a valid token
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("authToken");

      if (!["/", "/login"].includes(window.location.pathname)) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/";
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
    setToDo?.(response.data);
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
    setFormState?.({
      text: "",
      ongoingDate: "",
      lastDate: "",
      priority: "Medium",
      emoji: "📅",
    });
    await getAllToDo(setToDo);
    navigate?.("/dashboard");
    toast.success("Task added successfully!");
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to add task";
    console.error("Add todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) toast.error(`Error: ${msg}`);
    throw err;
  }
};

export const updateToDo = async (todoData, setFormState, setToDo, setIsUpdating, navigate) => {
  try {
    const response = await api.put("/tasks/update", todoData);
    setFormState?.({
      text: "",
      ongoingDate: "",
      lastDate: "",
      priority: "Medium",
      emoji: "📅",
    });
    setIsUpdating?.(false);
    await getAllToDo(setToDo);
    navigate?.("/dashboard");
    toast.success("Task updated successfully!");
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to update task";
    console.error("Update todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) toast.error(`Error: ${msg}`);
    throw err;
  }
};

export const toggleComplete = async (todoData, setToDo) => {
  try {
    const response = await api.put("/tasks/update", todoData);
    await getAllToDo(setToDo);
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
    await getAllToDo(setToDo);
    toast.success("Task deleted");
    return response.data;
  } catch (err) {
    console.error("Delete todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) toast.error("Failed to delete task");
    throw err;
  }
};

// =====================
// AUTH API with Remember Me
// =====================

// registerUser now accepts setUser and rememberMe
export const registerUser = async (userData, callback, setUser, rememberMe = true) => {
  try {
    const res = await api.post("/auth/register", userData);
    toast.success(res.data.message);

    if (res.data.user) {
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      }
      setUser?.(res.data.user);
    }

    callback?.(true);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Registration failed";
    toast.error(`Error: ${msg}`);
    callback?.(false);
    throw err;
  }
};

// loginUser now accepts setUser, navigate, and rememberMe
export const loginUser = async (credentials, setUser, navigate, rememberMe = false) => {
  try {
    const res = await api.post("/auth/login", credentials);

    if (res.data.user) {
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      }
      setUser?.(res.data.user); // ✅ update AuthContext
    }

    if (res.data.token) {
      if (rememberMe) {
        localStorage.setItem("authToken", res.data.token);
      } else {
        sessionStorage.setItem("authToken", res.data.token);
      }
    }

    const firstName = res.data.user?.firstName || res.data.user?.name?.split(" ")[0] || "User";
    toast.success(`Welcome back, ${firstName}!`);
    navigate?.("/dashboard");
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Login failed";
    toast.error(msg);
    throw err;
  }
};

// logoutUser now clears both localStorage and sessionStorage
export const logoutUser = async (setUser, navigate) => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    setUser?.(null); // ✅ clear AuthContext
    toast.info("Logged out successfully");
    navigate?.("/");
  }
};

// verifyEmail now supports Remember Me and setting user context
export const verifyEmail = async (verificationData, setVerificationMode, navigate, setUser, rememberMe = true) => {
  try {
    const res = await api.post("/auth/verify", verificationData);

    const storage = rememberMe ? localStorage : sessionStorage;

    if (res.data.token) {
      storage.setItem("authToken", res.data.token);
    }

    if (res.data.user) {
      storage.setItem("user", JSON.stringify(res.data.user));
      setUser?.(res.data.user);
    }

<<<<<<< HEAD
    toast.success(res.data.message);
=======
    alert(res.data.message);
>>>>>>> 4b686ba (Update branding and fix Google OAuth verification flow)
    setVerificationMode?.(false);

    if (res.data.token) {
      navigate?.("/dashboard");
    } else {
      navigate?.("/");
    }

    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Verification failed";
    toast.error(msg);
    throw err;
  }
};

// resendVerificationCode remains unchanged
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

export default api;
