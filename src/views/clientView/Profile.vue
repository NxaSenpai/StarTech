<template>
  <Header />
  <div class="min-h-screen bg-gray-50 py-12  ">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-semibold text-gray-800 mb-8">My Profile</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Profile Picture Section -->
        <div class="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
          <div class="w-40 h-40 rounded-full overflow-hidden bg-gray-200 mb-4">
            <img
              :src="profile.avatar"
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

        <!-- Profile Information Section -->
        <div class="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div class="space-y-6">
            <!-- Name -->
            <div class="flex items-center justify-between border-b pb-4">
              <div class="flex items-center gap-3 text-gray-600 font-medium">
                <span>Name</span>
              </div>
              <input
                v-if="isEditing"
                type="text"
                v-model="editedProfile.name"
                class="px-3 py-1 border border-gray-300 rounded-md text-gray-800"
              />
              <span v-else class="text-gray-800 font-medium">{{ profile.name }}</span>
            </div>

            <!-- Email -->
            <div class="flex items-center justify-between border-b pb-4">
              <div class="flex items-center gap-3 text-gray-600 font-medium">
                <span>Email</span>
              </div>
              <input
                v-if="isEditing"
                type="email"
                v-model="editedProfile.email"
                class="px-3 py-1 border border-gray-300 rounded-md text-gray-800"
              />
              <span v-else class="text-gray-800">{{ profile.email }}</span>
            </div>

            <!-- Phone -->
            <div class="flex items-center justify-between border-b pb-4">
              <div class="flex items-center gap-3 text-gray-600 font-medium">
                <span>Phone Number</span>
              </div>
              <input
                v-if="isEditing"
                type="tel"
                v-model="editedProfile.phone"
                class="px-3 py-1 border border-gray-300 rounded-md text-gray-800"
              />
              <span v-else class="text-gray-800">{{ profile.phone }}</span>
            </div>

            <!-- Gender -->
            <div class="flex items-center justify-between border-b pb-4">
              <div class="flex items-center gap-3 text-gray-600 font-medium">
                <span>Gender</span>
              </div>
              <select
                v-if="isEditing"
                v-model="editedProfile.gender"
                class="px-3 py-1 border border-gray-300 rounded-md text-gray-800"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <span v-else class="text-gray-800">{{ profile.gender }}</span>
            </div>

            <!-- Country -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 text-gray-600 font-medium">
                <span>Country</span>
              </div>
              <input
                v-if="isEditing"
                type="text"
                v-model="editedProfile.country"
                class="px-3 py-1 border border-gray-300 rounded-md text-gray-800"
              />
              <span v-else class="text-gray-800">{{ profile.country }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-8">
            <button
              v-if="isEditing"
              @click="handleCancel"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              v-if="isEditing"
              @click="handleSave"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              v-if="!isEditing"
              @click="handleEdit"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            <button
              v-if="!isEditing"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <!-- Logout Button -->
      <div class="mt-6">
        <button 
          @click="handleLogout"
          class="w-full py-3 border-2 border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          Log out
        </button>
      </div>
    </div>
  </div>
  <Footer />
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
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>