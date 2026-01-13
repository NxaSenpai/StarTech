<template>
  <div class="page-wrapper">
    <div class="admin-layout">
      
      <AdminHeader :userName="adminName" :notificationCount="notifications" />
      
      <AdminSidebar @settings-click="handleSettingsClick" />

      <main class="content-area">
        <div class="top-row">
          <div class="breadcrumb">
            <span class="breadcrumb-item">Dashboard</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">Manage Users</span>
          </div>
        </div>

        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">User Management</h1>
            <p class="page-subtitle">View and manage registered users</p>
          </div>
        </div>

        <section class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon blue"><img class="manage-icon" src="/userIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Total Users</p>
              <h3 class="stat-value">{{ totalUsers }}</h3>
            </div>
          </div>
        </section>

        <section class="user-content">
          <div class="table-controls">
            <div class="search-box">
              <img src="/searchIcon.png" class="search-icon">
              <input 
                type="text" 
                placeholder="Search by User ID, Name, Email..." 
                v-model="searchQuery"
                class="search-input"
              >
            </div>
            <div class="filter-actions">
              <select v-model="sortBy" class="filter-select">
                <option value="uid">Sort by UID</option>
                <option value="recent">Recently Joined</option>
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
              </select>
              <button 
                v-if="selectedUserIds.length > 0" 
                class="btn btn-danger" 
                @click="bulkDeleteUsers"
              >
                <img src="/deleteIcon.png" class="btn-icon">
                Delete Selected ({{ selectedUserIds.length }})
              </button>
            </div>
          </div>
          
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th class="checkbox-col">
                    <input type="checkbox" v-model="selectAll" class="custom-checkbox">
                  </th>
                  <th>User ID</th>
                  <th>User Info</th>
                  <th>Email</th>
                  <th>Join Date</th>
                  <th class="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="empty-state">
                    <div class="empty-content">
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="user in filteredUsers" :key="user.id" class="table-row">
                  <td class="checkbox-col">
                    <input 
                      type="checkbox" 
                      :value="user.id" 
                      v-model="selectedUserIds"
                      class="custom-checkbox"
                    >
                  </td>
                  <td class="user-id-cell">
                    <span class="user-id">{{ user.id }}</span>
                  </td>
                  <td class="user-cell">
                    <div class="user-info">
                      <img :src="user.profile" :alt="user.name" class="user-avatar">
                      <span class="user-name">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="email-cell">{{ user.email }}</td>
                  <td class="date-cell">{{ user.joinSince }}</td>
                  <td class="action-cell">
                    <div class="action-buttons">
                      <button 
                        class="action-btn view-btn" 
                        @click="viewUserDetails(user)"
                        title="View Details"
                      >
                        <img class="btn-icon-black" src="/viewIcon.png" alt="">
                      </button>
                      <button 
                        class="action-btn delete-btn" 
                        @click="deleteUser(user.id)"
                        title="Delete"
                      >
                      <img class="btn-icon-black" src="/deleteIcon.png" alt="">
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
          <div class="modal-container">
            <div class="modal-header">
              <div>
                <h3>User Details</h3>
                <p class="modal-subtitle">View user information</p>
              </div>
              <button class="close-btn" @click="closeDetailsModal">✕</button>
            </div>
            <div class="modal-body">
              <div class="profile-section">
                <img :src="selectedUser.profile" :alt="selectedUser.name" class="profile-image">
              </div>

              <div class="details-section">
                <h4 class="section-title">Personal Information</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-content">
                      <span class="info-label">User ID</span>
                      <span class="info-value">{{ selectedUser.id }}</span>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-content">
                      <span class="info-label">Full Name</span>
                      <span class="info-value">{{ selectedUser.name }}</span>
                    </div>
                  </div>
                  
                  <div class="info-item full-width">
                    <div class="info-content">
                      <span class="info-label">Email Address</span>
                      <span class="info-value">{{ selectedUser.email }}</span>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-content">
                      <span class="info-label">Join Date</span>
                      <span class="info-value">{{ selectedUser.joinSince }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer"></div>
          </div>
        </div>

        <div v-if="toast.show && toast.type === 'success'" class="toast success-toast">
          <div class="toast-content">
            <span>{{ toast.message }}</span>
          </div>
        </div>

        <div v-if="toast.show && toast.type === 'error'" class="toast error-toast">
          <div class="toast-content">
            <span>{{ toast.message }}</span>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import AdminHeader from '@/components/AdminHeader.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  name: 'ManageUser',
  components: {
    AdminHeader,
    AdminSidebar
  },
  setup() {
    const adminName = ref('Admin');
    const notifications = ref(3);
    const searchQuery = ref('');
    const sortBy = ref('uid');
    const showDetailsModal = ref(false);
    const selectedUser = ref(null);
    const users = ref([]);
    const selectedUserIds = ref([]);
    const isLoading = ref(false);

    const toast = ref({
      show: false,
      type: 'success',
      message: ''
    });

    const showToast = (type, message, duration = 3000) => {
      toast.value = {
        show: true,
        type,
        message
      };
      setTimeout(() => {
        toast.value.show = false;
      }, duration);
    };

    async function fetchUsers() {
      isLoading.value = true;
      try {
        const response = await axios.get(`${API_URL}/users`, {
          params: { role: 'user' }
        });
        console.log('Users loaded:', response.data);
        
        users.value = response.data.map(user => ({
          id: user._id || 'N/A',
          name: user.name,
          email: user.email,
          joinSince: user.joinSince,
          profile: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=0b6cf0&color=fff',
          totalOrders: 0,
          totalSpent: '0.00',
          reviews: 0
        }));
        
        console.log('Mapped users:', users.value);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        showToast('error', 'Failed to load users. Please check your connection.');
      } finally {
        isLoading.value = false;
      }
    }

    const selectAll = computed({
      get: () => selectedUserIds.value.length === filteredUsers.value.length && filteredUsers.value.length > 0,
      set: (value) => {
        selectedUserIds.value = value ? filteredUsers.value.map(u => u.id) : [];
      }
    });

    const totalUsers = computed(() => users.value.length);

    const filteredUsers = computed(() => {
      let filtered = users.value;

      if (searchQuery.value) {
        filtered = filtered.filter(u => 
          u.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      if (sortBy.value === 'uid') {
        filtered = [...filtered].sort((a, b) => a.id.localeCompare(b.id));
      } else if (sortBy.value === 'name') {
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy.value === 'email') {
        filtered = [...filtered].sort((a, b) => a.email.localeCompare(b.email));
      } else if (sortBy.value === 'recent') {
        filtered = [...filtered].sort((a, b) => 
          new Date(b.joinSince) - new Date(a.joinSince)
        );
      }

      return filtered;
    });

    function viewUserDetails(user) {
      selectedUser.value = user;
      showDetailsModal.value = true;
    }

    function closeDetailsModal() {
      showDetailsModal.value = false;
      selectedUser.value = null;
    }

    async function deleteUser(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await axios.delete(`${API_URL}/users/${id}`);
          showToast('success', 'User deleted successfully!');
          await fetchUsers();
        } catch (error) {
          console.error('Delete failed:', error);
          showToast('error', 'Failed to delete user');
        }
      }
    }

    async function bulkDeleteUsers() {
      const count = selectedUserIds.value.length;
      if (count === 0) {
        showToast('error', 'Please select at least one user to delete.');
        return;
      }

      if (confirm(`Are you sure you want to delete ${count} selected user(s)?`)) {
        try {
          await axios.post(`${API_URL}/users/bulk-delete`, {
            ids: selectedUserIds.value
          });
          showToast('success', `${count} user(s) deleted successfully!`);
          selectedUserIds.value = [];
          await fetchUsers();
        } catch (error) {
          console.error('Bulk delete failed:', error);
          showToast('error', 'Failed to delete users');
        }
      }
    }

    function handleSettingsClick() {
      console.log('Settings clicked');
    }

    onMounted(() => {
      console.log('ManageUser mounted, fetching users...');
      fetchUsers();
    });

    return {
      adminName,
      notifications,
      searchQuery,
      sortBy,
      showDetailsModal,
      selectedUser,
      users,
      selectedUserIds,
      selectAll,
      totalUsers,
      filteredUsers,
      isLoading,
      toast,
      viewUserDetails,
      closeDetailsModal,
      deleteUser,
      bulkDeleteUsers,
      handleSettingsClick
    };
  }
};
</script>

<style scoped>
.page-wrapper {
  background: #f8f9fa;
  min-height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
}

.admin-layout {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 70px 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
}

.content-area {
  color: black;
  grid-area: content;
  padding: 30px 40px;
  overflow: hidden;
  height: calc(100vh - 70px);
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.top-row {
  flex-shrink: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.breadcrumb-item {
  color: #6c757d;
}

.breadcrumb-item.active {
  color: #0b6cf0;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #dee2e6;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-shrink: 0;
}

.header-left .page-title {
  color: #111;
  font-weight: 700;
  font-size: 28px;
  margin: 0 0 8px 0;
}

.page-subtitle {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #0b6cf0;
  color: white;
}

.btn-primary:hover {
  background: #0958c9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(11, 108, 240, 0.3);
}

.btn-secondary {
  background: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-icon {
  width: 15px;
  height: 15px;
  filter: invert(1);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  flex-shrink: 0;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(11, 108, 240, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.blue { background: #e6f0ff; }
.stat-icon.green { background: #d4edda; }
.stat-icon.orange { background: #fff3e0; }
.stat-icon.purple { background: #f3e5f5; }

.stat-label {
  color: #6c757d;
  font-size: 13px;
  margin: 0 0 4px 0;
}

.stat-value {
  color: #212529;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.manage-icon{
  width: 20px;
  height: 20px;
}

.user-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-shrink: 0;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  width: 15px;
  height: 15px;
  filter: opacity(0.6);
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #0b6cf0;
  box-shadow: 0 0 0 3px rgba(11, 108, 240, 0.1);
}

.filter-actions {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.table-wrapper {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f8f9fa;
}

td {
  padding: 16px;
  border-top: 1px solid #e9ecef;
  font-size: 14px;
  color: #495057;
}

tbody {
  background: white;
}

.table-row:hover {
  background: #f8f9fa;
}

.checkbox-col {
  width: 50px;
}

.action-col {
  width: 120px;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0b6cf0;
}

.user-id-cell {
  font-weight: 600;
  color: #0b6cf0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.user-name {
  font-weight: 500;
  color: #212529;
}

.email-cell {
  color: #6c757d;
  font-size: 15px;
}

.date-cell {
  color: #495057;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-icon-black {
  width: 15px;
  height: 15px;
}

.view-btn:hover {
  border-color: #0b6cf0;
  background: #e6f0ff;
}

.delete-btn:hover {
  border-color: #dc3545;
  background: #ffebee;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-content p {
  color: #6c757d;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #212529;
}

.modal-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #6c757d;
  font-weight: normal;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f8f9fa;
}

.modal-body {
  padding: 24px;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 24px;
  position: relative;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.details-section {
  margin-bottom: 30px;
}

.details-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}


.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: #212529;
  font-weight: 500;
}

.activity-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.activity-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #0b6cf0;
  border-radius: 12px;
  color: white;
  text-align: center;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-value {
  font-size: 24px;
  font-weight: 700;
}

.activity-label {
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
}

.toast {
  position: fixed;
  top: 100px;
  right: 30px;
  z-index: 3000;
  animation: slideIn 0.4s ease-out;
  min-width: 300px;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-content {
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: white;
}

.success-toast .toast-content {
  background: #28a745;
}

.error-toast .toast-content {
  background: #dc3545;
}

@media (max-width: 768px) {
  .toast {
    right: 10px;
    left: 10px;
    min-width: auto;
  }
}
</style>