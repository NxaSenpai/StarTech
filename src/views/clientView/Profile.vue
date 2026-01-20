<template>
  <div class="profile-page">
    <Header />

    <transition
      enter-active-class="alert-enter-active"
      enter-from-class="alert-enter-from"
      enter-to-class="alert-enter-to"
      leave-active-class="alert-leave-active"
      leave-from-class="alert-leave-from"
      leave-to-class="alert-leave-to"
    >
      <div v-if="showAlert" class="alert-container">
        <div class="alert-content" :class="alertType">
          <div class="alert-icon">
          </div>
          <p class="alert-message">{{ alertMessage }}</p>
          <button @click="showAlert = false" class="alert-close">
          </button>
        </div>
      </div>
    </transition>

    <main class="main-content">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/home">Home</router-link>
          <span class="separator">/</span>
          <span class="current">My Profile</span>
        </div>

        <div class="page-header">
          <h1 class="page-title">My Profile</h1>
          <p class="page-subtitle">Manage your account settings and preferences</p>
        </div>

        <div v-if="isLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading profile...</p>
        </div>

        <div v-else class="profile-layout">
          <aside class="profile-sidebar">
            <nav class="profile-nav">
              <button
                v-for="item in menuItems"
                :key="item.id"
                @click="activeTab = item.id"
                class="nav-button"
                :class="{ active: activeTab === item.id }"
              >
                <component :is="item.icon" class="nav-icon" />
                <span>{{ item.label }}</span>
              </button>
            </nav>
          </aside>

          <div class="profile-content">
            <!-- Profile Tab -->
            <div v-show="activeTab === 'profile'" class="content-section">
              <div class="profile-card">
                <div class="card-header">
                  <h2 class="card-title">Profile Information</h2>
                  <button 
                    v-if="!isEditingBasic" 
                    @click="handleEditBasic" 
                    class="edit-btn"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                </div>

                <div class="profile-header">
                  <div class="avatar-section">
                    <div class="avatar-wrapper">
                      <div v-if="uploadingImage" class="profile-avatar uploading">
                        <div class="upload-spinner"></div>
                      </div>
                      <div v-else-if="profile.profileImage" class="profile-avatar-image">
                        <img :src="profile.profileImage" alt="Profile" class="profile-img">
                      </div>
                      <div v-else class="profile-avatar">
                        {{ userInitial }}
                      </div>
                      
                      <input 
                        v-if="isEditingBasic"
                        type="file" 
                        ref="fileInput"
                        @change="onAvatarChange" 
                        accept="image/*"
                        class="file-input"
                        id="avatarInput"
                      />
                    </div>
                  </div>
                </div>

                <div class="info-grid">
                  <div class="info-item">
                    <label class="info-label">Full Name</label>
                    <input 
                      v-if="isEditingBasic"
                      v-model="editedProfile.name"
                      type="text"
                      class="info-input"
                      placeholder="Enter your full name"
                    />
                    <p v-else class="info-value">{{ profile.name || 'Not set' }}</p>
                  </div>

                  <div class="info-item">
                    <label class="info-label">Email Address</label>
                    <p class="info-value">{{ profile.email || 'Not set' }}</p>
                  </div>
                </div>

                <div v-if="isEditingBasic" class="form-actions">
                  <button @click="handleCancelBasic" class="btn btn-secondary" :disabled="isSaving || uploadingImage">
                    Cancel
                  </button>
                  <button @click="handleSaveBasic" class="btn btn-primary" :disabled="isSaving || uploadingImage">
                    <span v-if="isSaving">Saving...</span>
                    <span v-else>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Security Tab -->
            <div v-show="activeTab === 'security'" class="content-section">
              <div class="profile-card">
                <div class="card-header">
                  <h2 class="card-title">Change Password</h2>
                </div>

                <div class="security-form">
                  <div class="info-item">
                    <label class="info-label">Current Password</label>
                    <input 
                      v-model="passwordForm.currentPassword"
                      type="password"
                      class="info-input"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div class="info-item">
                    <label class="info-label">New Password</label>
                    <input 
                      v-model="passwordForm.newPassword"
                      type="password"
                      class="info-input"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div class="info-item">
                    <label class="info-label">Confirm New Password</label>
                    <input 
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      class="info-input"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div class="form-actions">
                    <button @click="handlePasswordChange" class="btn btn-primary" :disabled="isSaving">
                      <span v-if="isSaving">Updating...</span>
                      <span v-else>Update Password</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="profile-card">
                <div class="card-header">
                  <h2 class="card-title">Account Actions</h2>
                </div>

                <div class="security-actions">
                  <button @click="handleLogout" class="logout-btn">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import { UserIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  name: 'UserProfile',
  components: {
    Header,
    Footer,
    UserIcon,
    ShieldCheckIcon
  },
  data() {
    return {
      activeTab: 'profile',
      isEditingBasic: false,
      isLoading: true,
      isSaving: false,
      uploadingImage: false,
      showAlert: false,
      alertMessage: '',
      alertType: 'success',
      profile: {
        name: '',
        email: '',
        role: '',
        createdAt: '',
        profileImage: ''
      },
      editedProfile: {
        name: '',
        profileImage: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      menuItems: [
        { 
          id: 'profile', 
          label: 'Profile Information',
          icon: UserIcon
        },
        { 
          id: 'security', 
          label: 'Security',
          icon: ShieldCheckIcon
        }
      ]
    };
  },
  computed: {
    userInitial() {
      if (this.profile.name) {
        return this.profile.name.charAt(0).toUpperCase();
      }
      if (this.profile.email) {
        return this.profile.email.charAt(0).toUpperCase();
      }
      return 'U';
    }
  },
  methods: {
    showAlertMessage(message, type = 'success') {
      this.alertMessage = message;
      this.alertType = type;
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 3500);
    },

    formatRole(role) {
      if (!role) return 'User';
      if (role === 'superadmin') return 'Super Admin';
      if (role === 'admin') return 'Admin';
      return 'User';
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return 'N/A';
      }
    },

    async loadProfile() {
      this.isLoading = true;
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          this.$router.push('/login');
          return;
        }

        const user = JSON.parse(userData);
        if (!user.email) {
          this.$router.push('/login');
          return;
        }

        const response = await axios.get(`${API_URL}/user`, {
          params: { email: user.email }
        });

        this.profile = {
          name: response.data.name || '',
          email: response.data.email || '',
          role: response.data.role || 'user',
          createdAt: response.data.createdAt || '',
          profileImage: response.data.profileImage || ''
        };

        console.log('Profile loaded:', this.profile);
      } catch (error) {
        console.error('Failed to load profile:', error);
        this.showAlertMessage('Failed to load profile data', 'error');
        
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          this.profile = {
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'user',
            createdAt: '',
            profileImage: user.profileImage || ''
          };
        }
      } finally {
        this.isLoading = false;
      }
    },

    handleEditBasic() {
      this.isEditingBasic = true;
      this.editedProfile = {
        name: this.profile.name,
        profileImage: this.profile.profileImage
      };
    },

    async onAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        this.showAlertMessage('Please select an image file', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showAlertMessage('Image size should be less than 5MB', 'error');
        return;
      }

      this.uploadingImage = true;

      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data && response.data.path) {
          this.editedProfile.profileImage = `${API_URL}/${response.data.path}`;
          this.showAlertMessage('Image uploaded successfully!', 'success');
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
        this.showAlertMessage('Failed to upload image. Please try again.', 'error');
      } finally {
        this.uploadingImage = false;
      }
    },

    async handleSaveBasic() {
      if (!this.editedProfile.name || !this.editedProfile.name.trim()) {
        this.showAlertMessage('Name cannot be empty', 'error');
        return;
      }

      this.isSaving = true;
      try {
        const updateData = {
          email: this.profile.email,
          name: this.editedProfile.name.trim()
        };

        if (this.editedProfile.profileImage !== this.profile.profileImage) {
          updateData.profileImage = this.editedProfile.profileImage;
        }

        await axios.patch(`${API_URL}/user`, updateData);

        this.profile.name = this.editedProfile.name.trim();
        this.profile.profileImage = this.editedProfile.profileImage;

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.name = this.profile.name;
        userData.profileImage = this.profile.profileImage;
        localStorage.setItem('user', JSON.stringify(userData));
        
        window.dispatchEvent(new CustomEvent('user-changed', { 
          detail: userData 
        }));

        this.isEditingBasic = false;
        this.showAlertMessage('Profile updated successfully!', 'success');
      } catch (error) {
        console.error('Failed to update profile:', error);
        this.showAlertMessage('Failed to update profile. Please try again.', 'error');
      } finally {
        this.isSaving = false;
      }
    },

    handleCancelBasic() {
      this.editedProfile = {
        name: this.profile.name,
        profileImage: this.profile.profileImage
      };
      this.isEditingBasic = false;
    },

    async handlePasswordChange() {
      if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
        this.showAlertMessage('All password fields are required', 'error');
        return;
      }

      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.showAlertMessage('New passwords do not match', 'error');
        return;
      }

      if (this.passwordForm.newPassword.length < 3) {
        this.showAlertMessage('Password must be at least 3 characters', 'error');
        return;
      }

      this.isSaving = true;
      try {
        await axios.patch(`${API_URL}/user`, {
          email: this.profile.email,
          password: this.passwordForm.newPassword
        });

        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };

        this.showAlertMessage('Password updated successfully!', 'success');
      } catch (error) {
        console.error('Failed to update password:', error);
        this.showAlertMessage('Failed to update password. Please try again.', 'error');
      } finally {
        this.isSaving = false;
      }
    },

    handleLogout() {
      localStorage.removeItem('user');
      
      window.dispatchEvent(new CustomEvent('user-changed', { 
        detail: {} 
      }));
      
      this.showAlertMessage('You have been signed out.', 'success');
      
      setTimeout(() => {
        this.$router.push('/login');
      }, 1000);
    }
  },

  mounted() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadProfile();
  }
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.main-content {
  width: 100%;
  flex: 1;
  padding: 40px 0 80px;
}

.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  overflow: hidden;
}

.breadcrumb {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #2563eb;
}

.separator {
  color: #cbd5e1;
}

.current {
  color: #1e293b;
  font-weight: 500;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #64748b;
  font-size: 16px;
}

.alert-container {
  position: fixed;
  top: 100px;
  right: 24px;
  z-index: 10000;
  min-width: 320px;
  max-width: 400px;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
}

.alert-content.success {
  border-left-color: #10b981;
}

.alert-content.error {
  border-left-color: #ef4444;
}

.alert-icon {
  flex-shrink: 0;
}

.alert-content.success .alert-icon {
  color: #10b981;
}

.alert-content.error .alert-icon {
  color: #ef4444;
}

.alert-message {
  flex: 1;
  margin: 0;
  color: #1e293b;
  font-size: 14px;
  font-weight: 500;
}

.alert-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s;
}

.alert-close:hover {
  background: #f1f5f9;
  color: #64748b;
}

.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.alert-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.alert-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.alert-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.profile-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;
}

.profile-sidebar {
  position: sticky;
  top: 180px;
}

.profile-nav {
  background: white;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: none;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.nav-button:hover {
  background: #f8fafc;
  color: #3b82f6;
}

.nav-button.active {
  background: #3b82f6;
  color: white;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.profile-header {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 48px;
  font-weight: 700;
  border: 4px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-avatar.uploading {
  background: #f1f5f9;
}

.upload-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.profile-avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-input {
  display: none;
}

.avatar-overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.avatar-overlay:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.info-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  color: #1e293b;
  transition: all 0.3s;
  background: white;
}

.info-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.security-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 500px;
}

.security-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: white;
  color: #ef4444;
  border: 2px solid #ef4444;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  justify-content: center;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    position: static;
  }

  .profile-nav {
    display: flex;
    overflow-x: auto;
    gap: 8px;
  }

  .nav-button {
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px 0 60px;
  }

  .page-title {
    font-size: 2rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .profile-card {
    padding: 24px 20px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .edit-btn {
    width: 100%;
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .alert-container {
    right: 16px;
    left: 16px;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .avatar-wrapper {
    width: 120px;
    height: 120px;
  }

  .profile-avatar {
    font-size: 42px;
  }
}
</style>