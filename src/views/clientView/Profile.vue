<template>
   <div class="profile-card">
    <div class="profile-header">
      <img :src="avatarUrl" alt="Profile Avatar" class="avatar" />
      <h2 class="profile-title">My Profile</h2>
    </div>

    <div class="profile-body">
      <dl class="profile-list">
        <div class="profile-item">
          <dt>Name</dt>
          <dd>
            <input v-if="isEditing" v-model="form.name" class="input" />
            <span v-else>{{ form.name }}</span>
          </dd>
        </div>

        <div class="profile-item">
          <dt>Email</dt>
          <dd>
            <input v-if="isEditing" v-model="form.email" type="email" class="input" />
            <span v-else>{{ form.email }}</span>
          </dd>
        </div>

        <div class="profile-item">
          <dt>Phone Number</dt>
          <dd>
            <input v-if="isEditing" v-model="form.phone" class="input" />
            <span v-else>{{ form.phone }}</span>
          </dd>
        </div>

        <div class="profile-item">
          <dt>Gender</dt>
          <dd>
            <select v-if="isEditing" v-model="form.gender" class="input">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <span v-else>{{ form.gender }}</span>
          </dd>
        </div>

        <div class="profile-item">
          <dt>Country</dt>
          <dd>
            <input v-if="isEditing" v-model="form.country" class="input" />
            <span v-else>{{ form.country }}</span>
          </dd>
        </div>
      </dl>

      <div class="button-group">
        <button v-if="!isEditing" class="btn-edit" @click="enterEditMode">
          Edit
        </button>
        <template v-else>
          <button class="btn-cancel" @click="cancelEdit">Cancel</button>
          <button class="btn-save" @click="saveProfile">Save</button>
        </template>
      </div>
    </div>

    <div class="logout-container">
      <button class="btn-logout" @click="logout">Log out</button>
    </div>
  </div>
</template>

<script setup>
    import { ref, reactive } from 'vue'

const originalData = {
  name: 'Abby',
  email: 'abbythebest168@gmail.com',
  phone: '+885 99889969',
  gender: 'Male',
  country: 'Poland'
}

const form = reactive({ ...originalData })
const backup = { ...originalData }
const isEditing = ref(false)
const avatarUrl = ref('smart_wif.png')

const enterEditMode = () => { isEditing.value = true }
const cancelEdit = () => {
  Object.assign(form, backup)
  isEditing.value = false
}
const saveProfile = () => {
  console.log('Saved:', form)
  Object.assign(backup, form)
  isEditing.value = false
  alert('Profile saved!')
}
const logout = () => {
  if (confirm('Log out?')) alert('Logged out!')
}
</script>
<style scoped>
.profile-card {
  background: white;
  max-width: 420px;
  margin: 40px auto;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.profile-header { padding: 24px 24px 16px; text-align: center; }
.avatar { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; border: 4px solid #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.profile-title { margin: 16px 0 8px; font-size: 20px; font-weight: 600; color: #1a1a1a; }

.profile-body { padding: 0 24px 24px; }

.profile-list {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-item dt {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.profile-item dd {
  margin: 0;
  font-weight: 600;
  color: #1a1a1a;
}

.input, select.input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.button-group { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
button { padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; }
.btn-edit { background: #f0f2f5; color: #333; }
.btn-cancel { background: #e9ecef; color: #495057; }
.btn-save { background: #007bff; color: white; }
.btn-save:hover { background: #0056b3; }

.logout-container { text-align: center; padding: 20px 0; border-top: 1px solid #eee; }
.btn-logout { background: none; color: #e74c3c; border: 1px solid #e74c3c; padding: 10px 32px; border-radius: 8px; }
.btn-logout:hover { background: #e74c3c; color: white; }

@media (max-width: 480px) {
  .avatar { width: 80px; height: 80px; }
  .profile-card { margin: 20px; }
}
</style>