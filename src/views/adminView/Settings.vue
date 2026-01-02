<template>
  <div class="page-wrapper">
    <div class="admin-layout">
      
      <AdminHeader :userName="adminName" />
      
      <AdminSidebar />

      <main class="content-area">
        <!-- Breadcrumb -->
        <div class="top-row">
          <div class="breadcrumb">
            <span class="breadcrumb-item">Dashboard</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">Settings</span>
          </div>
        </div>

        <!-- Page Header -->
        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">Settings</h1>
            <p class="page-subtitle">Manage your account and application preferences</p>
          </div>
        </div>

        <!-- Settings Content -->
        <div class="settings-container">
          <!-- Profile Settings -->
          <section class="settings-section">
            <div class="section-header">
              <div class="header-content">
                <h3 class="section-title">Profile Settings</h3>
                <p class="section-description">Update your personal information</p>
              </div>
            </div>
            
            <div class="settings-card">
              <form @submit.prevent="saveProfile" class="settings-form">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input 
                      type="text" 
                      v-model="profile.name" 
                      class="form-input"
                      placeholder="Enter your full name"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input 
                      type="email" 
                      v-model="profile.email" 
                      class="form-input"
                      placeholder="Enter your email"
                      required
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Role</label>
                  <input 
                    type="text" 
                    v-model="profile.role" 
                    class="form-input"
                    disabled
                  >
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </section>

          <section class="settings-section">
            <div class="section-header">
              <div class="header-content">
                <h3 class="section-title">Account Actions</h3>
                <p class="section-description">Manage your account</p>
              </div>
            </div>
            
            <div class="settings-card">
              <div class="account-actions">
                <div class="action-item">
                  <div class="action-info">
                    <div class="action-content">
                      <h4 class="action-title">Logout</h4>
                      <p class="action-description">Sign out from your account and go to the main login page</p>
                    </div>
                  </div>
                  <button @click="handleLogout" class="btn btn-danger">Logout</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div v-if="showLogoutModal" class="modal-overlay" @click.self="showLogoutModal = false">
          <div class="modal-container small-modal">
            <div class="modal-header">
              <div>
                <h3>Confirm Logout</h3>
                <p class="modal-subtitle">Are you sure you want to logout?</p>
              </div>
              <button class="close-btn" @click="showLogoutModal = false">✕</button>
            </div>
            <div class="modal-body">
              <div class="logout-warning">
                <p>You will be signed out from your account and redirected to the login page.</p>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="showLogoutModal = false">Cancel</button>
              <button class="btn btn-danger" @click="confirmLogout">Yes, Logout</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminHeader from '@/components/AdminHeader.vue';
import AdminSidebar from '@/components/adminSidebar.vue';

export default {
  name: 'Settings',
  components: {
    AdminHeader,
    AdminSidebar
  },
  setup() {
    const router = useRouter();
    const adminName = ref('Admin');
    const showLogoutModal = ref(false);

    const profile = ref({
      name: 'John Doe',
      email: 'john@startech.com',
      role: 'Super Admin'
    });

    onMounted(() => {
      const savedProfile = localStorage.getItem('admin-profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        profile.value = { ...profile.value, ...parsed };
      }
    });

    function saveProfile() {
      localStorage.setItem('admin-profile', JSON.stringify(profile.value));
    }

    function handleLogout() {
      showLogoutModal.value = true;
    }

    function confirmLogout() {
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-profile');
      
      showLogoutModal.value = false;
      
      router.push('/login');
    }

    return {
      adminName,
      profile,
      showLogoutModal,
      saveProfile,
      handleLogout,
      confirmLogout
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
  overflow-y: auto;
  height: calc(100vh - 70px);
  background: #f8f9fa;
}

.top-row {
  margin-bottom: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
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
  margin-bottom: 30px;
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

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 900px;
}

.settings-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.section-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 4px 0;
}

.section-description {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

.settings-card {
  padding: 24px;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.form-input {
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  background: white;
  color: #212529;
}

.form-input:focus {
  outline: none;
  border-color: #0b6cf0;
  box-shadow: 0 0 0 3px rgba(11, 108, 240, 0.1);
}

.form-input:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
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

.account-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s;
}

.action-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.action-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}


.action-content {
  flex: 1;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 4px 0;
}

.action-description {
  font-size: 14px;
  color: #6c757d;
  margin: 2px 0;
}

.action-description strong {
  color: #212529;
  font-weight: 600;
}

/* Modal Styles */
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

.logout-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 20px;
  background: #fff3cd;
  border-radius: 8px;
  border: 1px solid #ffc107;
}

.logout-warning p {
  color: #856404;
  margin: 0;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .content-area {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .action-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .action-item .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>