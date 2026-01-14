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
            <span class="breadcrumb-item active">Manage Admins</span>
          </div>
        </div>

        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">Admin Management</h1>
            <p class="page-subtitle">View and manage admin accounts</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" @click="showAddModal = true">
              <img src="/addIcon.png" class="btn-icon">
              Add Admin
            </button>
          </div>
        </div>

        <section class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon blue"><img class="manage-icon" src="/adminIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Total Admins</p>
              <h3 class="stat-value">{{ totalAdmins }}</h3>
            </div>
          </div>
        </section>

        <section class="admin-content">
          <div class="table-controls">
            <div class="search-box">
              <img src="/searchIcon.png" class="search-icon">
              <input 
                type="text" 
                placeholder="Search by Admin ID, Name, Email..." 
                v-model="searchQuery"
                class="search-input"
              >
            </div>
            <div class="filter-actions">
              <select v-model="sortBy" class="filter-select">
                <option value="id">Sort by ID</option>
                <option value="recent">Recently Added</option>
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
              </select>
              <button 
                v-if="selectedAdminIds.length > 0" 
                class="btn btn-danger" 
                @click="bulkDeleteAdmins"
              >
                <img src="/deleteIcon.png" class="btn-icon">
                Delete Selected ({{ selectedAdminIds.length }})
              </button>
            </div>
          </div>
          
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th class="checkbox-col">
                    <input 
                      type="checkbox" 
                      class="custom-checkbox"
                      v-model="selectAll"
                    >
                  </th>
                  <th>Admin ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Join Date</th>
                  <th class="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="6" class="empty-state">
                    <div class="empty-content">
                      <p>Loading admins...</p>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="filteredAdmins.length === 0">
                  <td colspan="6" class="empty-state">
                    <div class="empty-content">
                      <p>No admins found</p>
                    </div>
                  </td>
                </tr>
                <tr v-else v-for="admin in filteredAdmins" :key="admin.id" class="table-row">
                  <td class="checkbox-col">
                    <input 
                      type="checkbox" 
                      class="custom-checkbox"
                      :value="admin.id"
                      v-model="selectedAdminIds"
                    >
                  </td>
                  <td class="admin-id-cell">{{ admin.id }}</td>
                  <td class="name-cell">
                    <div class="admin-name-wrapper">
                      <div class="avatar-placeholder">{{ getInitials(admin.name) }}</div>
                      <span class="admin-name">{{ admin.name }}</span>
                    </div>
                  </td>
                  <td class="email-cell">{{ admin.email }}</td>
                  <td class="date-cell">{{ admin.joinDate }}</td>
                  <td class="action-col">
                    <div class="action-buttons">
                      <button class="action-btn edit-btn" @click="editAdmin(admin)" title="Edit">
                        <img src="/editIcon.png" class="btn-icon-black" alt="Edit">
                      </button>
                      <button class="action-btn delete-btn" @click="deleteAdmin(admin.id)" title="Delete">
                        <img src="/deleteIcon.png" class="btn-icon-black" alt="Delete">
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
          <div class="modal-container small-modal">
            <div class="modal-header">
              <div>
                <h3>{{ isEditing ? 'Edit Admin' : 'Add New Admin' }}</h3>
                <p class="modal-subtitle">{{ isEditing ? 'Update admin information' : 'Create a new admin account' }}</p>
              </div>
              <button class="close-btn" @click="closeAddModal">✕</button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveAdmin" class="admin-form">
                <div class="form-group">
                  <label class="form-label">Full Name <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="formData.name" 
                    class="form-input"
                    placeholder="Enter full name"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Email Address <span class="required">*</span></label>
                  <input 
                    type="email" 
                    v-model="formData.email" 
                    class="form-input"
                    placeholder="Enter email address"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Password <span class="required">*</span></label>
                  <div class="password-input-wrapper">
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      v-model="formData.password" 
                      class="form-input"
                      :placeholder="isEditing ? 'Leave blank to keep current password' : 'Enter password'"
                      :required="!isEditing"
                    >
                    <button 
                      type="button" 
                      class="toggle-password" 
                      @click="showPassword = !showPassword"
                    >
                      {{ showPassword ? 'Hide' : 'Show' }}
                    </button>
                  </div>
                  <small class="form-hint">{{ isEditing ? 'Leave blank to keep current password' : 'Minimum 8 characters' }}</small>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" @click="closeAddModal">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary">
                    {{ isEditing ? 'Update Admin' : 'Add Admin' }}
                  </button>
                </div>
              </form>
            </div>
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
  name: 'ManageAdmin',
  components: {
    AdminHeader,
    AdminSidebar
  },
  setup() {
    const adminName = ref('Super Admin');
    const notifications = ref(3);
    const searchQuery = ref('');
    const sortBy = ref('id');
    const showAddModal = ref(false);
    const showPassword = ref(false);
    const isEditing = ref(false);
    const isLoading = ref(false);

    const admins = ref([]);

    const selectedAdminIds = ref([]);
    
    const formData = ref({
      id: '',
      name: '',
      email: '',
      password: '',
      joinDate: '',
      role: 'admin'
    });

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

    async function fetchAdmins() {
      isLoading.value = true;
      try {
        const [adminResponse, superadminResponse] = await Promise.all([
          axios.get(`${API_URL}/users`, { params: { role: 'admin' } }),
          axios.get(`${API_URL}/users`, { params: { role: 'superadmin' } })
        ]);

        console.log('Admins loaded:', adminResponse.data);
        console.log('Super admins loaded:', superadminResponse.data);

        const allAdmins = [...adminResponse.data, ...superadminResponse.data];
        
        admins.value = allAdmins.map(admin => ({
          id: admin._id,
          name: admin.name,
          email: admin.email,
          password: '********',
          joinDate: admin.joinSince,
          role: admin.role === 'superadmin' ? 'Super Admin' : 'Admin'
        }));

        console.log('Mapped admins:', admins.value);
      } catch (error) {
        console.error('Failed to fetch admins:', error);
        showToast('error', 'Failed to load admins. Please check your connection.');
      } finally {
        isLoading.value = false;
      }
    }

    const selectAll = computed({
      get: () => selectedAdminIds.value.length === filteredAdmins.value.length && filteredAdmins.value.length > 0,
      set: (value) => {
        selectedAdminIds.value = value ? filteredAdmins.value.map(a => a.id) : [];
      }
    });

    const totalAdmins = computed(() => admins.value.length);
    
    const activeAdmins = computed(() => admins.value.length);

    const newThisMonth = computed(() => {
      const currentMonth = new Date().toISOString().slice(0, 7);
      return admins.value.filter(a => a.joinDate && a.joinDate.startsWith(currentMonth)).length;
    });

    const superAdmins = computed(() =>
      admins.value.filter(a => a.role === 'Super Admin').length
    );

    const filteredAdmins = computed(() => {
      let filtered = admins.value;

      if (searchQuery.value) {
        filtered = filtered.filter(a => 
          a.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          a.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          a.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      if (sortBy.value === 'id') {
        filtered = [...filtered].sort((a, b) => a.id.localeCompare(b.id));
      } else if (sortBy.value === 'name') {
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy.value === 'email') {
        filtered = [...filtered].sort((a, b) => a.email.localeCompare(b.email));
      } else if (sortBy.value === 'recent') {
        filtered = [...filtered].sort((a, b) => 
          new Date(b.joinDate) - new Date(a.joinDate)
        );
      }

      return filtered;
    });

    function getInitials(name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }

    function editAdmin(admin) {
      isEditing.value = true;
      formData.value = { ...admin, password: '' };
      showAddModal.value = true;
    }

    async function saveAdmin() {
      if (!formData.value.name.trim() || !formData.value.email.trim()) {
        showToast('error', 'Name and email are required!');
        return;
      }

      try {
        if (isEditing.value) {
          const updateData = {
            email: formData.value.email,
            name: formData.value.name
          };

          if (formData.value.password && formData.value.password.trim()) {
            updateData.password = formData.value.password;
          }

          await axios.patch(`${API_URL}/user`, updateData);
          showToast('success', 'Admin updated successfully!');
        } else {
          const signupData = {
            name: formData.value.name,
            email: formData.value.email,
            password: formData.value.password,
            role: formData.value.role === 'Super Admin' ? 'superadmin' : 'admin'
          };

          await axios.post(`${API_URL}/signup`, signupData);
          showToast('success', 'Admin added successfully!');
        }
        
        await fetchAdmins();
        closeAddModal();
      } catch (error) {
        console.error('Save failed:', error);
        const errorMsg = error.response?.data?.message || 'Failed to save admin. Please try again.';
        showToast('error', errorMsg);
      }
    }

    function closeAddModal() {
      showAddModal.value = false;
      isEditing.value = false;
      showPassword.value = false;
      formData.value = {
        id: '',
        name: '',
        email: '',
        password: '',
        joinDate: '',
        role: 'admin'
      };
    }

    async function deleteAdmin(id) {
      if (confirm('Are you sure you want to delete this admin?')) {
        try {
          await axios.delete(`${API_URL}/users/${id}`);
          showToast('success', 'Admin deleted successfully!');
          await fetchAdmins();
        } catch (error) {
          console.error('Delete failed:', error);
          showToast('error', 'Failed to delete admin');
        }
      }
    }

    async function bulkDeleteAdmins() {
      const count = selectedAdminIds.value.length;
      if (count === 0) {
        showToast('error', 'Please select at least one admin to delete.');
        return;
      }

      if (confirm(`Are you sure you want to delete ${count} selected admin(s)?`)) {
        try {
          await axios.post(`${API_URL}/users/bulk-delete`, {
            ids: selectedAdminIds.value
          });
          showToast('success', `${count} admin(s) deleted successfully!`);
          selectedAdminIds.value = [];
          await fetchAdmins();
        } catch (error) {
          console.error('Bulk delete failed:', error);
          showToast('error', 'Failed to delete admins');
        }
      }
    }

    function handleSettingsClick() {
      console.log('Settings clicked');
    }

    onMounted(() => {
      console.log('ManageAdmin mounted, fetching admins...');
      fetchAdmins();
    });

    return {
      adminName,
      notifications,
      searchQuery,
      sortBy,
      showAddModal,
      showPassword,
      isEditing,
      admins,
      selectedAdminIds,
      formData,
      toast,
      selectAll,
      totalAdmins,
      activeAdmins,
      newThisMonth,
      superAdmins,
      filteredAdmins,
      isLoading,
      getInitials,
      editAdmin,
      saveAdmin,
      closeAddModal,
      deleteAdmin,
      bulkDeleteAdmins,
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

.manage-icon {
  width: 20px;
  height: 20px;
}

.admin-content {
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

.admin-id-cell {
  font-weight: 600;
  color: #0b6cf0;
}

.admin-name-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.admin-name {
  font-weight: 500;
  color: #212529;
}

.email-cell {
  color: #6c757d;
  font-size: 15px;
}

.password-cell {
  color: #6c757d;
}

.password-hidden {
  letter-spacing: 2px;
  font-size: 16px;
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

.edit-btn:hover {
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
  max-width: 500px;
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

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #212529;
}

.required {
  color: #dc3545;
}

.form-input {
    width: 80%;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #0b6cf0;
  box-shadow: 0 0 0 3px rgba(11, 108, 240, 0.1);
}

.password-input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  width: 50px;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 13px;
  padding: 5px;
  border-color: rgb(185, 184, 184);
  border-radius: 5px;
  border-width: 1px;
}

.form-hint {
  font-size: 12px;
  color: #6c757d;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
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

@media (max-width: 1200px) {
  .admin-layout {
    grid-template-columns: 220px 1fr;
  }
}

@media (max-width: 968px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
  }

  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .content-area {
    padding: 20px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  table {
    font-size: 12px;
  }

  th, td {
    padding: 12px 8px;
  }
}
</style>