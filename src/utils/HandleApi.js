import axios from "axios";

// ✅ Use environment variable for backend URL (fixes Issue #1)
const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // keeps cookie-based auth working
  headers: { 'Content-Type': 'application/json' },
});

// ---------------------------
// REQUEST INTERCEPTOR: Attach JWT if available
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
        alert('Session expired. Please log in again.');
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
    if (err.response?.status !== 401) alert("Failed to load tasks.");
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
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to add task";
    console.error("Add todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) alert(`Error: ${msg}`);
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
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to update task";
    console.error("Update todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) alert(`Error: ${msg}`);
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
    if (err.response?.status !== 401) alert("Failed to update task status");
    throw err;
  }
};

export const deleteToDo = async (todoId, setToDo) => {
  try {
    const response = await api.delete("/tasks/delete", { data: { id: todoId } });
    if (setToDo) await getAllToDo(setToDo);
    return response.data;
  } catch (err) {
    console.error("Delete todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) alert("Failed to delete task");
    throw err;
  }
};


// =====================
// AUTH API with JWT fallback
// =====================
export const registerUser = async (userData, callback) => {
  try {
    const res = await api.post("/auth/register", userData);
    alert(res.data.message);
    if (callback) callback(true);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Registration failed";
    alert(`Error: ${msg}`);
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

    alert(`Welcome back, ${firstName}!`);
    if (navigate) navigate("/dashboard");
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Login failed";
    alert(msg);
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
    if (navigate) navigate("/");
  }
};

export const verifyEmail = async (verificationData, setVerificationMode, navigate) => {
  try {
    const res = await api.post("/auth/verify", verificationData);

    // Store token if returned after verification
    if (res.data.token) localStorage.setItem('authToken', res.data.token);

    alert(res.data.message);
    if (setVerificationMode) setVerificationMode(false);
    if (navigate) navigate("/");
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Verification failed";
    alert(msg);
    throw err;
  }
};

export const resendVerificationCode = async (email) => {
  try {
    const res = await api.post("/auth/resend-code", { email });
    alert(res.data.message);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to resend code";
    alert(msg);
    throw err;
  }
};