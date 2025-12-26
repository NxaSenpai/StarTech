<template>
  <div class="page-wrapper">
    <div class="admin-layout">

      <!-- TOP BAR -->
      <header class="admin-header">
        <img class ="logo-img" src="/logo.png" alt="">
      </header>

      <!-- SIDEBAR -->
      <aside class="sidebar">
        <nav class="nav-links">
          <router-link to="/dashboard" class="nav-item">Dashboard</router-link>
          <router-link to="/manageproduct" class="nav-item">Manage Product</router-link>
          <router-link to="/manageorder" class="nav-item">Manage Orders</router-link>
          <a href="#" class="nav-item active">Manage Users</a>
        </nav>
        <div class="settings">
          <a href="#" class="nav-item">Setting</a>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="content-area">
        <div class="top-row">
          <h1 class="page-title">Manage Users</h1>
          <div class="search-box">
            <input
              type="text"
              placeholder="Search by User ID, Name, Email"
              class="search-input"
              v-model="search"
            >
          </div>
        </div>

        <div class="layout-grid">
          <!-- TABLE -->
          <div class="user-table-box">
            <div class="table-header">
              <span>User ID</span>
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Join Since</span>
            </div>
            <div
              class="table-row"
              v-for="user in filteredUsers"
              :key="user.id"
              @click="showDetails(user)"
              style="cursor: pointer;"
            >
              <span>{{ user.id }}</span>
              <span>{{ user.name }}</span>
              <span>{{ user.email }}</span>
              <span :class="['role', user.role.toLowerCase()]">{{ user.role }}</span>
              <span>{{ user.joinSince }}</span>
            </div>
          </div>

          <!-- STATS -->
          <div class="stats-dashboard">
            <div class="stat-card blue">
              <p>Total Users:</p>
              <h2>{{ totalUsers }}</h2>
            </div>
            <div class="stat-card orange">
              <p>Admins:</p>
              <h2>{{ adminCount }}</h2>
            </div>
            <div class="stat-card green">
              <p>Users:</p>
              <h2>{{ userCount }}</h2>
            </div>
          </div>
        </div>

        <!-- User Details Modal -->
        <div v-if="selectedUser" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content modern-modal">
            <button class="modal-close-icon" @click="closeModal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            
            <div class="modal-header">
              <div class="profile-container">
                <img :src="editUser.profile" alt="Profile" class="profile-pic" />
                <div class="status-badge" :class="editUser.role.toLowerCase()">
                  {{ editUser.role }}
                </div>
              </div>
              <h2 class="modal-title">{{ editUser.name }}</h2>
              <p class="modal-subtitle">Member since {{ editUser.joinSince }}</p>
            </div>

            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    User ID
                  </label>
                  <input v-model="editUser.id" class="modal-input" disabled />
                </div>

                <div class="form-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
                    </svg>
                    Full Name
                  </label>
                  <input v-model="editUser.name" class="modal-input editable" />
                </div>

                <div class="form-group full-width">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Email Address
                  </label>
                  <input v-model="editUser.email" class="modal-input" disabled />
                </div>

                <div class="form-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Role
                  </label>
                  <select v-model="editUser.role" class="modal-input editable">
                    <option value="Admin">Administrator</option>
                    <option value="User">Regular User</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    Join Date
                  </label>
                  <input v-model="editUser.joinSince" class="modal-input" disabled />
                </div>

                <div class="form-group full-width">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                    Password
                  </label>
                  <div class="password-container">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      v-model="editUser.password"
                      class="modal-input editable password-input"
                    />
                    <button class="password-toggle" @click="showPassword = !showPassword">
                      <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeModal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Cancel
              </button>
              <button class="btn btn-primary" @click="saveEdit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const users = ref([
  {
    id: 'U001',
    name: 'Alice',
    email: 'alice@mail.com',
    role: 'Admin',
    joinSince: '2023-01-10',
    profile: 'https://randomuser.me/api/portraits/women/1.jpg',
    password: 'alice123'
  },
  {
    id: 'U002',
    name: 'Bob',
    email: 'bob@mail.com',
    role: 'User',
    joinSince: '2023-03-15',
    profile: 'https://randomuser.me/api/portraits/men/2.jpg',
    password: 'bob456'
  },
  {
    id: 'U003',
    name: 'Charlie',
    email: 'charlie@mail.com',
    role: 'User',
    joinSince: '2024-02-20',
    profile: 'https://randomuser.me/api/portraits/men/3.jpg',
    password: 'charlie789'
  },
  {
    id: 'U004',
    name: 'Dara',
    email: 'dara@mail.com',
    role: 'Admin',
    joinSince: '2022-11-05',
    profile: 'https://randomuser.me/api/portraits/women/4.jpg',
    password: 'dara321'
  },
  {
    id: 'U005',
    name: 'Eve',
    email: 'eve@mail.com',
    role: 'User',
    joinSince: '2024-06-01',
    profile: 'https://randomuser.me/api/portraits/women/5.jpg',
    password: 'eve654'
  },
]);

const search = ref('');
const selectedUser = ref(null);
const editUser = ref({});
const showPassword = ref(false);

const showDetails = (user) => {
  selectedUser.value = user;
  editUser.value = { ...user }; // shallow copy for editing
  showPassword.value = false;
};

const saveEdit = () => {
  Object.assign(selectedUser.value, editUser.value);
  closeModal();
};

const closeModal = () => {
  selectedUser.value = null;
  editUser.value = {};
  showPassword.value = false;
};

const filteredUsers = computed(() =>
  users.value.filter(u =>
    u.id.toLowerCase().includes(search.value.toLowerCase()) ||
    u.name.toLowerCase().includes(search.value.toLowerCase()) ||
    u.email.toLowerCase().includes(search.value.toLowerCase())
  )
);

const totalUsers = computed(() => users.value.length);
const adminCount = computed(() => users.value.filter(u => u.role === 'Admin').length);
const userCount = computed(() => users.value.filter(u => u.role === 'User').length);
</script>

<style scoped>
.page-wrapper {
  background: #ffffff;
  min-height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
}

.admin-layout {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 70px 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
  border-radius: 0;
}

.admin-header {
  grid-area: header;
  background: #0b6cf0;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-img {
  scale: .4;
  margin-left: -90px;
  filter: brightness(0) invert(1);
}

.sidebar {
  grid-area: sidebar;
  border-right: 1px solid #eee;
  padding: 20px;
  background: white;
  position: sticky;
  top: 70px;
  height: calc(100vh - 70px);
}

.nav-item {
  display: block;
  padding: 12px;
  margin: 5px 0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
}
.nav-item.active {
  background: #e6f0ff;
  color: #0b6cf0;
}

.content-area {
  padding: 40px;
color: #000000;
  overflow-y: auto;
  height: calc(100vh - 70px);
}

.page-title {
  font-size: 24px;
  color: #111;
  font-weight: 700;
}

.search-box input {
  margin-top: 10px;
  border: 1px solid #ddd;
  padding: 10px 15px;
  width: 350px;
  border-radius: 8px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 30px;
  margin-top: 25px;
  align-items: start;
}

/* ===== TABLE ===== */
.user-table-box {
  color: #000000;
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 700px;
  overflow-y: auto;
  background: white;
  border-radius: 10px;
  border: 1px solid #eee;
  position: relative;
}

.table-header {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  padding: 15px 20px;
  border-radius: 10px 10px 0 0;
  align-items: center;
  background: #e0e0e0;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 2;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  padding: 15px 20px;
  align-items: center;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

.table-row:hover {
  background: #eef4ff;
  transition: 0.2s ease;
}

/* ===== ROLE ===== */
.role {
  position: relative;
  padding: 6px 12px;
  border-radius: 20px;
  width: fit-content;
  cursor: pointer;
}
.role.admin {
  color: #0b6cf0;
}
.role.user {
  color: green;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modern-modal {
  scale: .95;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  color: #1a202c;
  padding: 0;
  border-radius: 10px;
  min-width: 520px;
  max-width: 90vw;
  max-height: 100vh;
  overflow-y: auto;
  box-shadow: 
    0 25px 50px -12px rgba(0,0,0,0.25),
    0 0 0 1px rgba(255,255,255,0.05);
  position: relative;
  transform: scale(0.95);
  animation: modalIn 0.3s ease-out forwards;
}

@keyframes modalIn {
  to { transform: scale(1); }
}

.modal-close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255,255,255,0.9);
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #64748b;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.2s;
  z-index: 10;
}

.modal-close-icon:hover {
  background: #fee2e2;
  color: #dc2626;
  transform: scale(1.05);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 32px 32px 32px;
  text-align: center;
  position: relative;
}

.profile-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.profile-pic {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255,255,255,0.3);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.status-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 2px solid white;
}

.status-badge.admin {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.status-badge.user {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: white;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.modal-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.modal-body {
  padding: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: none;
  letter-spacing: normal;
}

.form-group label svg {
  color: #6b7280;
}

.modal-input {
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  font-size: 15px;
  transition: all 0.2s;
  font-family: inherit;
  background: #ffffff;
}

.modal-input.editable {
  border-color: #d1d5db;
}

.modal-input.editable:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.modal-input:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.password-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  flex: 1;
  padding-right: 50px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.password-toggle:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-footer {
  padding: 24px 32px 32px 32px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
}

.btn-secondary {
  background: #ffffff;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.39);
}

.btn-primary:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .modern-modal {
    min-width: 95vw;
    margin: 20px;
    border-radius: 16px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
}

/* ===== STATS ===== */
.stats-dashboard {
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-card {
  padding: 15px;
  border-radius: 10px;
  border: 2px solid;
}

.stat-card.blue {
  border-color: #0b6cf0;
  color: #0b6cf0;
}

.stat-card.orange {
  border-color: orange;
  color: orange;
}

.stat-card.green {
  border-color: green;
  color: green;
}
</style>