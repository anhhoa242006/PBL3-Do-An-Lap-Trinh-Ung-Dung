// =====================
// AUTH.JS - User Authentication
// =====================

const AUTH_KEY = 'phonestore_users';
const SESSION_KEY = 'phonestore_current_user';
const API_BASE = window.PHONESTORE_API_BASE || 'http://localhost:3000/api';

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

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
  },

  async register(fullName, email, phone, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Đăng ký thất bại.' };
      }
      this.setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Email hoặc mật khẩu không đúng.' };
      }
      this.setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  },

  logout() {
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
        adminLink.title = 'Quản trị';
        adminLink.textContent = '⚙️';
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
