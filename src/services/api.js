import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// On 401, clear user so we don't show "Failed to load" toasts on every protected request
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      try {
        localStorage.removeItem("user");
      } catch (_) {}
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

/** Use before showing "Failed to load" toasts so we don't spam when session expired */
export function shouldShowLoadError(err) {
  if (!err) return false;
  if (err.response?.status === 401) return false;
  if (err.response?.status === 404) return false;
  return true;
}

export default API;
