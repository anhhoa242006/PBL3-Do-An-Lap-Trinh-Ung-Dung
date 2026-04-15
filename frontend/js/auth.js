// =====================
// AUTH.JS - User Authentication
// =====================

const AUTH_KEY = 'phonestore_users';
const SESSION_KEY = 'phonestore_current_user';
const TOKEN_KEY = 'phonestore_token';
const API_TIMEOUT_MS = 12000;
const API_BASE = window.PHONESTORE_API_BASE
  || (typeof window.getApiBase === 'function' ? window.getApiBase() : null)
  || localStorage.getItem('phonestore_api_base')
  || 'http://localhost:5000/api';

async function requestJson(path, body) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), API_TIMEOUT_MS)
    : null;

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
      signal: controller ? controller.signal : undefined,
    });

    const rawText = await response.text();
    let data = {};

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { message: rawText };
      }
    }

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || `Yêu cầu thất bại (${response.status}).`,
      };
    }

    return data;
  } catch (error) {
    if (error?.name === 'AbortError') {
      return { success: false, message: `Kết nối tới backend bị quá thời gian chờ (${API_BASE}).` };
    }

    return {
      success: false,
      message: `Không thể kết nối tới backend tại ${API_BASE}. Hãy kiểm tra backend đã chạy và CORS đã được bật.`,
    };
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

const Auth = {
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY)) || [];
    } catch {
      return [];
    }
  },

  saveUsers(users) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY) || null;
  },

  setCurrentUser(user, token) {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      if (token) localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
  },

  getAuthHeaders() {
    return { 'Content-Type': 'application/json' };
  },

  async register(fullName, email, phone, password) {
    const data = await requestJson('/auth/register', { fullName, email, phone, password });
    if (!data.success) {
      return data;
    }

    this.setCurrentUser(data.user, data.token);
    return { success: true, user: data.user };
  },

  async login(email, password) {
    const data = await requestJson('/auth/login', { email, password });
    if (!data.success) {
      return data;
    }

    this.setCurrentUser(data.user, data.token);
    return { success: true, user: data.user };
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore network errors and still clear local session
    }
    this.setCurrentUser(null);
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },
};


// Update header auth buttons across all pages
function updateAuthUI() {
  const user = Auth.getCurrentUser();
  const authBtns = document.querySelectorAll('.header-auth-btn');
  const userMenus = document.querySelectorAll('.header-user-menu');

  authBtns.forEach(btn => {
    btn.style.display = user ? 'none' : '';
  });
  userMenus.forEach(menu => {
    menu.style.display = user ? '' : 'none';
    const nameEl = menu.querySelector('.user-name');
    if (nameEl && user) {
      const role = user.role ? ` · ${user.role}` : '';
      nameEl.textContent = `${user.fullName}${role}`;
    }

    if (user) {
      const isAdmin = ['Admin', 'Staff'].includes(user.role);
      let adminLink = menu.querySelector('.admin-link');
      if (!adminLink) {
        adminLink = document.createElement('a');
        adminLink.href = 'admin.html';
        adminLink.className = 'header-btn admin-link';
        adminLink.title = 'Trang quản trị cửa hàng';
        adminLink.setAttribute('aria-label', 'Trang quản trị cửa hàng');
        adminLink.textContent = '⚙️ Quản trị';
        menu.appendChild(adminLink);
      }
      adminLink.style.display = isAdmin ? '' : 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();

  // Logout button handler (present on all pages via header)
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
      window.location.href = 'index.html';
    });
  });
});

window.addEventListener('authChanged', updateAuthUI);
