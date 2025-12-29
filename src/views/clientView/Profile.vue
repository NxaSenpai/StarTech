<template>
  <div class="page">
    <Header class="site-header" />

    <main class="main-content">
      <div class="container">
        <h2 class="profile-label">My Profile</h2>

        <div class="profile-grid">
          <aside class="profile-card">
            <div class="avatar">
              <template v-if="profile.avatar && profile.avatar.length">
                <img :src="profile.avatar" alt="Avatar" />
              </template>
              <template v-else>
                <div class="avatar-inner">{{ initial }}</div>
              </template>
            </div>
            <button @click="handleEdit" class="btn btn-outline">Edit</button>
          </aside>

          <section class="profile-info">
            <div class="info-list">
              <div class="info-row">
                <div class="label">Name</div>
                <div class="value">
                  <input v-if="isEditing" type="text" v-model="editedProfile.name" class="input" />
                  <span v-else class="text">{{ profile.name }}</span>
                </div>
              </div>

              <div class="info-row">
                <div class="label">Email</div>
                <div class="value">
                  <input v-if="isEditing" type="email" v-model="editedProfile.email" class="input" />
                  <span v-else class="text">{{ profile.email }}</span>
                </div>
              </div>
            </div>

            <div class="actions">
              <button v-if="isEditing" @click="handleCancel" class="btn btn-outline">Cancel</button>
              <button v-if="isEditing" @click="handleSave" class="btn btn-primary">Save</button>

              <button v-if="!isEditing" @click="handleEdit" class="btn btn-outline">Edit</button>
              <button v-if="!isEditing" class="btn btn-primary">Save</button>
            </div>
          </section>
        </div>

        <div class="logout">
          <button @click="handleLogout" class="btn btn-logout">Log out</button>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import { getUser, updateUser } from "@/services/api";

export default {
  name: 'UserProfile',
  components: { Header, Footer },
  data() {
    const saved = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      isEditing: false,
      profile: {
        name: saved.name || 'User',
        email: saved.email || 'unknown@example.com',
        avatar: saved.avatar || 'smart_wifi.png',
      },
      editedProfile: {}
    }
  },
  computed: {
    initial() {
      const n = (this.profile && this.profile.name) ? String(this.profile.name).trim() : '';
      return n ? n.charAt(0).toUpperCase() : 'U';
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('user') || '{}');
    if (saved && saved.email) {
      getUser(saved.email)
        .then(({ status, data }) => {
          if (status === 200 && data) {
            this.profile.name = data.name || this.profile.name;
            this.profile.email = data.email || this.profile.email;
            if (data.avatar) this.profile.avatar = data.avatar;
            localStorage.setItem('user', JSON.stringify({
              name: this.profile.name,
              email: this.profile.email,
              avatar: this.profile.avatar
            }));
            window.dispatchEvent(new CustomEvent('user-changed', { detail: { name: this.profile.name, email: this.profile.email, avatar: this.profile.avatar } }));
          } else {
            console.warn('getUser:', data?.message || 'status ' + status);
          }
        })
        .catch(err => {
          console.error('Failed to fetch user profile:', err);
        });
    }
  },
  methods: {
    handleEdit() {
      this.isEditing = true;
      this.editedProfile = { ...this.profile };
    },
    async handleSave() {
      try {
        const { status, data } = await updateUser({ email: this.profile.email, name: this.editedProfile.name });
        if (status === 200) {
          this.profile = { ...this.editedProfile };
          localStorage.setItem('user', JSON.stringify(this.profile));
          // notify same-tab listeners
          window.dispatchEvent(new CustomEvent('user-changed', { detail: this.profile }));
          alert('Profile saved successfully!');
          this.isEditing = false;
        } else {
          alert('Failed to update profile: ' + (data?.message || 'status ' + status));
        }
      } catch (err) {
        console.error('Profile update error:', err);
        alert(err?.data?.message || err.message || 'Failed to update profile.');
      }
    },
    handleCancel() {
      this.editedProfile = { ...this.profile };
      this.isEditing = false;
    },
    handleLogout() {
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('user-changed', { detail: {} }));
      this.$router.push('/login');
    }
  }
}
</script>


<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f3f4f6;
  font-family: Arial, Helvetica, sans-serif;
  color: #111827;
}

.site-header {
  margin-bottom: 0;
  padding-bottom: 0;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px 16px;
}

.container {
  width: 100%;
  max-width: 900px;
  padding: 0 12px;
  box-sizing: border-box;
}

.profile-label {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1f2937;
}

.profile-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 720px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
  text-align: center;
}

.avatar {
  width: 160px;
  height: 160px;
  margin: 0 auto 12px;
  border-radius: 50%;
  overflow: hidden;
  background: #e5e7eb;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
}

.info-list {
  display: block;
}
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eef2f7;
}
.info-row.last {
  border-bottom: none;
}
.info-row .label {
  color: #141414;
  font-weight: 600;
}
.info-row .value {
  min-width: 220px;
  text-align: right;
}
.info-row .value .text {
  color: #5a5a5a;
  font-weight: 500;
}

.input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  color: #111827;
  min-width: 180px;
  box-sizing: border-box;
}

.btn {
  padding: 9px 14px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #111827;
}
.btn-outline {
  background: #ffffff;
  border-color: #d1d5db;
}
.btn-outline:hover {
  background: #f8fafc;
}
.btn-primary {
  background: #2563eb;
  color: #ffffff;
  border: none;
}
.btn-primary:hover {
  background: #1e40af;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.logout {
  margin-top: 16px;
}
.btn-logout {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #dc2626;
  color: #dc2626;
  background: #ffffff;
  font-weight: 700;
}
.btn-logout:hover {
  background: #fff5f5;
}

@media (max-width: 520px) {
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .info-row .value {
    width: 100%;
    text-align: left;
    min-width: 0;
  }
  .actions {
    justify-content: stretch;
    flex-direction: column;
  }
  .actions .btn {
    width: 100%;
  }
}

.avatar { width: 96px; height: 96px; border-radius: 50%; display:flex; align-items:center; justify-content:center; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.08); font-size:36px; font-weight:700; color:#1e88e5 }
.avatar img { width:100%; height:100%; border-radius:50%; object-fit:cover }
</style>