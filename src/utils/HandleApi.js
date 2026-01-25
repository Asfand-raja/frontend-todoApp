import axios from "axios";

// ✅ API URL from environment variables for production readiness
const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // important for cookies
});

// =====================
// Tasks API
// =====================
export const getAllToDo = async (setToDo) => {
  try {
    const response = await api.get("/tasks");
    if (setToDo) setToDo(response.data);
  } catch (err) {
    if (err.response?.status === 401) {
      alert("Session expired. Please log out and log back in.");
    }
    console.error("Error fetching todos:", err.response?.data || err.message);
  }
};

export const addToDo = async (todoData, setFormState, setToDo, navigate) => {
  try {
    await api.post("/tasks/save", todoData);
    if (setFormState) setFormState({});
    if (setToDo) getAllToDo(setToDo);
    if (navigate) navigate("/dashboard");
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to add task";
    alert(`Error: ${msg}`);
    console.error("Add todo error:", err.response?.data || err.message);
  }
};

export const updateToDo = async (todoData, setFormState, setToDo, setIsUpdating, navigate) => {
  try {
    await api.put("/tasks/update", todoData);
    if (setFormState) setFormState({});
    if (setIsUpdating) setIsUpdating(false);
    if (setToDo) getAllToDo(setToDo);
    if (navigate) navigate("/dashboard");
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to update task";
    alert(`Error: ${msg}`);
    console.error("Update todo error:", err.response?.data || err.message);
  }
};

export const toggleComplete = async (todoData, setToDo) => {
  try {
    await api.put("/tasks/update", todoData);
    if (setToDo) getAllToDo(setToDo);
  } catch (err) {
    console.error("Toggle complete error:", err.response?.data || err.message);
  }
};

export const deleteToDo = async (todoId, setToDo) => {
  try {
    await api.delete("/tasks/delete", { data: { id: todoId } });
    if (setToDo) getAllToDo(setToDo);
  } catch (err) {
    console.error("Delete todo error:", err.response?.data || err.message);
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
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Registration failed";
    alert(`Error: ${msg}`);
    if (callback) callback(false);
  }
};

export const loginUser = async (credentials, navigate) => {
  try {
    const res = await api.post("/auth/login", credentials);
    // ✅ Save user info to localStorage
    if (res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    alert(`Welcome back, ${res.data.user.firstName || (res.data.user.name ? res.data.user.name.split(' ')[0] : 'User')}!`);
    if (navigate) navigate("/dashboard");
  } catch (err) {
    const msg = err.response?.data?.message || "Login failed";
    alert(msg);
  }
};

export const verifyEmail = async (verificationData, setVerificationMode, navigate) => {
  try {
    const res = await api.post("/auth/verify", verificationData);
    alert(res.data.message);
    if (setVerificationMode) setVerificationMode(false);
    if (navigate) navigate("/");
  } catch (err) {
    const msg = err.response?.data?.message || "Verification failed";
    alert(msg);
  }
};

export const resendVerificationCode = async (email) => {
  try {
    const res = await api.post("/auth/resend-code", { email });
    alert(res.data.message);
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to resend code";
    alert(msg);
  }
};
