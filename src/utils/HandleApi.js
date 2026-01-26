import axios from "axios";

// ✅ Your Railway backend URL
const baseUrl = "https://fullstack-todoapp-backend-production.up.railway.app";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // CRITICAL: This sends cookies with every request
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored user data
      localStorage.removeItem('user');
      // Redirect to login
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/';
        alert('Session expired. Please log in again.');
      }
    }
    return Promise.reject(error);
  }
);

// =====================
// Tasks API
// =====================
export const getAllToDo = async (setToDo) => {
  try {
    const response = await api.get("/tasks");
    if (setToDo) setToDo(response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching todos:", err.response?.data || err.message);
    if (err.response?.status !== 401) {
      alert("Failed to load tasks. Please try again.");
    }
    throw err;
  }
};

export const addToDo = async (todoData, setFormState, setToDo, navigate) => {
  try {
    const response = await api.post("/tasks/save", todoData);
    if (setFormState) {
      setFormState({
        text: '',
        ongoingDate: '',
        lastDate: '',
        priority: 'Medium',
        emoji: '📅',
      });
    }
    if (setToDo) await getAllToDo(setToDo);
    if (navigate) navigate("/dashboard");
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to add task";
    console.error("Add todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) {
      alert(`Error: ${msg}`);
    }
    throw err;
  }
};

export const updateToDo = async (todoData, setFormState, setToDo, setIsUpdating, navigate) => {
  try {
    const response = await api.put("/tasks/update", todoData);
    if (setFormState) {
      setFormState({
        text: '',
        ongoingDate: '',
        lastDate: '',
        priority: 'Medium',
        emoji: '📅',
      });
    }
    if (setIsUpdating) setIsUpdating(false);
    if (setToDo) await getAllToDo(setToDo);
    if (navigate) navigate("/dashboard");
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to update task";
    console.error("Update todo error:", err.response?.data || err.message);
    if (err.response?.status !== 401) {
      alert(`Error: ${msg}`);
    }
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
    if (err.response?.status !== 401) {
      alert("Failed to update task status");
    }
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
    if (err.response?.status !== 401) {
      alert("Failed to delete task");
    }
    throw err;
  }
};

// =====================
// Auth API
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

export const loginUser = async (credentials, navigate) => {
  try {
    const res = await api.post("/auth/login", credentials);
    
    // ✅ Store user info in localStorage for display purposes only
    // Authentication is handled by session cookies from the backend
    if (res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    
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
    // Call backend logout endpoint to clear session
    await api.post("/auth/logout");
    localStorage.removeItem('user');
    if (navigate) navigate("/");
  } catch (err) {
    console.error("Logout error:", err);
    // Clear local data even if backend call fails
    localStorage.removeItem('user');
    if (navigate) navigate("/");
  }
};

export const verifyEmail = async (verificationData, setVerificationMode, navigate) => {
  try {
    const res = await api.post("/auth/verify", verificationData);
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