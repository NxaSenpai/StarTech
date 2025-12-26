<template>
  <Header />
  <div class="min-h-screen bg-gray-50 py-12  ">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-semibold text-gray-800 mb-8">My Profil e</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Profile Picture Section -->
        <div class=" rounded-lg  p-6 flex flex-col items-center">
          <div class="w-40 h-40 rounded-full overflow-hidden bg-gray-200 mb-4">
            <input 
              type="file"
              v-if="isEditing"
              @change="onAvatarChange"
              class="absolute w-40 h-40 opacity-0 cursor-pointer"
            >
            <img
                :src="profile.avatar || editedProfile.avatar"
                alt="Profile"
                class="w-full h-full object-cover"
              />
          </div>
          <button
            @click="handleEdit"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
        </div>

              <div class="info-row">
                <div class="label">Email</div>
                <div class="value">
                  <input v-if="isEditing" type="email" v-model="editedProfile.email" class="input" />
                  <span v-else class="text">{{ profile.email }}</span>
                </div>
              </div>

              <div class="info-row">
                <div class="label">Phone Number</div>
                <div class="value">
                  <input v-if="isEditing" type="tel" v-model="editedProfile.phone" class="input" />
                  <span v-else class="text">{{ profile.phone }}</span>
                </div>
              </div>

              <div class="info-row">
                <div class="label">Gender</div>
                <div class="value">
                  <select v-if="isEditing" v-model="editedProfile.gender" class="input">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <span v-else class="text">{{ profile.gender }}</span>
                </div>
              </div>

              <div class="info-row last">
                <div class="label">Country</div>
                <div class="value">
                  <input v-if="isEditing" type="text" v-model="editedProfile.country" class="input" />
                  <span v-else class="text">{{ profile.country }}</span>
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
export default {
  name: 'UserProfile',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      isEditing: false,
      profile: {
        name: 'Abby',
        email: 'abbythebest168@gmail.com',
        phone: '+885 99889969',
        gender: 'Male',
        country: 'Poland',
        avatar: 'smart_wifi.png'
      },
      editedProfile: {}
    }
  },
  methods: {
    handleEdit() {
      this.isEditing = true;
      this.editedProfile = { ...this.profile };
    },
    handleSave() {
      this.profile = { ...this.editedProfile };
      this.isEditing = false;
      alert('Profile saved successfully!');
    },
    handleCancel() {
      this.editedProfile = { ...this.profile };
      this.isEditing = false;
    },
    handleLogout() {
      if (confirm('Are you sure you want to log out?')) {
        alert('Logged out successfully!');
        // Add logout logic here
      }
    },
    onAvatarChange(event){
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          // this.previewAvatar = e.target.result;
          this.editedProfile.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
</script>

<style scoped>
/* Page layout */
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
</style>