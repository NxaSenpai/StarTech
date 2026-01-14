<template>
  <div class="min-h-screen bg-gray-50 w-full ">
    <Header />

    <!-- Stripe/Notion-style Alert -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showAlert" class="fixed top-6 right-6 z-50">
        <div
          class="flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border max-w-md"
          :class="{
            'bg-white border-green-200': alertType === 'success',
            'bg-white border-blue-200': alertType === 'info',
            'bg-white border-red-200': alertType === 'error'
          }"
        >
          <div class="flex-shrink-0 mt-0.5">
            <svg v-if="alertType === 'success'" class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-if="alertType === 'info'" class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <svg v-if="alertType === 'error'" class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ alertMessage }}</p>
          </div>
          <button @click="showAlert = false" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <div class="mx-auto px-90 py-12 ">
      
      <!-- Page Header -->
      <div class="mb-12">
        <h1 class="text-3xl text-gray-900" style="font-weight: 700; margin-bottom: 15px;">My Profile</h1>
        <!-- <p class="text-sm text-gray-500">Manage your account settings and preferences</p> -->
      </div>

      <div class="flex gap-8">
        
        <!-- Sidebar Navigation -->
        <aside class="w-56 flex-shrink-0">
          <nav class="space-y-1">
            <button
              v-for="item in menuItems"
              :key="item.id"
              @click="activeTab = item.id"
              class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="activeTab === item.id ? 'bg-[#A7CCF6]' : ' hover:text-[#A7CCF6] hover:bg-gray-100'"
              style="font-weight: 650;"
            >
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.label }}
            </button>
          </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0">
          
          <!-- Profile Tab -->
          <div v-show="activeTab === 'profile'" class="grid gap-2" >
            <!-- Profile Header -->
            <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6 transition-transform duration-400 ease-in-out
                    hover:scale-101 hover:shadow-lg" >
              <div class="flex items-start gap-6">
                <div class="relative flex-shrink-0">
                  <img
                    :src="isEditingBasic ? editedProfile.avatar : profile.avatar"
                    alt="Profile"
                    class="w-20 h-20 rounded-full object-cover border border-gray-200"
                  />
                  <label v-if="isEditingBasic" class="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" accept="image/*" @change="onAvatarChange" class="hidden" />
                  </label>
                </div>
                <div class="flex-1">
                  <h2 class="text-xl font-bold text-gray-900 mb-1">{{ profile.fullName }}</h2>
                  <p class="text-sm text-gray-500 mb-4">{{ profile.email }}</p>
                  <button
                    v-if="!isEditingBasic"
                    @click="handleEditBasic"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-indigo-400 hover:text-white transition-colors"
                  >
                    Edit profile
                  </button>
                  <div v-else class="flex gap-2">
                    <button @click="handleSaveBasic" class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                      Save changes
                    </button>
                    <button @click="handleCancelBasic" class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Personal Information -->
            <div class="bg-white rounded-lg border border-gray-300 p-6 mb-6 transition-transform duration-400 ease-in-out
                    hover:scale-101 hover:shadow-lg">
              <h3 class="text-lg  text-gray-900 mb-6 font-bold ">Personal information</h3>
              <div class="grid grid-cols-1 gap-3">
                <div class="flex justify-between">
                  <label class="block text-sm font-medium  mb-2">Full name</label>
                  <input
                    v-if="isEditingBasic"
                    v-model="editedProfile.fullName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <div v-else class="text-sm text-gray-900 py-2">{{ profile.fullName }}</div>
                </div>
                <div class="flex justify-between">
                  <label class="block text-sm font-medium  mb-2">Gender</label>
                  <input
                    v-if="isEditingBasic"
                    v-model="editedProfile.username"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <div v-else class="text-sm text-gray-900 py-2">{{ profile.Gender }}</div>
                </div>
                <div class="flex justify-between">
                  <label class="block text-sm font-medium  mb-2">Email address</label>
                  <input
                    v-if="isEditingBasic"
                    v-model="editedProfile.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <div v-else class="text-sm text-gray-900 py-2">{{ profile.email }}</div>
                </div>
                <div class="flex justify-between">
                  <label class="block text-sm font-medium  mb-2">Phone number</label>
                  <input
                    v-if="isEditingBasic"
                    v-model="editedProfile.phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <div v-else class="text-sm text-gray-900 py-2">{{ profile.phone }}</div>
                  
                </div>
                <div class="flex justify-between">
                  <label class="block text-sm font-medium  mb-2">Country</label>
                  <input
                    v-if="isEditingBasic"
                    v-model="editedProfile.phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <div v-else class="text-sm text-gray-900 py-2">{{ profile.country }}</div>
                  
                </div>
              </div>
            </div>

            <!-- Activity Stats -->
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-white rounded-lg border border-[#0573F0] p-5
                    transition-transform duration-400 ease-in-out
                    hover:scale-105 hover:shadow-lg
                    ">
                <div class="text-2xl font-bold text-gray-900 mb-1 ">{{ orders.length }}</div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Orders</div>
              </div>
              <div class="bg-white rounded-lg border border-[#F79F1A] p-5 transition-transform duration-400 ease-in-out
                    hover:scale-105 hover:shadow-lg">
                <div class="text-2xl font-bold text-gray-900 mb-1">{{ addresses.length }}</div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Addresses</div>
              </div>
              <div class="bg-white rounded-lg border border-[#54A96A] p-5 transition-transform duration-400 ease-in-out
                    hover:scale-105 hover:shadow-lg">
                <div class="text-2xl font-bold text-gray-900 mb-1">5</div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Wishlist Items</div>
              </div>
            </div>
          </div>

          <!-- Orders Tab -->
          <div v-show="activeTab === 'orders'">
            <div class="bg-white rounded-lg border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-bold text-gray-900">Order history</h3>
              </div>
              <div class="divide-y divide-gray-200">
                <div
                  v-for="order in orders"
                  :key="order.id"
                  class="px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h4 class="text-sm font-bold text-gray-900">{{ order.id }}</h4>
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="{
                            'bg-green-100 text-green-800': order.status === 'Delivered',
                            'bg-blue-100 text-blue-800': order.status === 'Shipped',
                            'bg-yellow-100 text-yellow-800': order.status === 'Processing'
                          }"
                        >
                          {{ order.status }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500">{{ order.date }}</p>
                    </div>
                    <div class="flex items-center gap-6">
                      <span class="text-lg font-bold text-gray-900">{{ order.total }}</span>
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Addresses Tab -->
          <div v-show="activeTab === 'addresses'">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-900">Saved addresses</h3>
              <button class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Add address
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="address in addresses"
                :key="address.id"
                class="bg-white rounded-lg border p-5 transition-all hover:shadow-md"
                :class="address.isDefault ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'"
              >
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h4 class="text-sm font-bold text-gray-900 mb-1">{{ address.name }}</h4>
                    <span v-if="address.isDefault" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                      Default
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <button class="text-sm text-gray-600 hover:text-gray-900 transition-colors">Edit</button>
                    <button class="text-sm text-red-600 hover:text-red-800 transition-colors">Remove</button>
                  </div>
                </div>
                <div class="text-sm text-gray-600 space-y-1">
                  <p>{{ address.street }}</p>
                  <p>{{ address.city }}, {{ address.postal }}</p>
                  <p>{{ address.country }}</p>
                  <p class="pt-2 text-gray-900">{{ address.phone }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-show="activeTab === 'security'">
            <!-- Password -->
            <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 class="text-lg font-bold text-gray-900 mb-6">Change password</h3>
              <div class="space-y-4 max-w-md">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Current password</label>
                  <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">New password</label>
                  <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
                  <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                </div>
                <button class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                  Update password
                </button>
              </div>
            </div>

            <!-- Two-Factor -->
            <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 mb-2">Two-factor authentication</h3>
                  <p class="text-sm text-gray-500 mb-4">Add an extra layer of security to your account. We'll ask for a code when you sign in.</p>
                </div>
                <button class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                  Enable
                </button>
              </div>
            </div>

            <!-- Sessions -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-6">Active sessions</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">Windows PC — Chrome</div>
                      <div class="text-xs text-gray-500">Active now · New York, US</div>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Current
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">iPhone — Safari</div>
                      <div class="text-xs text-gray-500">5 days ago · Los Angeles, US</div>
                    </div>
                  </div>
                  <button class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-show="activeTab === 'paymentMethod'">
            hello
          </div>

          <!-- Logout Section -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <button @click="handleLogout" class="text-sm text-red-600 hover:text-red-800 font-medium transition-colors">
              Sign out of all devices
            </button>
          </div>

        </main>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import {CreditCardIcon,UserIcon,ShoppingCartIcon,ShieldCheckIcon,MapPinIcon} from '@heroicons/vue/24/outline';
export default {
  name: 'UserProfile',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      activeTab: 'profile',
      isEditingBasic: false,
      showAlert: false,
      alertMessage: '',
      alertType: 'success',
      profile: {
        fullName: 'Monirom YI',
        Gender: 'Male',
        email: 'moniromyi@gmail.com',
        phone: '+1 234 567 8900',
        country:'Cambodia',
        avatar: 'cat_profie.png'
      },
      editedProfile: {},
      menuItems: [
        { 
          id: 'profile', 
          label: 'Profile',
          icon:UserIcon
        },
        { 
          id: 'orders', 
          label: 'Orders',
          icon: ShoppingCartIcon
        },
        { 
          id: 'addresses', 
          label: 'Addresses',
          icon: MapPinIcon
        },
        { 
          id: 'security', 
          label: 'Security',
          icon: ShieldCheckIcon
        },
        {
          id:'paymentMethod',
          label:'Payment Method',
          icon: CreditCardIcon
        }
      ],
      addresses: [
        {
          id: 1,
          name: 'Monirom YI',
          phone: '+1 234 567 8900',
          street: '123 Main Street, Apt 4B',
          city: 'New York',
          postal: '10001',
          country: 'United States',
          isDefault: true
        },
        {
          id: 2,
          name: 'Monirom YI',
          phone: '+1 234 567 8900',
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          postal: '90001',
          country: 'United States',
          isDefault: false
        }
      ],
      orders: [
        { id: '#ORD-2024-001', date: 'December 20, 2024', status: 'Delivered', total: '$156.00' },
        { id: '#ORD-2024-002', date: 'December 15, 2024', status: 'Shipped', total: '$89.50' },
        { id: '#ORD-2024-003', date: 'December 10, 2024', status: 'Processing', total: '$245.00' }
      ],
      paymentMethod:[
        { id: 1, name: "Credit / Debit Card", supported: ["Visa", "MasterCard"] },
        { id: 2, name: "E-Wallet", supported: ["ABA Pay", "Wing", "TrueMoney"] },
        { id: 3, name: "Bank Transfer", supported: ["ABA Bank", "ACLEDA Bank"] },
        { id: 4, name: "Cash on Delivery", supported: [] }
      ]
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
    handleEditBasic() {
      this.isEditingBasic = true;
      this.editedProfile = { ...this.profile };
    },
    handleSaveBasic() {
      this.profile = { ...this.editedProfile };
      this.isEditingBasic = false;
      this.showAlertMessage('Your profile has been updated successfully.', 'success');
    },
    handleCancelBasic() {
      this.editedProfile = { ...this.profile };
      this.isEditingBasic = false;
    },
    handleLogout() {
      this.showAlertMessage('You have been signed out.', 'info');
      setTimeout(() => {
        // Add logout logic here
      }, 1000);
    },
    onAvatarChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.editedProfile.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
</script>

<style>
  .font-bold{
    font-weight: 600;
  }
  .font-medium{
    font-weight: 500;
  }
</style>