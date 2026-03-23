// =====================
// AUTH.JS - User Authentication
// =====================

const AUTH_KEY = 'phonestore_users';
const SESSION_KEY = 'phonestore_current_user';

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

  register(fullName, email, phone, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email này đã được sử dụng.' };
    }
    const newUser = {
      id: Date.now(),
      fullName,
      email,
      phone,
      password, // NOTE: In a real app, passwords must be hashed server-side (e.g., bcrypt). This localStorage-only demo stores passwords in plaintext for simplicity.
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveUsers(users);
    const { password: _, ...safeUser } = newUser;
    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Email hoặc mật khẩu không đúng.' };
    }
    const { password: _, ...safeUser } = user;
    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
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
    if (nameEl && user) nameEl.textContent = user.fullName;
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
