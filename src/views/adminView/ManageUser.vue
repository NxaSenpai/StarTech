<template>
  <div class="page-wrapper">
    <div class="admin-layout">

      <!-- TOP BAR -->
      <header class="admin-header">
        <h2 class="logo-text">StarTech</h2>
      </header>

      <!-- SIDEBAR -->
      <aside class="sidebar">
        <nav class="nav-links">
          <a href="#" class="nav-item">Dashboard</a>
          <a href="#" class="nav-item">Manage Product</a>
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
          <div class="modal-content edit-modal">
            <button class="modal-close-icon" @click="closeModal">✕</button>
            
            <div class="modal-header">
              <img :src="editUser.profile" alt="Profile" class="profile-pic" />
              <h2 class="modal-title">User Details</h2>
            </div>

            <div class="modal-fields">
              <div class="form-group">
                <label>User ID:</label>
                <input v-model="editUser.id" class="modal-input" disabled />
              </div>

              <div class="form-group">
                <label>Name:</label>
                <input v-model="editUser.name" class="modal-input" />
              </div>

              <div class="form-group">
                <label>Email:</label>
                <input v-model="editUser.email" class="modal-input" disabled />
              </div>

              <div class="form-group">
                <label>Role:</label>
                <select v-model="editUser.role" class="modal-input">
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>

              <div class="form-group">
                <label>Joined Since:</label>
                <input v-model="editUser.joinSince" class="modal-input" disabled />
              </div>

              <div class="form-group">
                <label>Password:</label>
                <div class="password-row">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="editUser.password"
                    class="modal-input password-input"
                  />
                  <button class="reveal-btn" @click="showPassword = !showPassword">
                    {{ showPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="save-btn" @click="saveEdit">Save Changes</button>
              <button class="cancel-btn" @click="closeModal">Cancel</button>
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
  padding-left: 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-text {
  color: white;
  font-weight: bold;
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
  overflow-y: auto;
  height: calc(100vh - 70px);
}

.page-title {
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
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: #fff;
  color: #000000;
  padding: 0;
  border-radius: 16px;
  min-width: 420px;
  max-width: 90vw;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  position: relative;
  overflow: hidden;
}

.modal-close-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: 0.2s;
}

.modal-close-icon:hover {
  background: #f0f0f0;
  color: #333;
}

/* ===== EDIT MODAL ===== */
.edit-modal {
  padding: 40px 32px 32px 32px;
}

.modal-header {
  text-align: center;
  margin-bottom: 28px;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
  border: 3px solid #0b6cf0;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.modal-fields {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-input {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 15px;
  width: 100%;
  transition: 0.2s;
  font-family: inherit;
}

.modal-input:focus {
  outline: none;
  border-color: #0b6cf0;
  box-shadow: 0 0 0 3px rgba(11, 108, 240, 0.1);
}

.modal-input:disabled {
  background: #f5f5f5;
  color: #666;
  cursor: not-allowed;
}

.password-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.password-input {
  flex: 1;
}

.reveal-btn {
  background: #f0f0f0;
  border: 1px solid #ddd;
  color: #333;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  transition: 0.2s;
  white-space: nowrap;
}

.reveal-btn:hover {
  background: #e0e0e0;
  border-color: #bbb;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.save-btn {
  flex: 1;
  background: #0b6cf0;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: 0.2s;
}

.save-btn:hover {
  background: #084b9c;
  box-shadow: 0 4px 12px rgba(11, 108, 240, 0.3);
}

.cancel-btn {
  flex: 1;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: 0.2s;
}

.cancel-btn:hover {
  background: #eee;
  border-color: #bbb;
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